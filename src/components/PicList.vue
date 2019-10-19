<template>
  <div class="pic" ref="picContent">
    <div class="pic__list">
      <div
        class="col"
        v-for="(list, listIdx) in [leftList, rightList]"
        :key="listIdx"
      >
        <img-preview
          v-for="(item, index) in list.list"
          :key="index"
          :info="item"
        />
      </div>
    </div>
    <div
      :class="['pic__back-to-top', { 'is-active': showBackUp }]"
      @click="scrollToTop"
    >
      <i class="pixicon icon-back"></i>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="isBottom"
      infinite-scroll-distance="10"
      class="rank__more"
    >
      <div v-if="isBottom" class="rank__more--bottom">
        (￣ˇ￣)俺也是有底线的
      </div>
    </div>
  </div>
</template>

<script>
import ImgPreview from '@/components/ImgPreview'

export default {
  name: 'PicList',
  props: {
    pictureList: {
      require: true,
      type: Array
    }
  },
  components: {
    ImgPreview
  },
  data () {
    return {
      searchKey: '',
      leftList: {
        height: 0
      },
      rightList: {
        height: 0,
        list: []
      },
      showBackUp: false,
      isBottom: false
    }
  },
  watch: {
    pictureList: {
      handler (val, old) {
        if (val.length === 0) {
          this.leftList.height = 0
          this.leftList.list = []
          this.rightList.height = 0
          this.rightList.list = []
        } else {
          const list = val.filter(e => !old.includes(e))
          for (let i = list.length - 1; i > 0; i--) {
            const a = list[i]
            const height = parseInt((a.height / a.width) * 10, 10)
            if (this.leftList.height <= this.rightList.height) {
              this.leftList.height += height
              this.leftList.list.push(a)
            } else {
              this.rightList.height += height
              this.rightList.list.push(a)
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadMore () {
      this.$emit('loadMore')
    },
    showBackUpOrNot () {
      this.showBackUp = document.querySelector('html').scrollTop > 100
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  },
  mounted () {
    window.addEventListener('scroll', this.showBackUpOrNot)
  },
  beforeDestory () {
    this.showBackUp = false
    window.addEventListener(this.showBackUpOrNot)
  }
}
</script>

<style lang="stylus" scoped>
.pic
  ::v-deep *
    transition all .5s
  &__back-to-top
    position fixed
    width 40px
    height 40px
    bottom 20px
    left 0
    right 0
    margin auto
    opacity 0
    transform translateY(30px) rotate(90deg)
    background $primary
    text-align center
    border-radius 50%
    box-shadow 0 0 10px rgba(0, 0, 0, .6)
    &.is-active
      transform translateY(0) rotate(90deg)
      opacity 1
    i
      display block
      font-size 30px
      line-height 40px
      color white
  &__list
    display flex
    padding-top 2px
    .col
      position relative
      width 50%
</style>
