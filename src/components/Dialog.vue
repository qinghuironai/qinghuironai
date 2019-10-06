<template>
  <div>
    <div :class="['detail', { 'is-active': isShow }]">
      <div class="detail-header">
        <i class="pixicon icon-back" @click="close"></i>
        <i class="pixicon icon-more"></i>
      </div>
      <!-- improving performance -->
      <template v-if="isShow">
        <div
          class="detail-pics is-single"
          v-if="imagesList.length === 1"
          :style="{ minHeight: `${picHeight}px` }"
        >
          <img v-lazy="imagesList[0].src" />
        </div>
        <swiper
          class="detail-pics"
          v-if="imagesList.length > 1"
          :options="swiperOption"
          :style="{ minHeight: `${picHeight}px` }"
        >
          <swiper-slide v-for="(img, idx) in imagesList" :key="idx">
            <img :src="img.src" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </template>
      <div class="detail-intro">
        <p class="detail-intro__title">{{ info.title }}</p>
        <div class="detail-intro__author">
          <img
            :src="addPrefix(info.artistPreView.avatar)"
          />
          <span>{{ info.artistPreView.name }}</span>
        </div>
      </div>
    </div>
    <div
      :class="['detail-preview', { 'is-active': !isShow }]"
      @click="isShow = true"
    >
      <img
        v-if="imagesList[0]"
        v-lazy="imagesList[0].src"
        :style="{ height: `${minHeight}px` }"
      />
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'imgDialog',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      isShow: false,
      height: 0,
      imagesList: [],

      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true,
          clickable: true
        }
      },
      showList: []
    }
  },
  props: {
    info: {
      type: Object
    }
  },
  methods: {
    addPrefix (url) {
      let prefix = ''
      if (url.includes('i.pximg')) {
        prefix = 'https://img.pixivic.com:23334/get/'
      }
      return prefix + url
    },
    close () {
      this.isShow = false
      this.download()
    },
    pixiv () {
      window.open(this.info.user.profile_image_urls.medium, '_blank')
    },
    download () {
      var link = document.createElement('a')
      if ('download' in link) {
        link.style.display = 'none'
        const e = this.imagesList[0].src
        // this.imagesList.map(e => {
        // link.setAttribute('target', '_blank')
        link.setAttribute('download', '')
        link.href = e
        document.body.appendChild(link)
        // link.click()
        document.body.removeChild(link)
        // })
      } else {
        this.$aMsg.error('本地浏览器不支持自动下载～')
      }
    },
    onload (idx) {
      setTimeout(() => {
        this.showList.push(idx)
      }, 200)
    }
  },
  mounted () {
    const width = window.innerWidth
    const minWidth = (window.innerWidth - 20) / 2
    this.imagesList = this.info.imageUrls.map(e => ({
      src: this.addPrefix(e.large)
    }))
    this.picHeight = (this.info.height / this.info.width) * width
    this.minHeight = (this.info.height / this.info.width) * minWidth
  }
}
</script>
<style lang="stylus" scoped>
.pixicon
  display inline-block
  font-size 30px
  padding 12px 12px
  cusor pointer
.detail
  position fixed
  top 0
  left 0
  display flex
  flex-direction column
  background $mask
  height 100vh
  width 100vw
  overflow scroll
  z-index 2
  transform scale(0)
  opacity 0
  pointer-events none
  transform-origin bottom center
  &.is-active
    opacity 1
    pointer-events all
    transform scale(1)
  &-header
    padding 0 10px
    position sticky
    background white
    top 0
  &-pics
    width 100%
    &.is-single
      display flex
      flex-direction column
      justify-content center
    ::v-deep
      .swiper
        &-slide
          display flex
          flex-direction column
          justify-content center
        &-pagination
          top 20px
          &-bullet
            height 6px
            width 40px
            border-radius 2px
            &-active
              background $primary
  &-pics, &-preview
    img
      width 100%
  &-intro
    flex 1
    padding 12px 16px
    background white
    &__title
      font-size 21px
      font-weight 700
      width 100%
    &__author
      margin-top 12px
      display flex
      align-items center
      margin-bottom 40px
      img
        border-radius 50%
        height 40px
        width 40px
        margin-right 8px
      span
        flex 1
        font-size 16px
        font-weight 700
</style>
