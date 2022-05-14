import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// axios 인스턴스 생성
const request = axios.create({
  // API 요청에 대한 기본 접두사
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 요청 시간 초과
})

// 예외 가로채기 처리기
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // localstorage에서 토큰 받기
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN)
  // 토큰이 존재하는 경우
  // 각 요청이 사용자 정의 토큰을 전달하도록 하고 실제 상황에 따라 수정하십시오.
  if (token) {
    config.headers[ACCESS_TOKEN] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
