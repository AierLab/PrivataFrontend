declare module 'api/chat' {
  export interface ResourceRequirements {
    time: string,
    memory: string,
  }

  export interface ChatRequestPayload {
    text: string,
    resource_requirements?: ResourceRequirements
  }
  export interface UserFeedbackRequestPayload { user_feedback: string }
  export interface NewChatRequestPayload { role: string }
  export interface PersonaChangeRequestPayload { role: string }

  export interface ChatResponseCommonError { error: string }
  export interface ChatResponseCommonMessageOK { message: string }
  export interface ChatResponseOK { result: string }

  export type ChatResponse = ChatResponseOK | ChatResponseCommonMessageOK
  export type UserFeedbackResponse = ChatResponseCommonError | ChatResponseCommonMessageOK
  export type ClearHistoryResponse = ChatResponseCommonError | ChatResponseCommonMessageOK
  export type NewChatResponse = ChatResponseCommonError | ChatResponseCommonMessageOK
  export type PersonaChangePayload = ChatResponseCommonError | ChatResponseCommonMessageOK
  export type ContinueChatResponse = ChatResponseCommonMessageOK
  export interface ChatHistoryFetchResponse {
    history: ChatHistoryItem[]
  }

  export interface ChatHistoryItem {
    sender: "user" | "ai",
    message: string,
  }
  export interface ContinueChatRequestPayload {
    history: ChatHistoryItem[],
    role: string,
    text: string,
    resource_requirements?: {
      time: string,
      memory: string,
    }
  }

  export interface ChatConversation {
    title: string,
    role: string,
    history: ChatHistoryItem[],
  }
}
