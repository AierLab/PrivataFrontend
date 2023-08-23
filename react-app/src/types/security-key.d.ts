import { SecurityKeyVerificationStatus, SecurityKeyManifest } from '@privata/types/security-key'

export interface SecurityKeyVerificationContext {
  status: SecurityKeyVerificationStatus,
  manifest: SecurityKeyManifest
}
