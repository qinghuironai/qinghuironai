import Vue from 'vue';
import Router from 'vue-router';
import cookie from 'js-cookie';

Vue.use(Router);

const pages = {
  DailyRank: () => import('./views/rank/DailyRank'),
  Detail: () => import('./views/detail/Detail'),
  Artist: () => import('./views/artist/Artist'),
  Search: () => import('./views/search/Search'),
  Find: () => import('./views/find/Find'),
  SpotLight: () => import('./views/find/SoptLight'),
  Spot: () => import('./views/find/Spot.vue'),
  Me: () => import('./views/me/Me'),
  Collect: () => import('./views/me/Collect'),
  ArtistCollect: () => import('./views/me/ArtistCollect'),
  Links: () => import('./views/find/Links'),
  New: () => import('./views/new/New.vue'),
  Setting: () => import('./views/me/Setting'),
  Avatar: () => import('./views/me/Avatar'),
  Login: () => import('./views/login/Login'),
  QQauth: () => import('./views/login/qqauth'),
  Register: () => import('./views/register/Register'),
  ResetPassword: () => import('./views/reset/ResetPassword'),
  EmailCheck: () => import('./views/reset/EmailCheck'),
  Friends: () => import('./views/find/Friends')
  // NotFound: () => import('./views/not-found/NotFound')
};

// const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_PREFIX,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0
      };
    }
  },
  routes: [{
    path: '/',
    redirect: '/dailyRank'
  },
  {
    path: '/detail/:pid',
    name: 'Detail',
    component: pages.Detail,
    props: true
  },
  {
    path: '/artist/:artistId',
    name: 'Artist',
    component: pages.Artist,
    props: true
  },
  {
    path: '/dailyRank',
    name: 'DailyRank',
    component: pages.DailyRank
  },
  {
    path: '/search',
    name: 'Search',
    component: pages.Search
  },
  {
    path: '/find',
    name: 'Find',
    component: pages.Find
  },
  {
    path: '/spotlight',
    name: 'SpotLight',
    component: pages.SpotLight
  },
  {
    path: '/spot/:id',
    name: 'Spot',
    component: pages.Spot,
    props: true
  },
  {
    path: '/me',
    name: 'Me',
    component: pages.Me
  },
  {
    path: '/collect',
    name: 'Collect',
    component: pages.Collect
  },
  {
    path: '/artistCollect',
    name: 'ArtistCollect',
    component: pages.ArtistCollect
  },
  {
    path: '/links',
    name: 'Links',
    component: pages.Links
  },
  {
    path: '/new',
    name: 'New',
    component: pages.New
  },
  {
    path: '/setting',
    name: 'Setting',
    component: pages.Setting
  },
  {
    path: '/avatar',
    name: 'Avatar',
    component: pages.Avatar
  },
  {
    path: '/login',
    name: 'Login',
    component: pages.Login
  },
  {
    path: '/qqauth',
    name: 'QQauth',
    component: pages.QQauth
  },
  {
    path: '/register',
    name: 'Register',
    component: pages.Register
  },
  {
    path: '/resetPassword',
    name: 'ResetPassword',
    component: pages.ResetPassword
  },
  {
    path: '/emailCheck',
    name: 'EmailCheck',
    component: pages.EmailCheck
  },
  {
    path: '/friends',
    name: 'Friends',
    component: pages.Friends
  },
  {
    path: '*',
    redirect: '/dailyRank'
  }
  ]
});

router.beforeEach((to, from, next) => {
  const isLogin = !!cookie.get('jwt');
  const needLogin = to.path === '/me' || to.path === '/new';
  if (!needLogin) {
    // 不需要登录的页面直接放行
    next();
  } else {
    // 需要登录的页面需要jwt
    isLogin ? next() : next('/login');
  }
});

export default router;
