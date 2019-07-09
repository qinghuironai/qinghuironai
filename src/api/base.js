import axios from 'axios'
import cookie from 'js-cookie'

// 创建axios实例
const instance = axios.create({
  baseURL: 'https://api.pixivic.com',
  timeout: 10000,
  validateStatus: function (status) {
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
