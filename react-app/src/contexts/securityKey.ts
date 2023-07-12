import { createContext } from 'react'
import { ManifestVersions } from '../@types/enums'

const SecurityKeyContext = createContext<SecurityKeyVerificationContext>({
  status: 'unverified',
  manifest: { version: ManifestVersions.v1 },
})

export { SecurityKeyContext }
