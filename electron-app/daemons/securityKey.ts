import { usb } from 'usb'
import drivelist from 'drivelist'
import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'

const FILE_EXT = '.prakey'

interface SecurtyKeyVerificationResuslt {
  status: 'verified' | 'unverified' | 'noKey' | 'error',
  path?: string,
  device?: drivelist.Drive,
  error?: unknown,
}

class SecurityKeyDaemon extends EventEmitter {
  private last_verify_result: SecurtyKeyVerificationResuslt

  public constructor() {
    super()
    this.last_verify_result = { status: 'unverified' }

    usb.on('attach', async (device) => {
      console.debug("a new usb device have attached")
      this.emit('device_attach', device)
      
      this.emit('verifying')
      const verify_result = await this.findSecurityKey()
      this.last_verify_result = verify_result
      this.emit('verification_changed', verify_result)
    })

    usb.on("detach", async function (device) {
      console.debug("a usb device detached")
      this.emit('device_detach', device)
    })
  }

  validateStatus = async () => {
    if (this.last_verify_result.status !== 'verified') return

    // const drvs = await drivelist.list()
    // const drv = drvs.find(d => d.devicePath === this.last_verify_result.device?.devicePath)
    // if(!drv) return false
    return true
  }

  findSecurityKey = async (): Promise<SecurtyKeyVerificationResuslt> => {
    try {
      const drvs = await drivelist.list()
      const usbDrvs = drvs.filter(d => d.isUSB)

      // iter over devices and check every mountpoint
      usbDrvs.forEach(device => {
        device.mountpoints.forEach(mnt => {
          const files = fs.readdirSync(mnt.path)
          const keyFiles = files.filter(fn => fn.endsWith(FILE_EXT))

          keyFiles.forEach(keyFilename => {
            const keyPath = path.join(mnt.path, keyFilename)
            if (this._isKeyValid(keyPath)){
              return {
                status: 'verified',
                path: keyPath,
                device: device,
              }
            }
          })

        })
      })

      return { status: 'noKey' }
    } catch (error) {
      console.error("error when finding security key", error)
      return { status: 'error', error: error }
    }
  }

  private async _watchFile(filepath) {
    // TODO: continues watch the file changes
  }

  _isKeyValid(keyPath) {
    // TODO
    return true
  }
}

export default SecurityKeyDaemon
