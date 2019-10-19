import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const pages = {
  Home: () => import('./views/Home'),
  DailyRank: () => import('./views/DailyRank'),
  Detail: () => import('./views/Detail.vue'),
  PopSearch: () => import('./views/PopSearch'),
  Intro: () => import('./views/Intro'),
  Links: () => import('./views/Links'),
  Donate: () => import('./views/Donate'),
  Comments: () => import('./views/Comments'),
  ResetPassword: () => import('./views/ResetPassword.vue'),
  NotFound: () => import('./views/NotFound')
}

export default new Router({
  mode: 'history',
  base: 'pix',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: pages.Home
    }, {
      path: '/detail/:pid',
      name: 'Detail',
      component: pages.Detail,
      props: true
    }, {
      path: '/dailyRank',
      name: 'DailyRank',
      component: pages.DailyRank
    }, {
      path: '/popSearch',
      name: 'PopSearch',
      component: pages.PopSearch,
      props: (route) => ({ ...route.query })
    }, {
      path: '/intro',
      name: 'Intro',
      component: pages.Intro
    }, {
      path: '/links',
      name: 'Links',
      component: pages.Links
    }, {
      path: '/donate',
      name: 'Donate',
      component: pages.Donate
    }, {
      path: '/comments',
      name: 'Comments',
      component: pages.Comments
    }, {
      path: '/resetPassword',
      name: 'ResetPassword',
      component: pages.ResetPassword
    },
    {
      path: '/404',
      name: 'NotFound',
      component: pages.NotFound
    }
  ]
})
