export const user = state => state.user;
export const showTab = state => state.showTab;
export const likeStatus = state => state.likeStatus;
export const followStatus = state => state.followStatus;
export const detail = state => state.detail;
export const showSearchBox = state => state.showSearchBox;
export const option = state => state.option;
export const avatar = state => state.user.avatar;
export const collectStatus = state => state.collectStatus;
export const collectDigest = state => state.collectDigest;
export const isVip = state => state.user.permissionLevel > 2 && new Date(state.user.permissionLevelExpireDate).getTime() > Date.now();
export const serverAddress = state => state.serverAddress;
