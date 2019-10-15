import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_USER: 'SET_USER'
}

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || {}
  },
  getters: {
    user: state => state.user
  },
  mutations: {
    [types.SET_USER] (state, user) {
      if (user) {
        state.user = user
      } else {
        state.user = {}
      }
    }
  },
  actions: {
    setUser: ({ commit }, user) => {
      commit(types.SET_USER, user)
    },
    clearCurrentState: ({ commit }) => {
      localStorage.removeItem('user')
      commit(types.SET_USER, null)
    }
  }
})
