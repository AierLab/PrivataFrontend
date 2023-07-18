declare module "privataclient/chat" {
  export type ChatMessageType = "text" | "image" | "error"
  export interface ChatMessageBase {
    type: ChatMessageType,
    generating: boolean,
  }

  export type TextMessage = ChatMessageBase & {
    type: "text",
    content: string,
  }
  
  export type ImageMessage = ChatMessageBase & {
    type: "image",
    src: string,
  }

  export type ErrorMessage = ChatMessage & {
    type: 'error',
    code: number,
    message: string,
  }

  export type ChatMessage = TextMessage | ImageMessage | ErrorMessage

  export interface Conversation {
    title: string,
    role: string,
    history: {
      // TODO: user may edits previous and created a branch
      // refer to ChatGPT
      sender: "user" | "ai",
      time: Date,
      message: ChatMessage
    }[],
  }
}
