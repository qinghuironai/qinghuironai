<template>
  <div>
    <div class="detail-preview--wrapper" @click="openDetail">
      <div class="detail-preview">
        <img
          v-if="imagesList[0]"
          v-lazy="imagesList[0].src"
          :style="{ height: `${minHeight}px` }"
        />
        <div v-if="imagesList.length > 1" class="detail-preview-count">
          <img
            src="@/assets/images/count.svg"
            alt=""
            class="detail-preview-count__icon"
          />
          <span>{{ imagesList.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgPreview',
  data () {
    return {
      height: 0,
      picHeight: 0,
      imagesList: [],
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
    openDetail () {
      this.$router.push(`/detail/${this.info.id}`)
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
  transition-delay .3s
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
  &-preview
    img
      width 100%
</style>
