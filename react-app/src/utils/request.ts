import axios, { AxiosResponse } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import type { RequestConfig, Interceptors, R, Method } from './request.d';

/**
 * Enumeration of request methods.
 */
export enum REQ_METHODS { GET = 'GET', POST = 'POST', DELETE = 'DELETE', UPDATE = 'UPDATE', PUT = 'PUT' }

export default function createRequest<T, K = {}>(
  baseURL: string, config?: RequestConfig<T>,
  sendPre?: Interceptors<RequestConfig<T>, void>,
  respAft?: Interceptors<AxiosResponse<R<K>>, R<K> | AxiosResponse<R<K>>>
): <V = any>(payload?: RequestConfig<T>) => Promise<R<K, V>> {
  const instance: AxiosInstance = axios.create({
    baseURL, method: REQ_METHODS.GET, headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": "*"
    },
    timeout: 3000, withCredentials: false, ...config
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig & RequestConfig<T>) => {
      if (sendPre && sendPre.onFulfilled) sendPre.onFulfilled(config);

      if (config.hConfig) delete config.hConfig;
      return config;
    },
    (error: InternalAxiosRequestConfig & RequestConfig<T>) => {
      if (sendPre && sendPre.onRejected) sendPre.onRejected(error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse<R<K>>): any => {
      if (respAft && respAft.onFulfilled) return respAft.onFulfilled(response);
      return response;
    },
    (error: AxiosResponse<R<K>>): any => {
      if (respAft && respAft.onRejected) return respAft.onRejected(error);
      return Promise.reject(error);
    }
  );
  return (payload?: RequestConfig<T>) => instance(payload as AxiosRequestConfig<T>);
}

/**
 * Use this method to create an Api request.
 */
export const createApiRequest = <T, K = {}>(
  baseURL: string,
  config?: RequestConfig<T>,
  sendPre?: Interceptors<RequestConfig<T>, void>,
  respAft?: Interceptors<AxiosResponse<R<K>>, R<K> | AxiosResponse<R<K>>>
) => {
  const request = createRequest<T, K>(baseURL, config, sendPre, respAft);

  /**
   * Use this function to create different Api request methods.
   */
  const createApi = (method: Method) => {
    return <V = any>(url: string, apiConfig?: RequestConfig<T>) => request<V>({
      url,
      ...apiConfig,
      method
    });
  }

  return {
    request, createApi,
    apiGet: createApi(REQ_METHODS.GET),
    apiPost: createApi(REQ_METHODS.POST)
  }
}


/**
 * createApiRequest: This function has two generics,
 * the first type will apply its type to config.hconfig,
 * and the second type will be the returned data type,
 * which will define the type of the data attribute on the return body.
 *
 * If you need other request methods, you can:
 *  const apiPut = createApi(REQ_METHODS.PUT);
 *  const apiDelete = createApi(REQ_METHODS.DELETE);
 *
 * If you set the return type, you can:
 *  const res = apiGet<string>('/url');
 *
 * At this point, res is the object type, and data is the string type, `res.data` is string type.
 */
export const { apiGet, apiPost, createApi, request } = createApiRequest<{
  needAuth?: boolean;
}, {
  data: string;
  f: string;
}>('/kyapi', {
  headers: {
    'X-API-Key': 'secret_api_key',
    "Content-Type": 'application/json'
  }
}, {
  onFulfilled(config) {
    if (config.hConfig?.needAuth) {
      if (!config.headers) config.headers = {};
      // if (getToken()) config.headers['authorization'] = 'Bearer ' + getToken(true);
    }
  },
  onRejected: config => Promise.reject(config)
}, {
  onFulfilled: response => {
    // You can parse the return of data here.
    // If the backend further encapsulates the data, the return of the data can be changed here,
    // and the corresponding return can be carried out according to the second generic to perform a layer of parsing on the data.
    return Promise.resolve(response.data);
  },
  onRejected: err => {
    return Promise.reject(err);
  }
});


export const getLoginResponse = (username: string, password: string) => {
  if (username === "" || password === "") {
    return false;
  }
  return true;
}
