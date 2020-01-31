<template>
  <div class="item" @click="goDetail">
    <div class="item-content" :style="column.style">
      <img
        :src="column.src"
        :style="{opacity}"
        @load="opacity = 1"
      >
    </div>
    <div v-if="column.pageCount > 1" class="count">
      <img src="../../assets/images/count.svg">
      <span>{{ column.pageCount }}</span>
    </div>
    <Like :like="column.isLiked" @handleLike="handleLike" />
    <div v-if="column.xrestrict === 1 || column.sanityLevel > 6" class="setu-filter">
      <img width="100%" src="../../assets/images/error.svg">
    </div>
  </div>
</template>

<script>
import Like from '@/components/like/Like';

export default {
  name: 'Item',
  components: {
    Like
  },
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      opacity: 0
    };
  },
  methods: {
    goDetail() {
      if (this.column.xrestrict === 1 || this.column.sanityLevel > 6) return;
      this.$router.push(`/detail/${this.column.id}`);
    },
    handleLike() {
      // this.isLiked = !this.isLiked;
      this.$emit('handleLike', this.column);
    }
  }
};
</script>

<style lang="stylus" scope>
@import '~@/style/global.styl'
.item
  box-sizing border-box
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  padding 8px
  overflow hidden
  .item-content
    position relative
    width 100%
    height 100%
    border-radius 5px
    img
      width 100%
      height 100%
      transition opacity .3s
      object-fit cover
      border-radius 5px
      // &:hover
      //   transform scale(1.4)
  .count
    position absolute
    display inline-block
    top 15px
    right 15px
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
  .setu-filter
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    width 40px
    height 40px
    margin auto
    z-index 999
</style>
