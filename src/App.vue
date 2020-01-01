<template>
  <div id="app">
    <keep-alive :include="cachedViews"
                :max="10">
      <router-view :key="key" />
    </keep-alive>
    <cube-tab-bar v-model="selectedLabelSlots"
                  class="tabs"
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
    key () {
      // 这样写的话 详情返回到排行 排行也每次都变了 回不到原来位置
      // return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      return this.$route.fullPath
    },
    cachedViews () {
      return this.$store.getters.cachedViews
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
  .cube-tab
    >i
      font-size 18px
    >div
      font-size 16px
      margin-top 5px
</style>
