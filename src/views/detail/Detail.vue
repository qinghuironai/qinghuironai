<template>
  <transition enter-active-class="animated zoomIn"
              leave-active-class="animated rollOut"
              :duration="200">
    <div class="detail">
      <Scroll v-if="illustDetail"
              :data="pictureList"
              ref="scroll"
              :options="options"
              :loading="loading"
              :noMore="noMore"
              @pulling-up="getMoreData">
        <div class="detail__top animated zoomIn">
          <div class="top__img"
               :style="`height: ${illustDetail.itemHeight}px`"
               @click="showImagePreview">
            <img v-lazy="PREFIX + illustDetail.imageUrls[0].large.replace('_webp', '')"
                 alt="" />
          </div>
          <div class="top__content">
            <h2 class="title">{{illustDetail.title}}</h2>
            <div class="artist">
              <img :src="PREFIX + illustDetail.artistPreView.avatar"
                   @click="goArtist"
                   alt="" />
              <h2>{{illustDetail.artistPreView.name}}</h2>
            </div>
            <div class="time">
              <span>
                {{illustDetail.createDate | formatCreateDate}}
              </span>
              <span>{{illustDetail.totalView}} 阅读</span>
              <span>
                <span>{{illustDetail.totalBookmarks}} </span>喜欢!
              </span>
            </div>
          </div>
        </div>
        <h2 class="detail__middle"
            v-if="pictureList.length">相关作品</h2>
      </Scroll>
      <Bottom :detail="illustDetail"
              @handleClick="handleClick" />
    </div>
  </transition>
</template>

<script>
import dayjs from 'dayjs'
import Scroll from '@/components/scroll/Scroll'
import Bottom from './bottom/Bottom'

export default {
  name: 'Detail',
  components: {
    Bottom,
    Scroll
  },
  props: {
    pid: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      pictureList: [],
      illustDetail: null,
      loading: false,
      page: 1,
      noMore: false
    }
  },
  computed: {
    imgs () {
      return this.illustDetail.imageUrls.reduce((pre, cur) => {
        return pre.concat(`${this.PREFIX + cur.original}`)
      }, [])
    },
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
        page: this.page,
        illustId: this.pid
      }
    }
  },
  mounted () {
    this.getIllustDetail()
    this.getRelatedList()
  },
  methods: {
    getIllustDetail () {
      this.$api.detail
        .reqIllustDetail(this.pid)
        .then(res => {
          const data = res.data.data
          this.illustDetail = { ...data, itemHeight: parseInt((data.height / data.width) * window.innerWidth) }
        })
    },
    getData () {
      this.loading = true
      this.page = 1
      this.pictureList = []
      this.noMore = false
      this.$api.detail
        .reqRelatedIllust(this.param)
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
        .reqRelatedIllust(this.param)
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
    showImagePreview () {
      this.$createImagePreview({
        imgs: this.imgs
      }).show()
    },
    handleClick () {
      this.$router.back()
    },
    goArtist () {
      this.$router.push(`/artist/${this.illustDetail.artistId}`)
    }
  },
  filters: {
    formatCreateDate (val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm')
    }
  }
  // 会出现 前进后退都是 Detail 的情况
  // beforeRouteLeave (to, from, next) {
  //   console.log('to', to)
  //   console.log('from', from) // Detail
  //   let cache = this.$vnode.parent.componentInstance.cache
  //   let keys = this.$vnode.parent.componentInstance.keys
  //   console.log('cache', cache) // {/dailyRank: VNode, /search: VNode, /detail/48233212: VNode}
  //   console.log('keys', keys) // ["/dailyRank", "/search", "/detail/48233212"]
  // }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/color.styl'
@import '~@/style/global.styl'
.detail
  position fixed
  top 0
  left 0
  bottom 60px
  background-size contain
  width 100vw
  background-color #fff
  z-index 3
  font-size 16px
  &__top
    width 100%
    background $white
    transition all 0.2s
    .top__img
      max-height 500px
      text-align center
      position relative
      overflow hidden
      display flex
      justify-content center
      align-items center
      >img
        width 100%
        height 100%
        vertical-align middle
        transition opacity 0.3s
        opacity 1
        object-fit cover
      img[lazy=loading]
        width 100px
        height 100px
    .top__content
      padding 10px
      .title
        font-size 18px
        margin-bottom 8px
        no-wrap()
      .subtitle
        font-size 16px
        color $primary
        margin-bottom 8px
      .artist
        display flex
        align-items center
        margin-bottom 8px
        img
          width 40px
          height 40px
          border-radius 50%
          margin-right 5px
        >h2
          flex 1
          font-size 16px
      .time
        display flex
        align-items center
        font-size 14px
        color #cccccc
        >span
          flex 1
          text-align center
          &:last-child
            span
              color $primary
  &__middle
    text-align center
    height 40px
    line-height 40px
    font-size 20px
    border-bottom 1px solid #cccccc
    margin-bottom 10px
</style>
