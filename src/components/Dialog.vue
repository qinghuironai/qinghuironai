<template>
  <transition name="fade">
    <div class="dialog" v-show="isShow">
      <div class="dialog__content" v-if="imagesList.length > 0">
        <img v-for="(item, index) in imagesList" :key="index" v-lazy="item" @click="pixiv"/>
      </div>
      <div class="dialog__mask" @click="close"></div>
      <div class="dialog__close" @click.stop="close">
        <img src="@/assets/images/close.svg" alt="">
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  data () {
    return {
      imagesList: []
    }
  },
  props: {
    images: {
      type: Array
    },
    info: {
      type: Object
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('update:isShow', false)
    },
    pixiv () {
      window.open(this.info.user.profile_image_urls.medium, '_blank')
    }
  },
  watch: {
    isShow: {
      handler: function (val) {
        if (val) {
          this.imagesList = [...this.images]
        } else {
          this.imagesList = []
        }
      },
      immediate: true
    }
  }
}

</script>
<style lang='stylus' scoped>
.fade-enter, .fade-leave-to
  opacity 1
.fade-leave, .fade-enter-to
  opacity 0
.fade-enter-active, .fade-leave-active
  transition  all .2s ease
.dialog
  position fixed
  width 100%
  height 100%
  font-size 1rem
  overflow-y auto
  z-index 1
  &__mask
    position fixed
    width 100%
    height 100%
    left 0
    top 0
    background rgba(51, 163, 220, .3)
    z-index 200
  &__close
    position fixed
    right 2%
    top 2%
    width 1.2rem
    height 1.2rem
    z-index 400
    img
      width 100%
  &__info
    position fixed
    top 0
  &__content
    position absolute
    display: flex
    width 100%
    height auto
    min-height 100vh
    flex-direction column
    justify-content center
    align-items center
    overflow-y auto
    img
      width 100%
      z-index 300
</style>
