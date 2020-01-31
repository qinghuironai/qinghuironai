import * as types from './mutation-types';
import { collectIllust, deleteCollect } from '@/api/modules/user';

export const setUser = ({
  commit
}, user) => {
  commit(types.SET_USER, user);
};

export const clearCurrentState = ({
  commit
}) => {
  localStorage.removeItem('user');
  commit(types.SET_USER, null);
};

export const addCachedView = ({
  commit
}, view) => {
  commit(types.ADD_CACHED_VIEWS, view);
};

export const delCachedView = ({
  commit
}, name) => {
  commit(types.DEL_CACHED_VIEW, name);
};

export const changeTab = ({
  commit
}, flag) => {
  commit(types.SHOW_TAB, flag);
};

// 收藏画作
export const handleCollectIllust = ({
  commit
}, data) => {
  return new Promise((resolve, reject) => {
    collectIllust(data)
      .then(res => {
        if (res.status === 200) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 取消收藏
export const deleteCollectIllust = ({
  commit
}, data) => {
  return new Promise((resolve, reject) => {
    deleteCollect(data)
      .then(res => {
        if (res.status === 200) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};
