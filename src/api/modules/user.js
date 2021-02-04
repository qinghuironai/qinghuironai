import axios from '../base';

// 获取图形验证码
function verificationCode() {
  return axios({
    url: `/verificationCode`,
    method: 'get'
  });
}

function register(data) {
  return axios({
    url: `/users?vid=${data.vid}&value=${data.value}`,
    method: 'post',
    data: data.userInfo
  });
}

function login(data) {
  return axios({
    url: `/users/token?vid=${data.vid}&value=${data.value}`,
    method: 'post',
    data: data.userInfo
  });
}

// 发送密码重置邮件
function resetPasswordEmail(email) {
  return axios({
    url: `/users/emails/${email}/resetPasswordEmail`,
    method: 'get'
  });
}

// 用户重置密码
function resetPassword(data) {
  return axios({
    url: `/users/password?vid=${data.vid}&value=${data.value}`,
    method: 'put',
    data: { password: data.password }
  });
}

// 效验邮箱可用性
function checkEmail(email) {
  return axios({
    url: `/users/emails/${email}`,
    method: 'get'
  });
}

// 校验用户名可用性
function checkUser(user) {
  return axios({
    url: `/users/usernames/${user}`,
    method: 'get'
  });
}

// 收藏画作
function collectIllust(data) {
  return axios({
    url: `/users/bookmarked`,
    method: 'post',
    data
  });
}

// 收藏画作列表
function getCollectList(params) {
  return axios({
    url: `/users/${params.userId}/bookmarked/${params.type}`,
    method: 'get',
    params: { page: params.page, pageSize: params.pageSize || 30 }
  });
}

// 取消收藏
function deleteCollect(data) {
  return axios({
    url: `/users/bookmarked`,
    method: 'delete',
    data
  });
}

// 关注和取消关注画师
function followArtist(data) {
  return axios({
    url: `/users/followed`,
    method: data.follow ? 'post' : 'delete',
    data: {
      artistId: data.artistId,
      userId: data.userId,
      username: data.username
    }
  });
}

// 用户关注画师列表
function getFollowArtist(data) {
  return axios({
    url: `/users/${data.userId}/followed`,
    method: 'get',
    params: { page: data.page, pageSize: data.pageSize || 30 }
  });
}

// 关注画师新作
function getNewIllust(data) {
  return axios({
    url: `/users/${data.userId}/followed/latest/${data.type}`,
    method: 'get',
    params: {
      page: data.page,
      pageSize: data.pageSize || 30
    }
  });
}

// 获取用户是否验证邮箱
function getEmailIsCheck(userId) {
  return axios({
    url: `/users/${userId}/email/isCheck`,
    method: 'get'
  });
}

// 用户发送邮箱验证邮件
function vertifyEmail(email) {
  return axios({
    url: `/users/emails/${email}/checkEmail`,
    method: 'get'
  });
}

// 用户设置邮箱(会返回新的token)
function setEmail(params) {
  return axios({
    url: `/users/${params.userId}/email`,
    method: 'put',
    params
  });
}

// qq登录
function qqLogin(params) {
  return axios({
    url: `/users/tokenWithQQ`,
    method: 'get',
    params
  });
}

// 用户绑定qq
function qqAccess(params) {
  return axios({
    url: `/users/${params.userId}/qqAccessToken`,
    method: 'put',
    params: { qqAccessToken: params.qqAccessToken }
  });
}

// 检查是否绑定qq
function checkQQ(userId) {
  return axios({
    url: `/users/${userId}/isBindQQ`,
    method: 'get'
  });
}

// 查看用户信息
function getUsers(userId) {
  return axios({
    url: `/users/${userId}`,
    method: 'get'
  });
}

// 查看画师关注用户列表
function getFollowers(params) {
  return axios({
    url: `/artists/${params.artistId}/followedUsers`,
    method: 'get',
    params: {
      page: params.page || 1,
      pageSize: params.pageSize || 30
    }
  });
}

// 获取带有3幅近期画作的follow画师列表
function getArtists(data) {
  return axios({
    url: `/users/${data.userId}/followedWithRecentlyIllusts`,
    method: 'get',
    params: {
      page: data.page,
      pageSize: data.pageSize || 30
    }
  });
}

// 用户查看近期画作历史记录
function getRecentHistory(data) {
  return axios({
    url: `/users/${data.userId}/illustHistory`,
    method: 'get',
    params: {
      page: data.page,
      pageSize: data.pageSize || 30
    }
  });
}

// 用户查看早期画作历史记录
function getOldHistory(data) {
  return axios({
    url: `/users/${data.userId}/oldIllustHistory`,
    method: 'get',
    params: {
      page: data.page,
      pageSize: data.pageSize || 30
    }
  });
}

// 兑换会员码
function exchangeVip(data) {
  return axios({
    url: `/users/${data.userId}/permissionLevel`,
    method: 'put',
    params: {
      exchangeCode: data.exchangeCode
    }
  });
}

// 获取高速服务器 vipProxyServer
function getvipProxyServer() {
  return axios({
    url: `/vipProxyServer`,
    method: 'get'
  });
}

// 获取活动可参与状态
function canParticipateStatus(activityName) {
  return axios({
    url: `/vipActivity/${activityName}/canParticipateStatus`,
    method: 'get'
  });
}

// 参与活动
function participateStatus(activityName) {
  return axios({
    url: `/vipActivity/${activityName}/participateStatus`,
    method: 'put'
  });
}

// 用户oauth
function oauth(query) {
  return axios({
    url: `/oauth/authorize${query}`,
    method: 'get'
  });
}

// 获取总未读消息数量
function getUnreadRemindsCount(userId) {
  return axios({
    url: `/users/${userId}/unreadRemindsCount`,
    method: 'get'
  });
}

// 获取各消息分类未读数
function getRemindSummary(userId) {
  return axios({
    url: `/users/${userId}/remindSummary`,
    method: 'get'
  });
}

// 获取某个分类下的消息列表
function getReminds(data) {
  return axios({
    url: `/users/${data.userId}/reminds`,
    method: 'get',
    params: {
      type: data.type,
      offset: data.offset
    }
  });
}

// 获取手机验证码
function getPhoneCode(params) {
  return axios({
    url: `/messageVerificationCode`,
    method: 'get',
    params
  });
}

// 绑定手机
function verifyPhoneCode(data) {
  return axios({
    url: `/users/${data.userId}/phone`,
    method: 'put',
    params: {
      vid: data.vid,
      value: data.value
    }
  });
}

// 校验手机号可用性
function checkPhone(phone) {
  return axios({
    url: `/users/phones/${phone}`,
    method: 'get'
  });
}

export {
  verificationCode,
  register,
  login,
  resetPasswordEmail,
  checkEmail,
  checkUser,
  resetPassword,
  collectIllust,
  getCollectList,
  deleteCollect,
  followArtist,
  getFollowArtist,
  getNewIllust,
  getEmailIsCheck,
  vertifyEmail,
  setEmail,
  qqLogin,
  qqAccess,
  checkQQ,
  getUsers,
  getFollowers,
  getArtists,
  getRecentHistory,
  getOldHistory,
  exchangeVip,
  getvipProxyServer,
  canParticipateStatus,
  participateStatus,
  oauth,
  getUnreadRemindsCount,
  getRemindSummary,
  getReminds,
  getPhoneCode,
  verifyPhoneCode,
  checkPhone
};
