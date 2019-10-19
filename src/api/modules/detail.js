import axios from '../base'

function getPixById (id) {
  return axios({
    url: `/illusts/${id}`,
    method: 'get'
  })
}

export { getPixById }
