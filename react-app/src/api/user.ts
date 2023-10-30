import { apiGet, apiPost } from '../utils/request';
import { ls } from '@/utils/storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants';


export const UserRegister = ({ username = '', password = '' }) => {
  return apiPost('/api/')
}

export const UserLogin = async ({ username = '', password = '' }) => {
  const res = await apiPost<{
    access: string;
    refresh: string;
  }>('/token/', {
    data: { username, password }
  }).catch(() => false);

  if (typeof res === 'boolean') return Promise.reject();

  ls.setItem(ACCESS_TOKEN, res.access);
  ls.setItem(REFRESH_TOKEN, res.refresh);
  return Promise.resolve();
}
