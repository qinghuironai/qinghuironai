<template>
  <div class="confirm" v-show="show">
    <div class="confirm__container animated fadeIn">
      <div class="confirm__container--title">{{title}}</div>
      <div class="confirm__container--content">
        <slot></slot>
      </div>
      <div class="confirm__container--footer">
        <div class="left btn" @click="close">{{cancelText}}</div>
        <div class="right btn" @click="confirm">{{confirmText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '标题'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    confirm () {
      this.$emit('update:show', false)
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .confirm
    width 100%
    height 100%
    position fixed
    background rgba(0, 0, 0, .5)
    top 0
    left 0
    z-index 103
    display flex
    align-items center
    justify-content center
    &__container
      width 80vw
      background #fff
      overflow hidden
      border-radius 0.25rem
      z-index 102
      &--title
        padding-top 1.5rem
        font-weight 500
        font-size 1rem
        line-height 1.5rem
        text-align center
      &--content
        padding 0.5rem
        display flex
        justify-content center
        align-items center
        text-align center
        font-size 0.8rem
        min-height 2.5rem
        color #333
      &--footer
        display flex
        border-top 1px solid #eee
        .btn
          width 100%
          height 2.6rem
          line-height 2.6rem
          text-align center
          color #323233
          font-size 1rem
          box-sizing border-box
        .left
          border-right 1px solid #eee
        .right
          color #1989fa
</style>
