import axios from '../base'

function getRank (params) {
  return axios({
    url: `/ranks`,
    method: 'get',
    params
  })
}

function getSearch (params) {
  return axios({
    url: `/illusts`,
    method: 'get',
    params
  })
}

function getTags (params) {
  return axios({
    url: `/relatedTags`,
    method: 'get',
    params
  })
}

export {
  getRank,
  getSearch,
  getTags
}
