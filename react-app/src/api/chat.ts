import axios, { AxiosResponse } from 'axios'

const API_ENDPOINT = 'http://hw9fnp.natappfree.cc/'
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

const FetchChatResponse = async (payload: ChatRequestPayload) => {
  return api.post<ChatRequestPayload, AxiosResponse<ChatResponse>>('/api/text', payload)
}

export { FetchChatResponse }
