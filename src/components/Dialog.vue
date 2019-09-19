<template>
  <transition name="dialog-fade">
    <div class="dialog" v-show="isShow">
      <div  class="dialog__content--wapper" >
        <div ref="dialogContent" class="dialog__content" v-if="imagesList.length > 0" >
            <div v-for="(item, index) in imagesList"
              :key="index"
              :class="['dialog__content--item', {loading: !showList.includes(index)}]">
              <img
                :key="index"
                src="@/assets/images/loading.svg"
                :class="['loading', {opacity: !showList.includes(index)}]"/>
              <img
                :src="item"
                @load="onload(index)"
                :class="{opacity: showList.includes(index)}"/>
            </div>
        </div>
      </div>
      <div class="dialog__mask" ref="dialogBg" @click="close">
        <img :src="bg" :class="[bgClass,{opacity: bgShow}]">
      </div>
      <div class="dialog__menu" @click.stop="close">
        <!-- <div class="text dialog__save" @click.stop="download">
          save
        </div> -->
        <div class="text dialog__link" @click.stop="close">
          back
          <!-- <img src="@/assets/images/close.svg" alt=""> -->
        </div>
        <div class="text dialog__save" @click.stop="pixiv">
          Link
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  data () {
    const { width, height } = window.screen
    return {
      screanWH: width / height,
      imagesList: [],
      showList: [],
      bg: '',
      bgShow: false,
      bgClass: ''
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
    },
    download () {
      var link = document.createElement('a')
      if ('download' in link) {
        link.style.display = 'none'
        const e = this.imagesList[0]
        // this.imagesList.map(e => {
        link.setAttribute('download', 'download')
        link.href = e
        document.body.appendChild(link)
        link.click()
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
  watch: {
    isShow: {
      handler: function (val) {
        if (val) {
          this.imagesList = this.images.map(e => {
            return 'https://img.pixivic.com:23334/get/' + e.original
          })
          const img = this.$refs.dialogBg.children[0]
          img.src = this.imagesList[0]
          img.onload = () => {
            this.$nextTick(() => {
              const { width, height } = img
              this.bgShow = true
              this.bgClass = width / height > this.screanWH ? 'height' : 'width'
            })
          }
          this.$nextTick(() => {
          })
        } else {
          this.imagesList = []
          this.showList = []
          this.bg = ''
          this.bgShow = false
        }
      },
      immediate: true
    }
  }
}

</script>
<style lang='stylus' scoped>
.dialog-fade-enter-active
  transition: all .3s ease
.dialog-fade-leave-active
  transition: all .5s ease
.dialog-fade-enter,
.dialog-fade-leave-to
  opacity: 0;
.dialog
  position fixed
  width 100vw
  height 100vh
  left 0
  top 0
  font-size 1rem
  overflow hidden
  z-index 1
  .opacity
    opacity 1
  &__mask
    position fixed
    width 100vw
    height 100vh
    left 0
    top 0
    background-color #0b2431e6
    overflow-y hidden
    z-index -1
    img
      position absolute
      opacity 0
      top 50%
      left 50%
      transform translate(-50%, -50%)
      filter blur(4px) grayscale(20%)
      transition opacity .8s
      &.width
        width 100%
      &.height
        height 100%
  &__menu
    position fixed
    display flex
    bottom: 0
    width 100%
    height 6rem
    justify-content center
    align-items center
    z-index 2
    div
      margin-right 1rem
      &.text
        padding .5rem 1rem
        // box-shadow: inset -2px -2px 4px black;
      &.icon
        padding .5rem
      &:last-child
        margin-right 0
  &__save
    border-radius 4px
    color: #fff
    background-color: #e60023
  &__link
    border-radius 4px
    color: #333
    background-color: #efefef
  &__close
    width 1.2rem
    height 1.2rem
    border-radius 50%
    background-color: #fff
    img
      height 1.2rem
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
    &--item
      display inline-block
      width 100%
      height auto
      &.loading
        height 100vw
    img
      width 100%
      opacity 0
      line-height 1
      transition  all 1s ease
      &.loading
        position absolute
        pointer-events none
    &--wapper
      position fixed
      top: 0;
      left: 0;
      width 100%
      height 100%
      overflow-y auto
      z-index 1
</style>
