const state = {
  user: JSON.parse(localStorage.getItem('user')) || {},
  cachedViews: [],
  showTab: true,
  likeStatus: null, // 点赞画作状态
  followStatus: null // 画师关注状态
};

export default state;
