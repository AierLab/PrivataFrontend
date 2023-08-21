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


export interface ChatRequestPayload {
  text: string,
  user_feedback?: '',
  resource_requirements?: '',
}

export interface ChatResponse {
  result: string
}

export interface ChatConversation {
  sender:string,
  message: string
}


export interface HistoryRequestPayload {chat_uid:string}
export interface HistoryResponse{history:ChatConversation[]}

export interface NewChatRequestPayload { chat_uid: string }
export interface SwitchChatRequestPayload { chat_uid: string }
export interface DeleteChatRequestPayload { chat_uid: string }

export interface NewRoleRequestPayload {role_uid: string}
export interface SwitchRoleRequestPayload {role_uid: string}
export interface DeleteRoleRequestPayload {role_uid: string}

export interface UserFeedbackRequestPayload { user_feedback: boolean }


export type ChatMessageType = ChatMessageTypeContinuous | ChatMessageTypeNonContinuous

