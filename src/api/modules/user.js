import axios from '../base'

function verificationCode () {
  return axios({
    url: `/verificationCode`,
    method: 'get'
  })
}

function register (data) {
  return axios({
    url: `/user`,
    method: 'post',
    data
  })
}

function login (params) {
  return axios({
    url: `/users/token`,
    method: 'get',
    params
  })
}

export { verificationCode, register, login }
