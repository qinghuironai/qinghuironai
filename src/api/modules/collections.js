import axios from '../base';

// 新建画集
function addCollections(data) {
  return axios({
    url: `/collections`,
    method: 'post',
    data: {
      isPublic: 1,
      forbidComment: 0,
      pornWarning: 0,
      ...data
    }
  });
}

// 查看用户画集
function getCollections(params) {
  return axios({
    url: `/users/${params.userId}/collections`,
    method: 'get',
    params: {
      pageSize: 30,
      isPublic: 1,
      ...params
    }
  });
}

// 用户获取自己的画集摘要列表（用于快速添加）
function collectionsDigest(userId) {
  return axios({
    url: `/users/${userId}/collectionsDigest`,
    method: 'get'
  });
}

// 添加画作到画集中
function illustrations(data) {
  return axios({
    url: `/collections/${data.collectionId}/illustrations`,
    method: 'post',
    headers: { 'content-type': 'application/json' },
    data: data.data
  });
}

// 查看画集下画作列表
function getIllustrations(data) {
  return axios({
    url: `/collections/${data.collectoinId}/illustrations`,
    method: 'get',
    params: {
      page: data.page,
      pageSize: 30
    }
  });
}

export {
  addCollections,
  getCollections,
  collectionsDigest,
  illustrations,
  getIllustrations
};
