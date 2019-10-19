<template>
  <div class="confirm" v-show="isShow">
    <div class="confirm__container animated bounceIn">
      <div class="confirm__container--title">{{title}}</div>
      <div class="confirm__container--content">
        <p>{{content}}</p>
      </div>
      <div class="confirm__container--footer">
        <div class="left btn" @click="cancel" v-show="showCancelBtn">{{cancelText}}</div>
        <div class="right btn" @click="confirm" v-show="showCofirmBtn">{{confirmText}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    content: {
      type: String,
      default: '确认要退出吗？'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    showCofirmBtn: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isShow: false,
      resolve: '',
      reject: '',
      promise: ''
    }
  },
  methods: {
    cancel () {
      this.isShow = false
      this.reject('cancel')
      this.remove()
    },
    confirm () {
      this.isShow = false
      this.resolve('confirm')
      this.remove()
    },
    remove () {
      setTimeout(() => {
        this.destroy()
      }, 300)
    },
    destroy () {
      this.$destroy()
      document.body.removeChild(this.$el)
    },
    showConfirm () {
      this.isShow = true
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
      return this.promise
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
