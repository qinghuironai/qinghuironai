<template>
  <div class="find">
    <h1 class="find__title">Reset</h1>
    <i-input v-model="form.email" placeholder="邮箱"></i-input>
    <div class="find__group">
      <div @click="find" class="find__group--btn">发送到邮箱</div>
    </div>
    <!-- <a @click.prevent="signUp" class="find__link">立即去登录</a> -->
  </div>
</template>

<script>
import iInput from '../components/form/input'
export default {
  data () {
    return {
      form: {
        email: ''
      }
    }
  },
  components: {
    iInput
  },
  methods: {
    async find () {
      if (!this.form.email) {
        return this.$aMsg.error('请输入邮箱')
      }
      const res = await this.$api.user.resetPasswordEmail(this.form.email)
      this.$aMsg.success(res.data.message)
    }
  }
}
</script>
<style lang='stylus' scoped>
.find
  box-sizing border-box
  text-align center
  padding 1rem
  box-shadow 0 1rem 2rem rgba(0, 0, 0, .3)
  border-radius 1rem
  background-color #fff
  &__title
    color #777
  &__group
    position relative
    margin-top 2rem
    &--btn
      border 0.2rem solid transparent
      background #3498DB
      color #ffffff
      line-height 1rem
      padding 0.3rem 0
      width 80%
      border-radius 0.2rem
      box-shadow none
      transition 0.25s
      margin 0 auto
  &__link
    font-size 12px
    color #444
    display block
    margin-top 1rem
</style>
