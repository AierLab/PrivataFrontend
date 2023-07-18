import axios, { AxiosResponse } from 'axios'
import {
    ChatHistoryFetchResponse,
  ChatRequestPayload,
  ChatResponse,
  ClearHistoryResponse,
  ContinueChatRequestPayload,
  ContinueChatResponse,
  NewChatRequestPayload,
  NewChatResponse,
  PersonaChangePayload,
  ResourceRequirements,
  UserFeedbackRequestPayload,
  UserFeedbackResponse
} from 'api/chat'
import { Conversation, TextMessage } from 'privataclient/chat'

const API_ENDPOINT = 'http://localhost:8081/'
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})

const FetchChatReply = async (text: string, resource?: ResourceRequirements) => {
  const payload = {
    text,
    resource_requirements: resource
  }
  return api.post<ChatRequestPayload, AxiosResponse<ChatResponse, any>>('/api/text', payload)
}

const SendFeedback = async (complain: string) => {
  const payload = {
    user_feedback: complain
  }
  return api.post<UserFeedbackRequestPayload, AxiosResponse<UserFeedbackResponse>>('/api/feedback', payload)
}

const ClearHistory = async () => {
  const payload = {}
  return api.delete<{}, AxiosResponse<ClearHistoryResponse>>('/api/history', payload)
}

const NewChat = async (role: string) => {
  const payload = { role }
  return api.post<NewChatRequestPayload, AxiosResponse<NewChatResponse>>('/api/new', payload)
}

const ChangePersona = async (role: string) => {
  const payload = { role }
  return api.post<PersonaChangePayload, AxiosResponse<PersonaChangePayload>>('/api/?', payload) // TODO
}

const FetchHistory = async () => {
  return api.post<{}, AxiosResponse<ChatHistoryFetchResponse>>('/api/history', {})
}

const ContinueChat = async (history: Conversation, role: string, text: string, resource?: ResourceRequirements) => {
  const payload: ContinueChatRequestPayload = {
    history: history.history.map(c => {
      return { sender: c.sender, message: (c.message as TextMessage).content }
    }),
    role,
    text,
    resource_requirements: resource,
  }
  return api.post<ContinueChatRequestPayload, AxiosResponse<ContinueChatResponse>>('/api/chat/continue', payload)
}

export { FetchChatReply, SendFeedback, ClearHistory, NewChat, ChangePersona, FetchHistory, ContinueChat }
