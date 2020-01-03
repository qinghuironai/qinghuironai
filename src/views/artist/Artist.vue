<template>
  <transition enter-active-class="animated zoomIn"
              leave-active-class="animated rollOut">
    <div class="artists"
         v-if="artistDetail">
      <Header :title="title"
              ref="header"
              @handleClick="handleClick" />
      <div class="artists__background"
           ref="imgWrapper"
           :style="{backgroundImage: `url(${PREFIX + artistDetail.avatar})`}">
        <div class="filter"></div>
      </div>
      <div class="artists__info"
           ref="info">
        <img :src="`${PREFIX + artistDetail.avatar}`"
             width="80"
             height="80"
             alt="" />
        <p>{{artistDetail.name}}</p>
        <div class="follow">关注</div>
      </div>
      <div class="artists__bglayer"
           ref="layer"></div>
      <div class="artists__scroll"
           ref="scrollWrapper">
        <Scroll :data="pictureList"
                :options="options"
                :loading="loading"
                :noMore="noMore"
                ref="scroll"
                @scroll="onScroll"
                @pulling-up="getMoreData">
          <cube-button @click="showPicker"
                       :light="true">{{typeText}}</cube-button>
        </Scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Header from '@/components/header/Header'
import Scroll from '@/components/scroll/Scroll'
const OFFSET = 10
const HEADER_HEIGHT = 40
const types = [{ text: `插画`, value: 'illust' }, { text: `漫画`, value: 'manga' }]

export default {
  name: 'Artist',
  props: {
    artistId: {
      required: true,
      type: String
    }
  },
  components: {
    Header,
    Scroll
  },
  computed: {
    options () {
      return {
        pullUpLoad: {
          threshold: 0,
          txt: { more: '上拉加载更多', noMore: '(￣ˇ￣)俺也是有底线的' },
          visible: false
        },
        scrollbar: true,
        probeType: 3
      }
    },
    param () {
      return {
        artistId: this.artistId,
        type: this.illustType,
        page: this.page
      }
    },
    typeText () {
      if (this.illustType === 'illust') {
        return `插画(${this.illustSum})`
      } else if (this.illustType === 'manga') {
        return `漫画(${this.mangaSum})`
      }
      return null
    }
  },
  data () {
    return {
      artistDetail: null,
      title: '画师详情',
      illustType: 'illust',
      pictureList: [],
      imgInitHeight: 0,
      scrollY: 0,
      page: 1,
      illustSum: 0,
      mangaSum: 0,
      loading: false,
      noMore: false
    }
  },
  mounted () {
    this.getArtistInfo()
    this.getData()
    this.getSummary()
  },
  methods: {
    init () {
      this.imgInitHeight = this.$refs.imgWrapper.offsetHeight
      this.$refs.scrollWrapper.style.top = `${this.imgInitHeight - OFFSET}px`
      this.$refs.imgWrapper.style.zIndex = -1
      this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET}px`
    },
    getArtistInfo () {
      this.$api.detail
        .reqArtist(this.artistId)
        .then(res => {
          this.artistDetail = res.data.data
          this.$nextTick(() => {
            this.init()
          })
        })
    },
    getData () {
      this.loading = true
      this.page = 1
      this.pictureList = []
      this.noMore = false
      this.$api.detail
        .reqArtistIllust(this.param)
        .then(res => {
          if (!res.data.data) {
            this.noMore = true
          } else {
            this.pictureList = res.data.data
          }
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    getMoreData () {
      this.page++
      this.$api.detail
        .reqArtistIllust(this.param)
        .then(res => {
          if (!res.data.data) {
            this.noMore = true
          } else {
            this.pictureList = this.pictureList.concat(res.data.data)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getSummary () {
      this.$api.detail
        .reqSummary(this.artistId)
        .then(res => {
          this.illustSum = res.data.data.find(item => item.type === 'illust')['sum']
          this.mangaSum = res.data.data.find(item => item.type === 'manga')['sum']
        })
    },
    onScroll (pos) {
      this.scrollY = -pos.y
      const newY = pos.y
      const percent = Math.abs(newY / this.imgInitHeight)
      const minScrollY = -this.imgInitHeight + HEADER_HEIGHT
      if (newY > 0) {
        this.title = '画师详情'
        this.$refs.imgWrapper.style['transform'] = `scale(${1 + percent})`
        this.$refs.info.style['transform'] = `translate3d(0, ${newY}px, 0)`
        this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET + newY}px`
      } else if (newY > minScrollY) {
        this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET - Math.abs(newY)}px`
        this.$refs.layer.style.zIndex = 1
        this.$refs.imgWrapper.style.paddingTop = '75%'
        this.$refs.imgWrapper.style.height = 0
        this.$refs.imgWrapper.style.zIndex = -1
        this.$refs.info.style['transform'] = `translate3d(0, ${newY}px, 0)`
        this.$refs.info.style['opacity'] = `${1 - percent * 2}`
      } else {
        this.title = this.artistDetail.name
        this.$refs.layer.style.top = `${HEADER_HEIGHT - OFFSET}px`
        this.$refs.layer.style.zIndex = 1
        this.$refs.header.$refs.header.style.zIndex = 100

        this.$refs.imgWrapper.style.height = `${HEADER_HEIGHT}px`
        this.$refs.imgWrapper.style.paddingTop = 0
        this.$refs.imgWrapper.style.zIndex = 99
      }
    },
    showPicker () {
      if (!this.picker) {
        this.picker = this.$createPicker({
          title: 'Picker',
          data: [types],
          onSelect: this.selectHandle
        })
      }
      this.picker.show()
    },
    selectHandle (selectedVal, selectedIndex, selectedText) {
      this.illustType = selectedVal[0]
      this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET}px`
      this.getData()
    },
    handleClick () {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@/style/color.styl'
.artists
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100%
  z-index 3
  overflow hidden
  background #f2f3f4
  font-size 16px
  &__background
    position relative
    width 100%
    height 0
    padding-top 75%
    transform-origin top
    background-size cover
    z-index 60
    filter blur(20px)
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.3)
  &__bglayer
    position absolute
    top 0
    bottom 0
    width 100%
    background #fff
    border-radius 10px
    z-index 50
  &__tabs
    position absolute
    top 0
    left 0
    width 100%
    height 50px
    background #fff
    border-radius 10px 10px 0 0
    z-index 100
  &__info
    position absolute
    top 70px
    left 0
    right 0
    margin auto
    width 100%
    display flex
    justify-content center
    align-items center
    flex-direction column
    z-index 100
    img
      border-radius 50%
    p
      color #ffffff
      margin 10px 0
      font-size 18px
    .follow
      width 120px
      height 40px
      background $primary
      color #ffffff
      border-radius 20px
      text-align center
      line-height 40px
      font-size 16px
  &__scroll
    position absolute
    // top 340px
    top 0
    left 0
    bottom 0
    right 0
    z-index 51
    .scroll-list
      .scroll-container
        .cube-scroll-wrapper
          overflow visible !important
</style>
