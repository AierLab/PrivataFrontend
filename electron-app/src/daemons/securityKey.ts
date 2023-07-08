import { usb } from 'usb'
import * as drivelist from 'drivelist'
import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import { DeviceModels, ManifestVersions, SecurityKeyManifest, SecurityKeyManifestV1 } from '../types/securityKey'

const FILE_EXT = '.prakey'
export type SecurityKeyVerificationStatus = 'verified' | 'unverified' | 'noKey' | 'error'
export interface SecurtyKeyVerificationResult {
  status: SecurityKeyVerificationStatus,
  path?: string,
  device?: drivelist.Drive,
  error?: unknown,
  manifest?: SecurityKeyManifestV1,
}

declare interface SecurityKeyDaemon {
  on(event: 'device_attach', listener: (deivce: usb.Device) => void): this
  on(event: 'device_detach', listener: (deivce: usb.Device) => void): this
  on(event: 'verifying', listener: () => void): this
  on(event: 'verification_changed', listener: (verifyResult: SecurtyKeyVerificationResult) => void): this
  refresh(): Promise<void>
}

class SecurityKeyDaemon extends EventEmitter {
  private last_verify_result: SecurtyKeyVerificationResult

  public constructor() {
    super()
    this.last_verify_result = { status: 'unverified' }

    usb.on('attach', async (device) => {
      console.debug("a new usb device have attached")
      this.emit('device_attach', device)

      this.refresh()
    })

    usb.on("detach", async (device) => {
      console.debug("a usb device detached")
      this.emit('device_detach', device)

      // TODO: refresh
      this.refresh()
    })
  }

  public refresh = async () => {
    if (this.last_verify_result.status === 'unverified' || this.last_verify_result.status === 'noKey') {
      this.emit('verifying')
      const verify_result = await this.findSecurityKey()
      if (!(this.last_verify_result.status === verify_result.status)){
        this.last_verify_result = verify_result
        this.emit('verification_changed', verify_result)
        if (verify_result.status === 'verified') {
          this._watchFile(verify_result.path)
        }
      }
      
      
    } else if (this.last_verify_result.status === 'verified') {
      const verify_result = this.checkPath(this.last_verify_result.path)
      if (!(verify_result.status === "verified")) {
        fs.unwatchFile(this.last_verify_result.path)
        this.last_verify_result = verify_result
        this.emit('verification_changed', verify_result)
      }

    }



  }

  private validateStatus = async () => {
    if (this.last_verify_result.status !== 'verified') return

    // const drvs = await drivelist.list()
    // const drv = drvs.find(d => d.devicePath === this.last_verify_result.device?.devicePath)
    // if(!drv) return false
    return true
  }

  private findSecurityKey = async (): Promise<SecurtyKeyVerificationResult> => {
    try {

      const drvs = await drivelist.list()
      const usbDrvs = drvs.filter(d => d.isUSB)

      // iter over devices and check every mountpoint
      for (const device of usbDrvs) {
        for (const mnt of device.mountpoints) {
          console.log(mnt.path)
          const files = fs.readdirSync(mnt.path)
          const keyFiles = files.filter(fn => fn.endsWith(FILE_EXT))

          for (const keyFilename of keyFiles) {
            const keyPath = path.join(mnt.path, keyFilename)
            const { ok, manifest } = this.isKeyValid(keyPath)
            if (ok) {
              return {
                status: 'verified',
                path: keyPath,
                device: device,
                manifest: manifest,
              }
            }
          }

        }
      }

      return { status: 'noKey' }
    } catch (error) {
      console.error("error when finding security key", error)
      return { status: 'error', error: error }
    }
  }

  private checkPath = (filepath: string): SecurtyKeyVerificationResult => {
    //Check whether the path is still a valid path
    if (fs.existsSync(filepath)) {
      const { ok, manifest } = this.isKeyValid(filepath)
      if (ok) {
        return {
          status: 'verified',
          path: filepath,
          manifest: manifest,
        }
      } else {
        return { status: 'noKey' }
      }
    }

    return { status: 'noKey' }

  }



  private _watchFile = async (filepath: string) => {
    // TODO: continues watch the file changes
    fs.watchFile(filepath,
      { persistent: true, interval: 1000 },
      (cur, prev) => {
        console.log("The keyFile is edited")
        const verify_result = this.checkPath(filepath)
        if (!(verify_result.status === this.last_verify_result.status)) {
          this.last_verify_result = verify_result
          this.emit('verification_changed', verify_result)
        }
      })
  }

  private isKeyValid(keyPath: string) {
    try {
      const content = fs.readFileSync(keyPath, { encoding: 'utf8' })
      const manifest: SecurityKeyManifest = JSON.parse(content)

      switch (manifest.version) {
        case ManifestVersions.v1: {
          const v1 = manifest as SecurityKeyManifestV1
          return {
            ok: v1.device.model === DeviceModels.usbstick,
            manifest: v1
          }
        }
        default: {
          console.error('unrecognized manifest version', manifest.version)
          return { ok: false }
        }
      }
    } catch (e) {
      console.error(e)
      return { ok: false }
    }
  }
}

export default SecurityKeyDaemon
