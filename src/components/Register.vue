<template>
  <div class="register">
    <h1 class="register__title">Register</h1>
    <!-- <div
      class="register__group--message"
      v-if="!$v.form.email.isRegister"
      style="color: red; margin-bottom: 0.2rem;">已被注册
    </div> -->
    <div :class="[{ 'register__error': $v.form.email.$error }, 'register__group']">
      <input type="text"
        @blur="$v.form.email.$touch()"
        v-model="form.email"
        :class="[{ 'bounceIn': !$v.form.email.required || !$v.form.email.email || !$v.form.email.isRegister  }, 'register__group--name', 'animated']"
        placeholder="邮箱" />
      <!-- <div class="register__group--message" v-if="!$v.form.email.required">邮箱不能为空</div>
      <div class="register__group--message" v-if="!$v.form.email.email">请填写正确的邮箱格式</div>
      <div class="register__group--message" v-if="!$v.form.email.isRegister">已被注册</div>  -->
    </div>
    <div :class="[{ 'register__error': $v.form.user.$error }, 'register__group']">
      <input
        type="text"
        @input="$v.form.user.$touch()"
        v-model="form.user"
        :class="[{ 'bounceIn': !$v.form.user.required }, 'register__group--name', 'animated']"
        placeholder="用户名" />
      <!-- <span class="register__group--message" v-if="!$v.form.email.required">用户名不能为空</span> -->
    </div>
    <div class="register__group">
      <PwdInput v-model="form.password"/>
    </div>
    <div class="register__group">
      <!-- <PwdInput
        v-model="form.confirmPassword"
        :placeholder="'密码确认'"
        @blur.native="$v.form.confirmPassword.$touch()"
        :class="[{ 'bounceIn': !$v.form.confirmPassword.sameAsPassword }, 'register__group--name', 'animated']"/> -->
      <PwdInput
        v-model="form.confirmPassword"
        :placeholder="'密码确认'"
        :incorrect="!$v.form.confirmPassword.sameAsPassword"/>
    </div>
    <!-- <div class="register__group">
      <input type="text" v-model="form.code" class="register__group--name" placeholder="验证码" />
      <span class="register__group--code" @click="getCode" v-if="!this.isSend">获取邮箱验证码</span>
      <span class="register__group--code" v-else>{{ this.time }}s后再次获取</span>
    </div> -->
    <div class="register__group">
      <input
        type="text"
        v-model="form.code"
        class="register__group--name"
        placeholder="验证码"
        maxlength="4"
      />
      <img
        class="register__group--code"
        :src="codeImg"
        @click.stop="getCode"
      />
    </div>
    <div class="register__group">
      <div @click="register" class="register__group--btn">注册</div>
    </div>
    <a @click.prevent="signIn" class="register__link">已有账号？去登录</a>
  </div>
</template>

<script>
import PwdInput from './PwdInput'
import { required, email, sameAs } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      form: {
        email: '',
        user: '',
        password: '',
        confirmPassword: '',
        code: ''
      },
      time: 60,
      isSend: false,
      codeImg: '',
      vid: ''
    }
  },

  validations: {
    form: {
      email: {
        // 先验证存在 再合理 最后是否被注册
        required,
        email,
        async isRegister (value) {
          if (value === '') return true
          console.log('value', value)
          const res = await this.$api.user.checkEmail(value)
          console.log(res)
          if (res.status === 404) return true
          if (res.status === 409) return false
        }
      },
      user: { required },
      password: { required },
      confirmPassword: { sameAsPassword: sameAs('password') },
      code: { required }
    }
  },

  components: {
    PwdInput
  },

  methods: {
    signIn () {
      this.$emit('signIn', 'login')
    },
    async register () {
      const userInfo = {
        username: this.form.user,
        email: this.form.email,
        password: this.form.password
      }
      const params = {
        vid: this.vid,
        value: this.form.code
      }
      const res = await this.$api.user.register(userInfo, params)
      if (res.status === 200) {
        this.$aMsg.success('在邮箱验证后 完成注册')
        // this.$aMsg.success(res.data.message)
        this.$emit('signIn', 'login')
      } else {
        this.$aMsg.error(res.data.message)
        this.getCode()
      }
    },
    async getCode () {
      // this.isSend = true
      // let timer = setInterval(() => {
      //   if ((this.time--) <= 0) {
      //     this.time = 60
      //     this.isSend = false
      //     clearInterval(timer)
      //   }
      // }, 1000)
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
.register
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
    margin-bottom 1rem
    &--name
      background-color #ECF0F1
      border 0.2rem solid transparent
      padding 0.2rem 0
      width 80%
      transition border .5s
      &:focus
        border 0.2rem solid #3498DB
        box-shadow none
    img
      width 3rem
      position absolute
      top 0.5rem
      right 1.4rem
    // &--code
    //   position absolute
    //   top 0.6rem
    //   right 1.4rem
    //   color #073f84
    //   font-size 0.8rem
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
  &__error
    input
      border 0.2rem solid red
      transition border .5s
      &:focus
        border 0.2rem solid red
  //   &--message
  //     display none
  //     color #cc3333
  //     text-align center
  //     padding-top 0.1rem
  //     font-size 0.6rem
  // &__error
  //   & > input + .register__group--message
  //     display block
  //     color #CC3333
  //     text-align center
  //     padding-top 0.1rem
  //     font-size 0.6rem
  &__link
    font-size 12px
    color #444
    display block
    margin-top 1rem
</style>
