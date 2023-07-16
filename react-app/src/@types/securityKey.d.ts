import { DeviceModels, ManifestVersions } from "./enums";

export { };

declare global {
  interface SecurityKeyManifest {
    version: ManifestVersions
  }

  interface SecurityKeyManifestV1 extends SecurityKeyManifest {
    device: {
      uuid: string
      model: DeviceModels
    }
    authorized_to: {
      username: string
      userid: number
      token: string
    }
    personas: {
      uuid: string
      name: string
      desc: string
      avatar: string
      features: string[]
      compatibility: string
    }[]
  }

  type SecurityKeyVerificationStatus = 'verified' | 'verifing' | 'unverified' | 'noKey' | 'error'

  interface SecurityKeyVerificationContext {
    status: SecurityKeyVerificationStatus,
    manifest: SecurityKeyManifest
  }
}
