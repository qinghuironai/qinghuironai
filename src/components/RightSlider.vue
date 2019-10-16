<template>
  <div class="right-slider">
    <transition name="fade">
      <div class="right-slider__mask" v-show="showRightSlider" @click="close"></div>
    </transition>
    <transition name="slide-fade">
      <div class="right-slider__content" v-show="showRightSlider">
        <img src="../assets/images/书签.svg" alt="">
        <img src="../assets/images/关注.svg" alt="">
        <img src="../assets/images/收藏.svg" alt="">
        <img src="../assets/images/设置.svg" alt="">
        <img src="../assets/images/退出.svg" @click="logout" alt="">
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    showRightSlider: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('update:showRightSlider', false) // 不能加空格
    },
    logout () {
      this.$confirm.showConfirm({
        title: '退出',
        content: '确认退出吗？'
      }).then(() => {
        this.$store.dispatch('clearCurrentState')
        this.$emit('update:showRightSlider', false)
        this.$aMsg.success('欢迎再次光临~')
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.right-slider
  &__mask
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    opacity 1
    z-index 100
    background rgba(0, 0, 0, .5)
  .fade-enter-to, .fade-leave-to
    transition opacity 0.3s
  .fade-enter, .fade-leave-to
    opacity 0
  &__content
    z-index 101
    position fixed
    top 0
    right 0
    width 20vw
    height 100vh
    border-radius 2.5rem 0 0 2.5rem
    background #fff
    display flex
    flex-direction column
    align-items center
    img
      width 10vw
      margin-top 1rem
      &:nth-last-child(2)
        position absolute
        bottom 4rem
      &:last-child
        position absolute
        bottom 1rem
  .slide-fade-leave-active, .slide-fade-enter-active
    transition transform 0.3s
  .slide-fade-enter, .slide-fade-leave-to
    transform translate(20vw, 0)
    img
      width 15vw
</style>
