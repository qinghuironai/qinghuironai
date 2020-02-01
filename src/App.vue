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
        <i :class="[item.icon, {'active': active === item.value}]" />
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
        icon: 'iconfont icon-paihang'
      }, {
        value: '/find',
        icon: 'iconfont icon-faxian1-copy'
      }, {
        value: '',
        icon: 'iconfont icon-new13'
      }, {
        value: '/me',
        icon: 'iconfont icon-user-copy'
      }]
    };
  },
  computed: {
    ...mapGetters([
      'cachedViews',
      'showTab'
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
    color #ccc !important
    i
      font-size 25px
      &.active
        color $primary
        font-size 30px
        transition all .3s
.show
  transform translateY(0)
  opacity 1
</style>
