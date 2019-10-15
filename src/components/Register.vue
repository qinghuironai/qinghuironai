<template>
  <div class="register">
    <h1 class="register__title">Register</h1>
    <i-form :model="form" :rules="ruleValidate" ref="form" class="register__form">
      <i-form-item prop="email">
        <i-input v-model="form.email" placeholder="邮箱"></i-input>
      </i-form-item>
      <i-form-item prop="user">
        <i-input v-model="form.user" placeholder="用户名"></i-input>
      </i-form-item>
      <i-form-item prop="password">
        <i-input v-model="form.password" type="password" placeholder="用户密码"></i-input>
      </i-form-item>
      <i-form-item prop="confirmPassword">
        <i-input v-model="form.confirmPassword" type="password" placeholder="确认密码"></i-input>
      </i-form-item>
      <i-form-item prop="code" class="register__form--code">
        <i-input v-model="form.code" maxlength="4" placeholder="右侧验证码"></i-input>
        <img
          class="register__group--code"
          :src="codeImg"
          @click.stop="getCode"
        />
      </i-form-item>
    </i-form>
    <div @click="register" class="register__btn">注册</div>
    <a @click.prevent="signIn" class="register__link">已有账号？去登录</a>
  </div>
</template>

<script>
import iForm from '../components/form/form'
import iFormItem from '../components/form/form-item'
import iInput from '../components/form/input'
export default {
  data () {
    const emailExit = (rule, value, callback) => {
      const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (value === '') {
        return callback(new Error('邮箱不能为空'))
      }
      if (!emailReg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      }
      if (value !== '' && emailReg.test(value)) {
        this.$api.user.checkEmail(value).then(res => {
          if (res.status === 409) {
            callback(new Error('邮箱已被注册'))
          } else if (res.status === 404) {
            callback()
          }
        })
      }
    }
    const userExit = (rule, value, callback) => {
      if (value === '' || value.length < 3) {
        return callback(new Error('用户名必须3位以上'))
      }
      if (value.length >= 3) {
        this.$api.user.checkUser(value).then(res => {
          if (res.status === 409) {
            callback(new Error('用户名已被注册'))
          } else if (res.status === 404) {
            callback()
          }
        })
      }
    }
    const checkConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请再次输入密码'))
      }
      if (value !== this.form.password) {
        return callback(new Error('两次输入的密码不一致'))
      }
      callback()
    }
    return {
      form: {
        email: '',
        user: '',
        password: '',
        confirmPassword: '',
        code: ''
      },
      codeImg: '',
      ruleValidate: {
        email: [
          { required: true, validator: emailExit, trigger: 'blur' }
        ],
        user: [
          { required: true, validator: userExit, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 15, message: '密码必须在8-15位之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码为4位数', trigger: 'blur' }
        ]
      }
    }
  },

  components: {
    iForm, iFormItem, iInput
  },

  methods: {
    signIn () {
      this.$emit('signIn', 'login')
    },
    register () {
      this.$refs.form.validate(async valid => {
        console.log(valid)
        if (valid) {
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
            this.$aMsg.success('请前往邮箱验证 完成注册')
            this.$emit('signIn', 'login')
            this.$refs.form.resetFields()
          } else {
            this.$aMsg.error(res.data.message)
            this.getCode()
          }
        } else {
          this.$aMsg.error('请正确填写信息QAQ')
        }
      })
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
.register
  box-sizing border-box
  text-align center
  padding 1rem
  box-shadow 0 1rem 2rem rgba(0, 0, 0, .3)
  border-radius 1rem
  background-color #fff
  &__title
    color #777
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
  &__btn
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
