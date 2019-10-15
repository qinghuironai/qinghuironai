<template>
  <div class="login">
    <h1 class="login__title">Login</h1>
    <img src="@/assets/images/QQ.svg" alt="">
    <i-form :model="form" ref="form" class="login__form">
      <i-form-item prop="username">
        <i-input v-model="form.username" placeholder="邮箱/用户名"></i-input>
      </i-form-item>
      <i-form-item prop="password">
        <i-input v-model="form.password" type="password" placeholder="用户密码"></i-input>
      </i-form-item>
      <i-form-item prop="value" class="login__form--code">
        <i-input v-model="form.value" maxlength="4" placeholder="右侧验证码"></i-input>
        <img
          class="login__group--code"
          :src="codeImg"
          @click.stop="getCode"
        />
      </i-form-item>
      <i-form-item class="login__form--btn">
        <div @click="login">登录</div>
      </i-form-item>
    </i-form>
    <a @click.prevent="lostPwd" class="login__link">忘记你的密码?</a>
    <a @click.prevent="signUp" class="login__link">还没账号？立即去注册</a>
  </div>
</template>

<script>
import cookie from 'js-cookie'
import iForm from '../components/form/form'
import iFormItem from '../components/form/form-item'
import iInput from '../components/form/input'
export default {
  data () {
    return {
      form: {
        username: '',
        password: '',
        value: ''
      },
      vid: '',
      codeImg: ''
    }
  },
  components: {
    iForm, iFormItem, iInput
  },
  methods: {
    signUp () {
      this.$emit('signUp', 'register')
    },
    async login () {
      if (!this.form.username || !this.form.password || !this.form.value) {
        return this.$aMsg.error('请将信息填写完整哦 QAQ')
      }
      const params = {
        vid: this.vid,
        value: this.form.value
      }
      const data = {
        username: this.form.username,
        password: this.form.password
      }
      const res = await this.$api.user.login(data, params)
      if (res.status === 200) {
        cookie.set('jwt', res.config.headers.Authorization)
        localStorage.setItem('user', JSON.stringify(res.data.data))
        this.$store.dispatch('setUser', res.data.data)
        this.$aMsg.success(res.data.message)
        this.$emit('closeLogin')
      } else {
        this.$aMsg.error(res.data.message)
        this.getCode()
      }
    },
    lostPwd () {
      this.$emit('lostPwd', 'find')
    },
    async getCode () {
      const res = await this.$api.user.verificationCode()
      if (res.status === 200) {
        this.codeImg = 'data:image/png;base64,' + res.data.data.imageBase64
        this.vid = res.data.data.vid
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
    width 3rem
    height 1.6rem
    margin 0 auto
  &__form
    &--code
      position relative
      >>> input
        padding-right 2rem
      img
        width 2.2rem
        height 1.6rem
        position absolute
        top -0.5rem
        right 10%
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
