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
  Spot: () => import('./views/find/Spot.vue'),
  Me: () => import('./views/me/Me'),
  Collect: () => import('./views/me/components/Collect'),
  ArtistCollect: () => import('./views/me/components/ArtistCollect.vue'),
  New: () => import('./views/new/New.vue'),
  Login: () => import('./views/login/Login'),
  Register: () => import('./views/register/Register'),
  NotFound: () => import('./views/not-found/NotFound')
};

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

console.log(process.env);
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
    path: '/new',
    name: 'New',
    component: pages.New
  },
  {
    path: '/login',
    name: 'Login',
    component: pages.Login,
    meta: {
      noCache: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: pages.Register,
    meta: {
      noCache: true
    }
  },
  {
    path: '*',
    name: 'NotFound',
    component: pages.NotFound,
    meta: {
      noCache: false
    }
  }
  ]
});

router.beforeEach((to, from, next) => {
  const isLogin = !!cookie.get('jwt');
  console.log('isLogin', isLogin);
  const needLogin = to.path === '/me';
  if (!needLogin) {
    // 不需要登录的页面直接放行
    next();
  } else {
    // 需要登录的页面需要jwt
    isLogin ? next() : next('/login');
  }
});

export default router;
