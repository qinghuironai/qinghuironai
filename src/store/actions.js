import * as types from './mutation-types'

export const setUser = ({
  commit
}, user) => {
  commit(types.SET_USER, user)
}

export const clearCurrentState = ({
  commit
}) => {
  localStorage.removeItem('user')
  commit(types.SET_USER, null)
}

export const addCachedView = ({
  commit
}, view) => {
  commit(types.ADD_CACHED_VIEWS, view)
}

export const delCachedView = ({
  commit
}, name) => {
  commit(types.DEL_CACHED_VIEW, name)
}

export const changeTab = ({
  commit
}, flag) => {
  commit(types.SHOW_TAB, flag)
}
