<template>
  <div class="login">
    <h1 class="login__title">Login</h1>
    <img src="@/assets/images/QQ.svg" alt="">
    <div class="login__group">
      <input
        type="text"
        v-model="form.username"
        class="login__group--name"
        placeholder="邮箱/用户名"
      />
    </div>
    <div class="login__group">
      <PwdInput v-model="form.password"/>
    </div>
    <div class="login__group">
      <input
        type="text"
        v-model="form.vid"
        class="login__group--name"
        placeholder="验证码"
        maxlength="4"
      />
      <img
        class="login__group--code"
        :src="codeImg"
        @click.stop="getCode"
      />
    </div>
    <div class="login__group">
      <div @click="login" class="login__group--btn">登录</div>
    </div>
    <a @click.prevent="lostPwd" class="login__link">忘记你的密码?</a>
    <a @click.prevent="signUp" class="login__link">还没账号？立即去注册</a>
  </div>
</template>

<script>
import PwdInput from './PwdInput'
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        vid: ''
      },
      codeImg: ''
    }
  },
  components: {
    PwdInput
  },
  methods: {
    signUp () {
      this.$emit('signUp', 'register')
    },
    async login () {
      if (!this.form.username || !this.form.password || !this.form.vid) {
        return this.$aMsg.error('请将信息填写完整哦 QAQ')
      }
      const res = await this.$api.user.login(this.form)
      console.log(res)
      if (res.status === 200) {

      }
    },
    lostPwd () {
      this.$emit('lostPwd', 'find')
    },
    async getCode () {
      const res = await this.$api.user.verificationCode()
      if (res.status === 200) {
        this.codeImg = res.data.data.imageBase64
      }
    }
  },
  mounted () {
    this.getCode()
  }
}
</script>
<style lang='stylus' scoped>
.login
  box-sizing border-box
  text-align center
  padding 1rem
  box-shadow 0 1rem 2rem rgba(0, 0, 0, .3)
  border-radius 1rem
  background-color #fff
  &__title
    color #777
  img
    width 1.6rem
    height 1.6rem
    margin 0 auto
  &__group
    margin-bottom 2rem
    position relative
    &--name
      background-color #ECF0F1
      border 0.2rem solid transparent
      padding 0.2rem 0
      width 80%
      transition border .5s
      &:focus
        border 0.2rem solid #3498DB
        box-shadow none
    &--code
      width 100%
      position absolute
      top 0.2rem
      right 2rem
      color #073f84
      font-size 0.8rem
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
