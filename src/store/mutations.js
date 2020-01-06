import * as types from './mutation-types'

const mutations = {
  [types.SET_USER] (state, user) {
    if (user) {
      state.user = user
    } else {
      state.user = {}
    }
  },
  [types.ADD_CACHED_VIEWS] (state, view) {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  [types.DEL_CACHED_VIEW] (state, name) {
    let index = state.cachedViews.indexOf(name)
    if (index > -1) {
      state.cachedViews.splice(index, 1)
    }
  },
  [types.SHOW_TAB] (state, flag) {
    state.showTab = flag
  }
}

export default mutations
