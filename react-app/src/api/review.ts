import axios from 'axios'

const API_ENDPOINT = "http://aidvisor.valmech.net:5000";
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})

export const GetFileRating = async (payload: FormData) => {
  return await api.post('/api/file/rating', payload)
}
