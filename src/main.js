import Vue from 'vue';
import animated from 'animate.css';
import App from './App.vue';
import router from './router';
import store from './store/';
import api from './api';
import util from './util';
import Mixin from './mixins';
import './style/index.styl';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import Navigation from 'vue-navigation';

Vue.use(Vuetify);
Vue.use(Navigation, { router, store });

// import VConsole from 'vconsole'

// eslint-disable-next-line no-new
// new VConsole()
Vue.config.productionTip = false;
Vue.use(animated);
Vue.mixin(Mixin);
Vue.prototype.$api = api;
Vue.prototype.$util = util;

const app = new Vue({
  router,
  store,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi'
    }
  }),
  render: h => h(App)
});

app.$mount('#app');
