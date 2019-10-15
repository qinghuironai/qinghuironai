<template>
  <div class="reset-password">
    <div class="reset">
      <h1 class="reset__title">重置密码</h1>
      <i-form :model="form" :rules="ruleValidate" ref="form" class="reset__form">
        <i-form-item prop="password">
          <i-input v-model="form.password" type="password" placeholder="新密码"></i-input>
        </i-form-item>
        <i-form-item prop="confirmPassword">
          <i-input v-model="form.confirmPassword" type="password" placeholder="确认新密码"></i-input>
        </i-form-item>
      </i-form>
      <div @click="reset" class="reset__btn">确认重置</div>
    </div>
  </div>
</template>

<script>
import iForm from '../components/form/form'
import iFormItem from '../components/form/form-item'
import iInput from '../components/form/input'
export default {
  data () {
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
        password: '',
        confirmPassword: ''
      },
      ruleValidate: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 15, message: '密码必须在8-15位之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: checkConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },

  components: {
    iForm, iFormItem, iInput
  },

  methods: {
    reset () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const data = {
            password: this.form.password,
            vid: this.$route.query.vid,
            value: this.$route.query.value
          }
          const res = await this.$api.user.resetPassword(data)
          if (res.status === 200) {
            this.$aMsg.success(res.data.message)
            this.$router.push({ path: '/' })
          } else {
            this.$aMsg.error(res.data.message)
          }
        } else {
          this.$aMsg.error('请正确填写密码')
        }
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.reset-password
  width 100vw
  height 100vh
  background-image url('../assets/images/background/bg1.jpg')
  background-size cover
  background-repeat no-repeat
  display flex
  justify-content center
  align-items center
  .reset
    box-sizing border-box
    text-align center
    padding 1rem
    box-shadow 0 1rem 2rem rgba(0, 0, 0, .3)
    border-radius 1rem
    background-color #fff
    width 80%
    &__title
      color #777
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
</style>
