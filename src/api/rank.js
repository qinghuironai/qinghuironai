import fetch from '@/util/fetch'

function getRank (params) {
  return fetch({
    url: `/ranks`,
    method: 'get',
    params
  })
}

export {
  getRank
}
