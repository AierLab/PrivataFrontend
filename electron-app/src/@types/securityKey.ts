export enum ManifestVersions {
  v1 = 'v1.manifest.key.privata', 
  v2 = 'v2.manifest.key.privata', 
}
export enum DeviceModels {
  usbstick = 'usbstick.device.key.privata',
  computestick = 'computestick.device.key.privata',
}

export interface SecurityKeyManifest {
  version: ManifestVersions
}

export interface SecurityKeyManifestV1 extends SecurityKeyManifest {
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
