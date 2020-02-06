<template>
  <v-app id="app">
    <!-- <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive> -->
    <navigation>
      <router-view />
    </navigation>
    <div :class="['tabs', {'show': showTab}]">
      <router-link
        v-for="item in tabs"
        :key="item.value"
        :to="item.value"
        class="tabs-item"
        @click.native="clickTab"
      >
        <img
          :src="active === item.value ? item.activeSrc : item.src"
          :style="{transform: active === item.value ? 'scale(1.1)' : ''}"
          alt=""
        >
      </router-link>
    </div>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      active: '/dailyRank',
      tabs: [{
        value: '/dailyRank',
        src: require('../src/assets/images/pixivic.svg'),
        activeSrc: require('../src/assets/images/pixivic-active.svg')
      }, {
        value: '/find',
        src: require('../src/assets/images/find.svg'),
        activeSrc: require('../src/assets/images/find-active.svg')
      }, {
        value: '/new',
        src: require('../src/assets/images/new.svg'),
        activeSrc: require('../src/assets/images/new-active.svg')
      }, {
        value: '/me',
        src: require('../src/assets/images/me.svg'),
        activeSrc: require('../src/assets/images/me-active.svg')
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
      return this.$route.path;
    }
  },
  watch: {
    $route(val) {
      this.active = val.path;
      this.$store.dispatch('addCachedView', val);
    }
  },
  methods: {
    clickTab() {
      // console.log(this.$vnode.componentInstance);
      // this.$navigation.on('reset', () => {});
    }
  }
};
</script>

<style lang="stylus" scope>
@import '~@/style/color.styl'
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
.show
  transform translateY(0)
  opacity 1
</style>
