import Vue from 'vue';
import Router from 'vue-router';
import cookie from 'js-cookie';

Vue.use(Router);

const pages = {
  DailyRank: require('./views/rank/DailyRank').default,
  Detail: require('./views/detail/Detail').default,
  Artist: require('./views/artist/Artist').default,
  Search: require('./views/search/Search').default,
  Find: require('./views/find/Find').default,
  SpotLight: require('./views/find/SoptLight').default,
  Spot: require('./views/find/Spot.vue').default,
  Me: require('./views/me/Me').default,
  Collect: require('./views/me/Collect').default,
  ArtistCollect: require('./views/me/ArtistCollect').default,
  Links: require('./views/find/Links').default,
  New: require('./views/new/New.vue').default,
  Setting: require('./views/me/Setting').default,
  Avatar: require('./views/me/Avatar').default,
  Login: require('./views/login/Login').default,
  QQauth: require('./views/login/qqauth').default,
  Register: require('./views/register/Register').default,
  ResetPassword: require('./views/reset/ResetPassword').default,
  EmailCheck: require('./views/reset/EmailCheck').default,
  Friends: require('./views/find/Friends').default,
  Users: require('./views/users/Users').default,
  BookMark: require('./views/bookmark/BookMark').default
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
    path: '/users/:userId',
    name: 'Users',
    component: pages.Users,
    props: true
  },
  {
    path: '/bookmark/:illustId',
    name: 'BookMark',
    component: pages.BookMark,
    props: true
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
