<!--
 * @Author: Dongzy
 * @since: 2019-10-10 22:04:08
 * @lastTime     : 2020-01-01 13:23:03
 * @LastAuthor   : Dongzy
 * @文件相对于项目的路径: \code\pixivic-mobile\src\App.vue
 * @message:
 -->
<template>
  <div id="app">
    <keep-alive
      :include="cachedViews"
      :max="10"
    >
      <router-view :key="key" />
    </keep-alive>
    <cube-tab-bar
      :inline="false"
      @change="changeHandler"
      class="tabs"
      v-model="selectedLabelSlots"
    >
      <cube-tab
        :key="index"
        :label="item.label"
        :value="item.value"
        v-for="(item, index) in tabs"
      >
        <i
          :class="item.icon"
          slot="icon"
        ></i>
      </cube-tab>
    </cube-tab-bar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedLabelSlots: 'DailyRank',
      tabs: [
        {
          label: '排名',
          value: 'DailyRank',
          icon: 'iconfont icon-paiming'
        },
        {
          label: '发现',
          value: 'Find',
          icon: 'iconfont icon-faxian'
        },
        {
          label: '我的',
          value: 'Me',
          icon: 'iconfont icon-xiaolian'
        }
      ]
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
      this.$router.push(`/${value}`)
      console.log(this.$route)
    }
  },
  watch: {
    'this.$route': {
      hander (val) {
        if (val.name) {
          this.$store.dispatch('addCachedView', val)
        }
      },
      immediate: false
    }

  },
  created () {
    setTimeout(() => {
      console.log(this.$route.name)
      this.selectedLabelSlots = this.$route.name
    }, 200)
  }
}
</script>

<style lang="stylus">
.tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  height: 50px;
  z-index: 2;

  .cube-tab {
    >i {
      font-size: 18px;
    }

    >div {
      font-size: 16px;
      margin-top: 5px;
    }
  }
}
</style>
