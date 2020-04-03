<template>
  <v-app id="app">
    <vue-page-stack>
      <router-view :key="key" />
    </vue-page-stack>
    <div :class="['tabs', {'show': showTab}]">
      <div
        v-for="item in tabs"
        :key="item.value"
        class="tabs-item"
        @click.stop="clickTab(item.value)"
      >
        <img
          :src="active === item.value ? item.activeSrc : item.src"
          :style="{transform: active === item.value ? 'scale(1.1)' : ''}"
          alt=""
        >
      </div>
      <div class="tabs-item " @click="$router.push('/me')">
        <img
          :src="user.id ? `https://pic.cheerfun.dev/${user.id}.png?t=${new Date().getTime()}` : require('../src/assets/images/me.svg')"
          :style="{transform: $route.name === 'Me' ? 'scale(1.1)' : ''}"
        >
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { prefixStyle } from '@/util/dom';

export default {
  data() {
    return {
      active: '/dailyRank',
      tabs: [{
        value: '/dailyRank',
        src: 'https://pic.cheerfun.dev/pixivic.svg',
        activeSrc: 'https://pic.cheerfun.dev/pixivic-active.svg'
      }, {
        value: '/find',
        src: require('../src/assets/images/find.svg'),
        activeSrc: require('../src/assets/images/find-active.svg')
      }, {
        value: '/new',
        src: require('../src/assets/images/new.svg'),
        activeSrc: require('../src/assets/images/new-active.svg')
      }]
    };
  },
  computed: {
    ...mapGetters([
      'cachedViews',
      'showTab',
      'user'
    ]),
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {
    $route: {
      handler(val) {
        this.active = val.path;
      },
      immediate: true
    }
  },
  async mounted() {
    const flag = localStorage.getItem('pixivic-msg');
    const alert = localStorage.getItem('pixivic_alert');
    if (flag) localStorage.removeItem('pixivic-msg');
    if (alert) localStorage.removeItem('pixivic-alert');
    const filter = prefixStyle('filter');
    const date = dayjs(new Date()).format('MM-DD');
    if (date === '04-04') {
      document.getElementsByTagName('html')[0].style[filter] = 'grayscale(0.98)';
    }
  },
  methods: {
    clickTab(val) {
      this.$router.push(val);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/color.styl'
.tabs
  width 70%
  max-width 300px
  height 55px
  background #ffffff
  border-radius 25px
  position fixed
  bottom 15px
  left 0
  right 0
  margin auto
  z-index 100
  display flex
  align-items center
  transform translateY(80px)
  opacity 0
  transition all .3s ease
  &-item
    flex 1
    text-align center
    img
      width 25px
      height 25px
      vertical-align middle
      transition all .3s
      border-radius 50%
      object-fit cover
.show
  transform translateY(0)
  opacity 1
</style>
