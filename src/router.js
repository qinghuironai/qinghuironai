import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const pages = {
  Home: () => import('./views/Home'),
  DailyRank: () => import('./views/DailyRank'),
  PopSearch: () => import('./views/PopSearch'),
  Intro: () => import('./views/Intro'),
  Links: () => import('./views/Links'),
  Donate: () => import('./views/Donate'),
  Comments: () => import('./views/Comments'),
  NotFound: () => import('./views/NotFound')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: pages.Home
    }, {
      path: '/dailyRank',
      name: 'DailyRank',
      component: pages.DailyRank
    }, {
      path: '/popSearch',
      name: 'PopSearch',
      component: pages.PopSearch
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
      path: '/404',
      name: 'NotFound',
      component: pages.NotFound
    }
  ]
})
