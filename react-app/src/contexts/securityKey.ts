import { createContext } from 'react'
import { ManifestVersion } from '@privata/types/security-key'
import { SecurityKeyVerificationContext } from 'types/security-key'

const SecurityKeyContext = createContext<SecurityKeyVerificationContext>({
  status: 'unverified',
  manifest: { version: ManifestVersion.v1 },
})

export { SecurityKeyContext }
