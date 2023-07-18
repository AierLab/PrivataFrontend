import ChatProvisioner from "@/features/chat"

declare module "context/FeatureDaemon" {
  type FeatureDaemonContextValue = Record<string, FeatureDaemon>
  type FeatureDaemon = ChatProvisioner & { name: string }
}
