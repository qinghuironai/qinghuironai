import axios from '../base'

function getRank (params) {
  return axios({
    url: `/ranks`,
    method: 'get',
    params
  })
}

export {
  getRank
}
