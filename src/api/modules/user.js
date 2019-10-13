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

// 发送密码重置邮件
function resetPasswordEmail (email) {
  return axios({
    url: `/users/emails/${email}/resetPasswordEmail`,
    method: 'get'
  })
}

// 效验邮箱可用性
function checkEmail (email) {
  return axios({
    url: `/users/emails/${email}`,
    method: 'get'
  })
}

export { verificationCode, register, login, resetPasswordEmail, checkEmail }
