<template>
  <div
    class="header"
    :style="{background: `${background}`, opacity: show ? 1 : 0}"
  >
    <i class="iconfont icon-fanhui" @click="handleClick" />
    <h1>{{ title }}</h1>
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
      default: '#0096fa'
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      this.$router.back();
      this.$emit('handleClick');
    }
  }
};
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
  opacity 1
  transition opacity .3s ease-in
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
