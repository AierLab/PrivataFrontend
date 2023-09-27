import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios'

const API_ENDPOINT = "http://aidvisor.valmech.net:5000";
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})

export interface GetFileRatingResponse {
  data: string
}

export const GetFileRating = async (payload: FormData, onProgressUpdate: (p: AxiosProgressEvent) => void) => {
  const config: AxiosRequestConfig = {
    onUploadProgress: onProgressUpdate
  }
  return await api.post('/api/file/rating', payload, config)
}

