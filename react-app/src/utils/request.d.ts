import type { AxiosInstance, AxiosRequestConfig, AxiosInterceptorManager, InternalAxiosRequestConfig, Axios } from 'axios';

export type Method = 'get' | 'GET'
| 'delete' | 'DELETE'
| 'head' | 'HEAD'
| 'options' | 'OPTIONS'
| 'post' | 'POST'
| 'put' | 'PUT'
| 'patch' | 'PATCH'
| 'purge' | 'PURGE'
| 'link' | 'LINK'
| 'unlink' | 'UNLINK';

export type RequestConfig<T, D = {}> = AxiosRequestConfig<D> & {
  hConfig?: T;
}

export interface Interceptors<K, V> {
  onFulfilled?: (config: K) => V | Promise<V>;
  onRejected?: (config: K) => V | Promise<V>;
}

export type R<K, V = any> =
  K extends { data: infer S }
    ? V
    : K;
