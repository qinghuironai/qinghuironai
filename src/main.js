import Vue from 'vue'
import AMsg from 'amsg'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import './style/index.styl'

Vue.config.productionTip = false
Vue.use(AMsg, { color: ['#b9eee5'] })
Vue.prototype.$api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
