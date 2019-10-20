<template>
  <div v-if="info" class="detail">
    <div class="detail-header">
      <i class="pixicon icon-back" @click="close"></i>
      <!-- <i class="pixicon icon-more" @click="more"></i> -->
      <!-- <div class="download" @click="download">
          <i class="pixicon icon-download"></i>
          <span>下载原图</span>
        </div> -->
    </div>
    <!-- improving performance -->
    <!-- <template v-if="isShow"> -->
    <template>
      <div :style="{ minHeight: `${picHeight}px` }">
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
          <swiper-slide v-for="(img, idx) in imagesList" :key="idx" :name="idx">
            <img :src="img.src" />
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </template>
    <div class="detail-intro">
      <p class="detail-intro__title">{{ info.title }}</p>
      <div class="detail-intro__author">
        <img :src="addPrefix(info.artistPreView.avatar)" />
        <span>{{ info.artistPreView.name }}</span>
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
  props: {
    pid: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      info: null,
      height: 0,
      picHeight: 0,
      imagesList: [],
      activeIndex: 0,
      loading: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true,
          clickable: true
        }
      }
    }
  },
  watch: {
    loading: {
      handler (val) {
        val && this.$aMsg.loading('loading...')
      },
      immediate: true
    }
  },
  activated () {
    this.initData()
  },
  deactivated () {
    this.reset()
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
      return prefix + url.replace('_webp', '')
    },
    close () {
      this.$router.go(-1)
    },
    reset () {
      this.info = null
      this.imagesList = []
      this.activeIndex = 0
      this.loading = false
    },
    async initData () {
      this.loading = true
      await this.$api.detail.getPixById(this.pid).then(res => {
        if (res.status === 200) {
          this.$set(this, 'info', res.data.data)
        } else {
          if (res.data.message) {
            this.$aMsg.error(res.data.message)
          } else {
            this.$aMsg.error('网络连接故障～')
          }
          this.$router.go(-1)
        }
      })
      if (!this.info) return
      const width = window.innerWidth
      const minWidth = (window.innerWidth - 20) / 2
      this.imagesList = this.info.imageUrls.map(e => ({
        src: this.addPrefix(e.large)
      }))
      this.picHeight = (this.info.height / this.info.width) * width
      this.minHeight = (this.info.height / this.info.width) * minWidth
      this.loading = false
    }
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
  background white
  height 100vh
  width 100vw
  overflow scroll
  z-index 2
  opacity 1
  transition-delay .3s
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
