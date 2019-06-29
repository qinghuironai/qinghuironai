import axios from 'axios'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'https://api.pixivic.com',
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 600
  }
})

// request拦截器
service.interceptors.request.use(
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

// response 拦截器
service.interceptors.response.use(
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

export default service
