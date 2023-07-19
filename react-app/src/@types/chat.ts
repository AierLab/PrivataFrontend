export type ContentGeneratorCallbackFunction = (text: string, finished: boolean) => void

export type ContentGenerator = (cb: ContentGeneratorCallbackFunction) => void

export interface ChatMessageTypeNonContinuous {
  id: string,
  content: string,
  time: Date,
  avatar: string,
  continuous?: false
}
export interface ChatMessageTypeContinuous {
  id: string,
  content_provider: ContentGenerator,
  time: Date,
  avatar: string,
  continuous: true
}

interface ChatConversation {
  sender:string,
  message: string
}
export type ChatMessageType = ChatMessageTypeContinuous | ChatMessageTypeNonContinuous

