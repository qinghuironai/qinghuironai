import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style/index.styl'
import VueTouch from 'vue-touch'
import VueLazyload from 'vue-lazyload'
import vueiInfinite from 'vue-infinite-scroll'

Vue.config.productionTip = false

Vue.use(VueTouch, { name: 'v-touch' })
VueTouch.config.swipe = {
  threshold: 100
}

Vue.use(VueLazyload, {
  loading: require('@/assets/images/loading.gif')
})

Vue.use(vueiInfinite)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
