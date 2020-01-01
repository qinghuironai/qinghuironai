<template>
  <div class="header"
       ref="header"
       :style="{background: `${background}`}">
    <i class="iconfont icon-fanhui"
       @click="handleClick"></i>
    <h1>{{title}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    background: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick () {
      this.$emit('handleClick')
    }
  }
}
</script>

<style lang="stylus" scope>
.header
  position fixed
  padding 5px 10px
  padding-top 0
  height 40px
  width 100%
  z-index 100
  display flex
  line-height 40px
  box-sizing border-box
  color #fff
  >i
    position absolute
    left 5px
    top 0
    font-size 20px
    width 20px
  >h1
    font-size 18px
    font-weight 700
    margin 0 auto
</style>
