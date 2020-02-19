import Vue from 'vue';
import animated from 'animate.css';
import App from './App.vue';
import router from './router';
import store from './store/';
import api from './api';
import util from './util';
import './assets/style/index.styl';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import VuePageStack from 'vue-page-stack';
import VueGtag from 'vue-gtag';

Vue.use(Vuetify);
Vue.use(VuePageStack, { router, keyName: 'VNK' });

// import VConsole from 'vconsole';
// new VConsole();
Vue.config.productionTip = false;
Vue.use(animated);
Vue.use(VueGtag, {
  config: { id: 'UA-158701012-1' }
});
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
