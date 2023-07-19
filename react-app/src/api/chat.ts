import axios, { AxiosResponse } from 'axios'

const API_ENDPOINT = 'http://localhost:8080'
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})

export interface ChatRequestPayload {
  text: string,
  user_feedback?: '',
  resource_requirements?: '',
}

export interface ChatResponse {
  result: string
}

interface ChatConversation {
  sender:string,
  message: string
}


export interface HistoryRequestPayload {
  chat_uid:string,
}


export interface HistoryResponse{
  history:ChatConversation[]

}

const FetchChatResponse = async (payload: ChatRequestPayload) => {
  return api.post<ChatRequestPayload, AxiosResponse<ChatResponse>>('/api/text', payload)
}

const GetChatHistory = async (payload: HistoryRequestPayload) => {
  return api.post<HistoryRequestPayload,AxiosResponse<HistoryResponse>>('/api/history', payload)
}

export { FetchChatResponse, GetChatHistory}
