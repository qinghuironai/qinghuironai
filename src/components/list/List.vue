<template>
  <div class="list">
    <div v-for="(item, index) in [leftList, rightList]"
         :key="index"
         class="column">
      <transition-group enter-active-class="animated fadeInUp"
                        leave-active-class="animated fadeIn">
        <div v-for="column in item"
             :key="column.id"
             @click="goDetail(column)"
             class="item"
             :style="`width: ${column.itemWidth}px; height: ${column.itemHeight}px`">
          <div :class="['item-content', { 'isSetu': column.xrestrict === 1 || column.sanityLevel > 6 }]">
            <img v-lazy="PREFIX + column.imageUrls[0].medium"
                 alt="" />
            <img v-if="column.xrestrict === 1 || column.sanityLevel > 6"
                 src="../../assets/images/error.svg"
                 alt="" />
          </div>
          <div class="artist">
            <div class="artist-avatar">
              <img :src="PREFIX + column.artistPreView.avatar"
                   @click.stop="goArtist(column.artistId)"
                   alt="" />
            </div>
            <div class="artist__title">
              <h2>{{column.title}}</h2>
              <span>{{column.artistPreView.name}}</span>
            </div>
            <i class="iconfont icon-xinaixin"></i>
          </div>
          <div class="count"
               v-if="column.pageCount > 1">
            <img src="../../assets/images/count.svg" />
            <span>{{column.pageCount}}</span>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      leftList: [],
      rightList: [],
      leftHight: 0,
      rightHight: 0
    }
  },
  methods: {
    goDetail (column) {
      if (column.xrestrict === 1 || column.sanityLevel > 6) return
      this.$router.push(`/detail/${column.id}`)
    },
    goArtist (artistId) {
      this.$router.push(`/artist/${artistId}`)
    }
  },
  watch: {
    list: {
      handler (val, old) {
        if (val.length === 0) {
          this.leftHight = 0
          this.leftList = []
          this.rightHight = 0
          this.rightList = []
        } else {
          let winWidth = window.innerWidth
          let itemWidth = (winWidth - 20) / 2
          let maxHeight = parseInt(itemWidth / 0.7) + 50 // 避免图片太长霸屏
          const list = val.filter(e => !old.includes(e))
          for (let i = list.length - 1; i >= 0; i--) {
            let tmp = list[i]
            tmp = { ...tmp, itemWidth: itemWidth }
            let per = tmp.width / tmp.itemWidth
            tmp = { ...tmp, itemHeight: parseInt(tmp.height / per) + 50 } // 50留给底部用
            if (tmp.itemHeight > maxHeight) {
              tmp.itemHeight = maxHeight
            }
            if (this.leftHight <= this.rightHight) {
              this.leftHight += tmp.itemHeight
              this.leftList.push(tmp)
            } else {
              this.rightHight += tmp.itemHeight
              this.rightList.push(tmp)
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@/style/global.styl'
.list
  width 100%
  height 100%
  display flex
  flex-direction row
  overflow hidden
  position relative
  // padding-bottom 60px
  background #ffffff
  box-sizing border-box
  .column
    width 50%
    display flex
    flex-direction column
    align-items center
    .item
      margin-bottom 10px
      // box-shadow 0 1px 5px rgba(0, 0, 0, 0.3)
      border-radius 5px
      position relative
      box-sizing border-box
      .item-content
        width 100%
        height calc(100% - 50px)
        display flex
        justify-content center
        align-items center
        img
          width 100%
          height 100%
          object-fit cover
          border-radius 5px 5px 0 0
        img[lazy=loading], img[lazy=error]
          // transform scale(0.3)
          width 50px
          height 50px
      .isSetu
        position relative
        img:first-child
          filter blur(30px)
        img:last-child
          position absolute
          top 0
          right 0
          bottom 0
          left 0
          width 40px
          height 40px
          margin auto
          z-index 100
      .artist
        display flex
        align-items center
        height 50px
        box-sizing border-box
        padding-left 10px
        .artist-avatar
          width 35px
          height 35px
          margin-right 5px
          img
            width 100%
            height 100%
            // border-radius 50%
            border-radius 10px
        &__title
          flex 1
          display flex
          flex-direction column
          justify-content center
          height 100%
          overflow hidden
          h2
            font-size 14px
            font-weight bold
            margin-bottom 5px
            no-wrap()
          span
            font-size 12px
            color #cccccc
            no-wrap()
        i
          flex-basis 30px
      .count
        position absolute
        display inline-block
        top 6px
        right 6px
        color white
        background-color #0000009e
        padding 2px
        border-radius 4px
        img
          float left
          fill white
          height 20px
          width 20px
        span
          float right
          padding 0 2px
          line-height 20px
</style>
