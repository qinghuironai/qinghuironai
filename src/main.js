import Vue from 'vue'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
import vueiInfinite from 'vue-infinite-scroll'
import AMsg from 'amsg'
import animated from 'animate.css'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './api'
import util from './util'
import './style/index.styl'
import './assets/icon/iconfont.css'

// import VConsole from 'vconsole'

// new VConsole()
Vue.config.productionTip = false
Vue.use(AMsg, { color: ['#b9eee5'] })
Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  threshold: 100
}
Vue.use(VueLazyload, {
  loading: require('@/assets/images/loading.svg'),
  error: require('@/assets/images/loading.svg')
})
Vue.use(vueiInfinite)
Vue.use(animated)
Vue.prototype.$api = api
Vue.prototype.$util = util

const app = new Vue({
  router,
  store,
  render: h => h(App)
})

app.$mount('#app')
