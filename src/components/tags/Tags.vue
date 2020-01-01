<template>
  <cube-scroll v-if="data.length"
               :data="data"
               class="horizontal-scroll"
               direction="horizontal"
               :options="options">
    <div class="tags">
      <div class="tags-item"
           v-for="(item, index) in data"
           :key="index"
           @click.prevent="handleClick(item)"
           :style="{'justifyContent': item.keywordTranslated ? 'space-between' : 'center'}">
        <p>{{item.keyword || item.name}}</p>
        <span>{{item.keywordTranslated || item.translatedName}}</span>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    options () {
      return {
        click: false,
        eventPassthrough: 'vertical'
      }
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('handleClick', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.horizontal-scroll
  .cube-scroll-content
    display inline-block
  .tags
    padding 0 10px
    height 42px
    white-space nowrap
    display flex
    flex-wrap nowrap
    margin-bottom 8px
    .tags-item
      display flex
      flex-direction column
      justify-content space-between
      font-family Arial
      padding 5px 7px 5px 7px
      width auto
      height 32px
      border-radius 3px
      margin-right 7px
      text-align center
      color white
      background-color #B9EEE5
      p
        font-size 16px
      span
        font-size 10px
</style>
