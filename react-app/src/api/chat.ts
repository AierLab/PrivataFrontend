import { ChatRequestPayload, ChatResponse, DeleteChatRequestPayload, DeleteRoleRequestPayload, HistoryRequestPayload, HistoryResponse, NewChatRequestPayload, NewRoleRequestPayload, SwitchChatRequestPayload, SwitchRoleRequestPayload, UserFeedbackRequestPayload } from '@/@types/chat'
import axios, { AxiosResponse } from 'axios'

const API_ENDPOINT = 'http://localhost:8080'
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})

/* The APIs for creating chats, switching chats, and deleting chats */
const CreateChat = async (payload: NewChatRequestPayload) => {
  const response = await api.post<NewChatRequestPayload>('/api/create/chat', payload)
  if (response.status === 200){
    return response
  }else{
    return null
  }
}


const DeleteChat = async (payload: DeleteChatRequestPayload) => {
  const response = await api.delete<DeleteChatRequestPayload>('/api/delete/chat', {data:payload})
  if (response.status === 200){
    return response
  }else{
    return null
  }
}

const SwitchChat = async (payload: SwitchChatRequestPayload) => {
  const response = await api.post<SwitchChatRequestPayload>('/api/switch/chat', payload)
  if (response.status === 200){
    return response
  }else{
    return null
  }
}

/* The APIs for creating a new role(also called persona), switching to other role, and delete a role */
const CreateRole = async (payload: NewRoleRequestPayload) => {
  const response = await api.post<NewRoleRequestPayload>('/api/create/role', payload)
  if (response.status === 200){
    return response
  }else{
    return null
  }
}


const DeleteRole = async (payload: DeleteRoleRequestPayload) => {
  const response = await api.delete<DeleteRoleRequestPayload>('/api/delete/role', {data:payload})
  if (response.status === 200){
    return response
  }else{
    return null
  }
}

const SwitchRole = async (payload: SwitchRoleRequestPayload) => {
  const response = await api.post<SwitchRoleRequestPayload>('/api/switch/role', payload)
  if (response.status === 200){
    return response
  }else{
    return null
  }
}


/* The API for establish a conversation between the user and the ai model*/

const FetchChatResponse = async (payload: ChatRequestPayload) => {
  return api.post<ChatRequestPayload, AxiosResponse<ChatResponse>>('/api/text', payload)
}

/* The API for Getting or Deleting the chat history for a given chat*/
const GetChatHistory = async (payload: HistoryRequestPayload) => {
  return api.post<HistoryRequestPayload,AxiosResponse<HistoryResponse>>('/api/history', payload)
}

const ClearChatHistory = async (payload: HistoryRequestPayload) => {
  return api.delete<HistoryRequestPayload,AxiosResponse<HistoryResponse>>('/api/history', {data:payload})
}

/* The API for User Feedback */
const UserFeedback = async (payload: UserFeedbackRequestPayload) => {
  return api.post<UserFeedbackRequestPayload>('/api/feedback')
}

export { CreateChat, DeleteChat, SwitchChat, CreateRole, DeleteRole, SwitchRole, FetchChatResponse, GetChatHistory}
