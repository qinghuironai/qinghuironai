<template>
  <div>
    <div
      :class="['detail-preview--wrapper', { 'is-active': isShow }]"
      @click="isShow = true"
    >
      <div class="detail-preview">
        <img
          v-if="imagesList[0]"
          v-lazy="imagesList[0].src"
          :style="{ height: `${minHeight}px` }"
        />
        <div v-if="imagesList.length > 1" class="detail-preview-count">
          <img src="@/assets/images/count.svg" alt="" class="detail-preview-count__icon"/>
          <span>{{ imagesList.length }}</span>
        </div>
      </div>
    </div>
    <div :class="['detail', { 'is-active': isShow }]">
      <div class="detail-header">
        <i class="pixicon icon-back" @click="close"></i>
        <!-- <i class="pixicon icon-more" @click="more"></i> -->
        <div class="download" @click="download">
          <i class="pixicon icon-download"></i>
          <span>下载原图</span>
        </div>
      </div>
      <!-- improving performance -->
      <!-- <template v-if="isShow"> -->
      <template>
        <div
          class="detail-pics is-single"
          v-if="imagesList.length === 1"
          :style="{ minHeight: `${picHeight}px` }"
        >
          <img :src="imagesList[0].src" />
        </div>
        <swiper
          class="detail-pics"
          ref="swiper"
          v-if="imagesList.length > 1"
          :options="swiperOption"
          :style="{ minHeight: `${picHeight}px` }"
          @slideChange="slideChange"
        >
          <swiper-slide v-for="(img, idx) in imagesList" :key="idx" :name="idx" >
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
      activeIndex: 0,
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
    slideChange () {
      this.activeIndex = this.$refs.swiper.$data.swiper.activeIndex
    },
    addPrefix (url) {
      let prefix = ''
      if (url.includes('i.pximg')) {
        prefix = 'https://img.pixivic.com:23334/get/'
      }
      return prefix + url
    },
    close () {
      this.isShow = false
    },
    download () {
      const url = this.info.imageUrls[this.activeIndex].original
      this.$util.dom.downloadByBlob(this.addPrefix(url))
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
  opacity 0
  pointer-events none
  transition-delay .3s
  &.is-active
    opacity 1
    pointer-events all
  &-preview
    position relative
    box-shadow 0 1px 3px rgba(0, 0, 0, .3)
    border-radius 8px
    overflow hidden
    &-count
      position absolute
      top 0.4rem
      right 0.4rem
      background-color #0000009e
      padding 0.2rem
      border-radius 0.25rem
      & > &__icon
        width 1.25rem
        height 1.25rem
        margin-right 0.2rem
        vertical-align middle
      span
        color #fff
        vertical-align middle
        line-height 1.25rem
        font-size 1rem
    &--wrapper
      position relative
      padding 10px 4px
      &.is-active
        opacity 0
        overflow auto
        pointer-events none
        transform scale(2.5)
        z-index 2
  &-header
    padding 0 10px
    position sticky
    background white
    top 0
    z-index 3
    .download
      display inline-block
      float right
      color white
      background #e60023
      margin 12px 16px
      padding 8px 10px
      font-size 16px
      border-radius 8px
      flex 1
      i
        font-size 16px
        padding 0
        margin-right 4px
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
