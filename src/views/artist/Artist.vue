<template>
  <transition enter-active-class="animated zoomIn"
              leave-active-class="animated rollOut"
              :duration="200">
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
        <cube-scroll :data="pictureList"
                     :options="options"
                     ref="scroll"
                     class="scroll"
                     :scroll-events="['scroll']"
                     @scroll="onScroll"
                     @pulling-up="onPullingUp">
          <cube-button @click="showPicker"
                       :light="true">{{typeText}}({{typeText === '插画' ? illustSum : mangaSum}})</cube-button>
          <List :list="pictureList" />
        </cube-scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Header from '@/components/header/Header'
import List from '@/components/list/List'
// import Loading from '@/components/Loading'
const OFFSET = 10
const HEADER_HEIGHT = 40
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
    List
    // Loading
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
    }
  },
  data () {
    const types = [{ text: `插画`, value: 'illust' }, { text: `漫画`, value: 'manga' }]
    return {
      artistDetail: null,
      title: '画师详情',
      illustType: 'illust',
      pictureList: [],
      imgInitHeight: 0,
      scrollY: 0,
      types,
      typeText: '插画',
      page: 1,
      illustSum: 0,
      mangaSum: 0
    }
  },
  mounted () {
    this.getArtistInfo()
    this.getArtistList()
    this.getSummary()
    // 要数据获取完 nextTick 才能得到dom
    // this.$nextTick(() => {
    //   console.log(this.$refs.imgWrapper.offsetHeight)
    // })
  },
  methods: {
    init () {
      this.imgInitHeight = this.$refs.imgWrapper.offsetHeight
      this.$refs.scrollWrapper.style.top = `${this.imgInitHeight - OFFSET}px`
      this.$refs.imgWrapper.style.zIndex = -1
      this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET}px`
    },
    handleClick () {
      this.$router.back()
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
    getArtistList () {
      const params = {
        artistId: this.artistId,
        type: this.illustType,
        page: this.page++
      }
      this.$api.detail
        .reqArtistIllust(params)
        .then(res => {
          if (!res.data.data) {
            this.$refs.scroll.forceUpdate()
            return
          }
          this.pictureList = this.pictureList.concat(res.data.data)
        })
    },
    getSummary () {
      this.$api.detail.reqSummary(this.artistId)
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
          data: [this.types],
          onSelect: this.selectHandle
        })
      }
      this.picker.show()
    },
    selectHandle (selectedVal, selectedIndex, selectedText) {
      this.typeText = selectedText[0]
      this.illustType = selectedVal[0]
      this.page = 1
      this.pictureList = []
      this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET}px`
      this.getArtistList()
    },
    onPullingUp () {
      this.getArtistList()
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
    >div
      position absolute
      left 0
      width 100%
      overflow visible
</style>
