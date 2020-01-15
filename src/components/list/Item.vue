<template>
  <div @click="goDetail(column)"
       class="item">
    <div :class="['item-content', { 'isSetu': column.xrestrict === 1 || column.sanityLevel > 6 }]"
         :style="{backgroundColor: column.backgroundColor}">
      <img :src="column.src"
           loading="lazy"
           :style="{opacity}"
           @load="opacity = 1"
           alt="" />
      <div class="count"
         v-if="column.pageCount > 1">
        <img src="../../assets/images/count.svg" />
        <span>{{column.pageCount}}</span>
      </div>
      <div class="like">
        <img src="../../assets/images/aixin.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      opacity: 0
    }
  },
  methods: {
    goDetail (column) {
      if (column.xrestrict === 1 || column.sanityLevel > 6) return
      this.$router.push(`/detail/${column.id}`)
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
  // position absolute
  // top 0
  // left 0
  width 100%
  height 100%
  padding 8px
  .item-content
    position relative
    width 100%
    height 100%
    // display flex
    // justify-content center
    // align-items center
    border-radius 8px
    >img
      width 100%
      height 100%
      object-fit cover
      // border-radius 8px
      opacity 0
    >img[lazy=loading], img[lazy=error]
      // transform scale(0.3)
      width 50px
      height 50px
    .count
      position absolute
      display inline-block
      top 8px
      right 8px
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
    .like
      position absolute
      bottom 8px
      right 8px
      width 20px
      height 20px
      img
        width 100%
        height 100%
  .isSetu
    position relative
    img
      filter blur(30px)
    &::after
      content url('~@/assets/images/error.svg')
      // background-image url('~@/assets/images/error.svg')
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      width 40px
      height 40px
      margin auto
      // z-index 100
</style>
