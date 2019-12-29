import Vue from 'vue'
import './cube-ui'
import VueLazyload from 'vue-lazyload'
import animated from 'animate.css'
import App from './App.vue'
import router from './router'
import store from './store/'
import api from './api'
import util from './util'
import Mixin from './mixins'
import './style/index.styl'
import 'amfe-flexible'

// import VConsole from 'vconsole'

// eslint-disable-next-line no-new
// new VConsole()
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  // loading: require('@/assets/images/loading2.svg'),
  loading: require('@/assets/images/loading.gif'),
  error: require('@/assets/images/loading.svg')
})
Vue.use(animated)
Vue.mixin(Mixin)
Vue.prototype.$api = api
Vue.prototype.$util = util

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

app.$mount('#app')
