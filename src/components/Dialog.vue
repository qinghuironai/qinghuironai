<template>
  <transition name="fade">
    <div class="dialog" v-show="isShow">
      <div class="dialog__mask" @click="close"></div>
      <div class="dialog__close" @click.stop="close">
        <img src="@/assets/images/close.svg" alt="">
      </div>
      <div class="dialog__content">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item, index) in images" :key="index">
            <img v-lazy="item" alt="" @click="pixiv">
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </transition>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  data () {
    return {
      swiperOption: {
        loop: true
      }
    }
  },
  components: {
    swiper,
    swiperSlide
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
  }
}

</script>
<style lang='stylus' scoped>
.fade-enter, .fade-leave-to
  transform translate3d(0, -100%, 0)
.fade-leave, .fade-enter-to
  transform translate3d(0, 0, 0)
.fade-enter-active, .fade-leave-active
  transition  all .2s
.dialog
  position relative
  font-size 1rem
  &__mask
    width 100%
    height 100%
    position fixed
    left 0
    top 0
    background rgba(51, 163, 220, .3)
    z-index 200
  &__close
    position fixed
    right 2%
    top 10%
    width 1.2rem
    height 1.2rem
    z-index 400
    img
      width 100%
  &__info
    position fixed
    top 0
  &__content
    position fixed
    top 10%
    bottom 0
    left 2%
    right 2%
    z-index 300
    overflow scroll
    img
      width 100%
      border-radius 0.4rem
</style>
