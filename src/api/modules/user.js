import axios from '../base'

// 获取图形验证码
function verificationCode () {
  return axios({
    url: `/verificationCode`,
    method: 'get'
  })
}

function register (data, params) {
  return axios({
    url: `/users?vid=${params.vid}&value=${params.value}`,
    method: 'post',
    data
  })
}

function login (data, params) {
  return axios({
    url: `/users/token?vid=${params.vid}&value=${params.value}`,
    method: 'post',
    data
  })
}

export { verificationCode, register, login }
