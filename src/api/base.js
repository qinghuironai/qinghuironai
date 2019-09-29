import axios from 'axios'
import cookie from 'js-cookie'

// 创建axios实例
const instance = axios.create({
  baseURL: 'https://api.pixivic.com',
  // baseURL: "https://search.api.pixivic.com",
  // baseURL: 'http://114.67.107.177:8080',
  timeout: 20000,
  validateStatus (status) {
    return status >= 200 && status < 600
  }
})

instance.interceptors.request.use(
  config => {
    if (cookie.get('jwt')) {
      config.headers.Authorization = cookie.get('jwt')
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    if (response.status === 401) {
      cookie.remove('jwt')
    }
    return response
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default instance
