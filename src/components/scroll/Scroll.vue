<template>
  <div class="scroll-list">
    <div class="scroll-container">
      <cube-scroll :data="data"
                   :options="options"
                   ref="scroll"
                   class="scroll"
                   :scroll-events="['scroll']"
                   @scroll="onScroll"
                   @pulling-up="onPullingUp">
        <slot></slot>
        <List :list="data" />
      </cube-scroll>
    </div>
    <div :class="['top', { 'is-active': showBackUp }]"
         @click="scrollToTop">
      <i class="iconfont icon-fanhuidingbu"></i>
    </div>
    <Loading v-if="loading" />
  </div>
</template>

<script>
import Loading from '@/components/loading/Loading'
import List from '@/components/list/List'

export default {
  props: {
    data: {
      type: Array
    },
    options: {
      type: Object,
      default () {
        return {
          observeDOM: true,
          click: true,
          probeType: 1,
          scrollbar: false,
          pullDownRefresh: false,
          pullUpLoad: false
        }
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading,
    List
  },
  data () {
    return {
      showBackUp: false
    }
  },
  methods: {
    onPullingUp () {
      this.$emit('onPullingUp')
    },
    onScroll (pos) {
      if (pos.y < -300) {
        const direction = this.$refs.scroll.scroll.movingDirectionY
        if (direction === 1) {
          this.showBackUp = false
        } else if (direction === -1) {
          this.showBackUp = true
        }
      } else {
        this.showBackUp = false
      }
      this.$emit('onScroll', pos)
    },
    scrollToTop () {
      // tip: 或者根据滚动的距离 比例来计算所需时间
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    forceUpdate () {
      this.$refs.scroll.forceUpdate()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/color.styl'
.scroll-list
  width 100%
  height 100%
  overflow hidden
  .scroll-container
    position absolute
    top 0
    right 0
    bottom 0
    left 0
  .top
    position fixed
    width 40px
    height 40px
    bottom 55px
    left 0
    right 0
    margin auto
    opacity 0
    transform translateY(90px)
    background $primary
    text-align center
    border-radius 50%
    box-shadow 0 0 10px rgba(0, 0, 0, 0.6)
    transition all 1s
    z-index 999
    &.is-active
      transform translateY(0)
      opacity 1
    i
      display block
      font-size 30px
      line-height 40px
      color white
</style>
