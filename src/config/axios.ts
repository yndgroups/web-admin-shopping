import { type AxiosInstance, type AxiosRequestConfig, type AxiosPromise, type AxiosResponse, AxiosHeaders } from 'axios'
import axios from 'axios'
import { toast } from '@/utils'
import apis from '@/apis'
import type { AnyObj } from '@/core'

export interface AxiosError<T = any> extends Error {
  config: AxiosRequestConfig
  code?: string
  request?: any
  response?: AxiosResponse<T>
}

const toastRemove = () => {
  const toastContainer = document.querySelector('toast-container')
  if (toastContainer) {
    document.body.removeChild(toastContainer)
  }
}

const cfg = {
  baseURL: '/',
  timeout: 100000,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  loading: true,
}

const instance: AxiosInstance = axios.create(cfg)
let count = 0
// 权限变更处理
const pageReload = (isAuthUpdate: boolean) => {
  count++
  if (isAuthUpdate && count == 1) {
    instance.get(apis.menuTreeAll + '?reload=1').then((res: any) => {
      if (res.code === 1) {
        if (res.data['menuList'] && res.data['powerSign']) {
          sessionStorage.setItem('menuList', JSON.stringify(res.data['menuList']))
          sessionStorage.setItem('powerSign', res.data['powerSign'])
          // message.warning("权限已发生变更,3秒后会进行界面刷新,给你带来不便,敬请理解")
          setTimeout(() => {
            location.reload()
          }, 3000)
        }
      }
    })
    isAuthUpdate = false
  }
}

/**
 * 请求统一处理
 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // toast('数据加载中...')
    const headers = new AxiosHeaders()
    headers.set('accessToken', 'Bearer token')
    if (headers.get('accessToken')) {
      config.headers = headers
    }
    const token = sessionStorage.getItem('token')
    if (token) {
      headers.set('accessToken', 'Bearer ' + token)
    } else {
      const token = sessionStorage.getItem('anonymous')
      if (token) {
        headers.set('accessToken', 'Bearer ' + token)
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    toastRemove()
    console.log(response, 'response')
    // const { status: httpCode, data: res }: { status: number; data: any } = response
    // const { status, msg }: { status: number; msg: string } = res
    const { status, data } = response
    if (status === 200) {
      switch (data.code) {
        case 500:
          toast(data.msg)
          break
        case 401:
          location.href = '/login'
          break
      }
    }
    if (status === 40102) {
      pageReload(true)
    }
    return data || Promise.reject(new Error(data.msg || `Error ${status}`))
  },
  (error: AxiosError) => {
    toastRemove()
    const { response, message: axiosMsg } = error
    let errorMsg = 'error'
    if (response) {
      const { status: httpCode, data: res } = response

      errorMsg = `${httpCode} ${axiosMsg}`

      if (res) {
        console.log(res, 'res')
        const { status, message: msg = '请求失败', code = 0 } = res
        errorMsg = `${status || httpCode} ${msg}`
      }
    } else {
      errorMsg = `${error.code} - ${error.message}`
    }
    toast(errorMsg)
    if (response?.data.code === 401) {
      location.href = '/login'
    }
    return Promise.reject(errorMsg)
  },
)

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

interface HttpResponse extends AxiosResponse {
  code: number
  data: any
  msg: string
  errMsg?: string
}

// 深度克隆对象，通过公共方法处理空格之类的问题
function deepClone(obj: AnyObj) {
  if (obj === null || typeof obj !== 'object') {
    if (obj === 'null' || obj === '') {
      return null
    }
    if (typeof obj === 'string') {
      return `${obj}`.trim()
    }
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = deepClone(item)
      return arr
    }, [])
  }

  if (obj instanceof Object) {
    return Object.keys(obj).reduce((newObj: AnyObj, key: any) => {
      newObj[key] = deepClone(obj[key])
      return newObj
    }, {})
  }
}

// 核心请求方法，通过深度克隆出来数据的合法性
const request = (cfg: AxiosRequestConfig): Promise<HttpResponse> => {
  cfg.params = cfg.params ? deepClone(cfg.params) : cfg.params
  cfg.data = cfg.data ? deepClone(cfg.data) : cfg.data
  return instance({
    ...cfg,
  })
}

const getJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.GET,
    ...cfg,
  })
}

const postJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.POST,
    ...cfg,
  })
}
const putJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.PUT,
    ...cfg,
  })
}

const deleteJSON = (url: string, cfg?: AxiosRequestConfig): Promise<HttpResponse> => {
  return request({
    url: url,
    method: HttpMethod.DELETE,
    ...cfg,
  })
}
export { instance, getJSON, postJSON, putJSON, deleteJSON, request }
