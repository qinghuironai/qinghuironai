<template>
  <div id="app">
    <keep-alive :include="cachedViews"
                :max="10">
      <router-view :key="key" />
    </keep-alive>
    <cube-tab-bar v-model="selectedLabelSlots"
                  class="tabs"
                  :class="['tabs', {'hide': !showTab}]"
                  :inline="false"
                  @change="changeHandler">
      <cube-tab v-for="(item, index) in tabs"
                :label="item.label"
                :value="item.value"
                :key="index">
        <i slot="icon"
           :class="item.icon"></i>
      </cube-tab>
    </cube-tab-bar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      selectedLabelSlots: '/dailyRank',
      tabs: [{
        label: '排名',
        value: '/dailyRank',
        icon: 'iconfont icon-paiming'
      }, {
        label: '发现',
        value: '/find',
        icon: 'iconfont icon-faxian'
      }, {
        label: '我的',
        value: '/me',
        icon: 'iconfont icon-xiaolian'
      }]
    }
  },
  computed: {
    ...mapGetters([
      'cachedViews',
      'showTab'
    ]),
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    changeHandler (value) {
      this.$router.push(value)
    }
  },
  watch: {
    $route (val) {
      this.selectedLabelSlots = val.path
      this.$store.dispatch('addCachedView', val)
    }
  }
}
</script>

<style lang="stylus">
.tabs
  position fixed
  left 0
  right 0
  bottom 0
  background #ffffff
  height 60px
  z-index 2
  transform translateY(0)
  transition transform .3s
  .cube-tab
    >i
      font-size 18px
    >div
      font-size 16px
      margin-top 5px
.hide
  transform translateY(60px)
</style>
