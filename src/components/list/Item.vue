<template>
  <div @click="goDetail(column)"
       class="item"
       :style="column.style">
    <div :class="['item-content', { 'isSetu': column.xrestrict === 1 || column.sanityLevel > 6 }]"
         :style="{backgroundColor}">
      <img :src="column.src"
           loading="lazy"
           width="100%"
           height="100%"
           alt="" />
      <img v-if="column.xrestrict === 1 || column.sanityLevel > 6"
           src="../../assets/images/error.svg"
           alt="" />
    </div>
    <div class="artist">
      <p class="artist-title">{{column.title}}</p>
      <div class="artist-avatar">
        <img :src="column.avatarSrc"
             @click.stop="goArtist(column.artistId)"
             alt="" />
        <span>{{column.artistPreView.name}}</span>
        <i class="iconfont icon-xinaixin"></i>
      </div>
    </div>
    <div class="count"
         v-if="column.pageCount > 1">
      <img src="../../assets/images/count.svg" />
      <span>{{column.pageCount}}</span>
    </div>
  </div>
</template>

<script>
import { color } from '@/util/constants'

export default {
  name: 'Item',
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  computed: {
    backgroundColor () {
      return color[Math.floor(Math.random() * 8)]
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
  }
}
</script>

<style lang="stylus" scope>
@import '~@/style/global.styl'
.item
  // margin-bottom 10px
  // // box-shadow 0 1px 5px rgba(0, 0, 0, 0.3)
  // border-radius 5px
  // position relative
  box-sizing border-box
  position absolute
  top 0
  left 0
  padding 10px
  .item-content
    width 100%
    height calc(100% - 100px)
    // display flex
    // justify-content center
    // align-items center
    border-radius 8px
    img
      width 100%
      height 100%
      object-fit cover
      border-radius 8px
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
    flex-direction column
    justify-content space-around
    height 100px
    box-sizing border-box
    .artist-title
      height 50px
      line-height 50px
      margin-left 5px
      no-wrap()
    .artist-avatar
      display flex
      align-items center
      flex 1
      // width 35px
      // height 35px
      // margin-right 5px
      img
        width 40px
        height 40px
        // border-radius 50%
        border-radius 50%
      span
        flex 1
        font-size 14px
        color #ccc
        margin 0 8px
        no-wrap()
      i
        flex-basis 30px
  .count
    position absolute
    display inline-block
    top 16px
    right 16px
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
