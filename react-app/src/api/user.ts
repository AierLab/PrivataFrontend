import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { apiGet, apiPost } from '../utils/request';

const API_ENDPOINT = "http://43.198.199.58:8888/api/";
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'X-API-Key': 'secret_api_key',
  }
})


export const UserRegister = ({ username = '', password = '' }) => {

  return apiPost('/api/')
}

export const UserLogin = async ({ username = '', password = '' }) => {

  const res = await api.post('/token/', { username, password });

  console.log(res);

  return res;

  return apiPost('/token/', {
    data: { username, password }
  })
}
