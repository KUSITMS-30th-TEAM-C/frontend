import axios, {
  type AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  Method,
  AxiosRequestConfig,
} from 'axios'
import { HTTP_METHODS } from '@/constants'
import { useLogout } from '@/app/auth/auth'
import { useRouter } from 'next/navigation'
import { BaseResponse, ErrorResponse } from './types'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    
    return config
  },
  (error: AxiosError) => {
    throw error
  },
)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError): Promise<ErrorResponse> => {
    const { push } = useRouter()
    const { logout } = useLogout()

    if (!error.response) {
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
      throw {
        success: false,
        timestamp: new Date(),
        statusCode: 0,
        code: 'NETWORK_ERROR',
        message: 'Network Error',
      } as ErrorResponse
    }

    const { status: statusCode } = error.response
    const message =
      (error.response.data as { message?: string })?.message ||
      'An error occurred'
    const code =
      (error.response.data as { code?: string })?.code || 'UNKNOWN_ERROR'
    if (statusCode === 401) {
      alert('인증이 만료되었습니다. 다시 로그인해 주세요.')
      logout()
      push('/')
    } else if (statusCode === 500) {
      alert('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } else {
      alert(message || '오류가 발생했습니다.')
    }
    throw {
      success: false,
      timestamp: new Date(),
      statusCode,
      code,
      message,
    } as ErrorResponse
  },
)

const createApiMethod =
  (instance: AxiosInstance, method: Method) =>
  <T>(config: AxiosRequestConfig): Promise<BaseResponse<T>> =>
    instance({ ...config, method })

const http = {
  get: createApiMethod(axiosInstance, HTTP_METHODS.GET),
  post: createApiMethod(axiosInstance, HTTP_METHODS.POST),
  patch: createApiMethod(axiosInstance, HTTP_METHODS.PATCH),
  put: createApiMethod(axiosInstance, HTTP_METHODS.PUT),
  delete: createApiMethod(axiosInstance, HTTP_METHODS.DELETE),
}

export default http
