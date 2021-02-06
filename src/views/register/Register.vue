<template>
  <div class="register">
    <v-btn
      color="primary"
      absolute
      top
      right
      @click="goLogin"
    >
      登录
    </v-btn>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="username"
              :error-messages="nameErrors"
              label="用户名"
              required
              @blur="$v.username.$touch()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              :error-messages="emailErrors"
              label="邮箱"
              required
              @blur="$v.email.$touch()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              name="input-10-1"
              label="密码"
              :error-messages="passwordErrors"
              @click:append="show = !show"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="confirmPassword"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              name="input-10-1"
              label="确认密码"
              :error-messages="confirmPasswordErrors"
              @click:append="show2 = !show2"
              @input="$v.confirmPassword.$touch()"
              @blur="$v.confirmPassword.$touch()"
            />
          </v-col>
          <v-col cols="12" class="code">
            <v-text-field
              v-model="code"
              label="注册邀请码"
              maxlength="16"
              :error-messages="codeErrors"
              @input="$v.code.$touch()"
              @blur="$v.code.$touch()"
            />
            <v-btn class="btn" color="primary" small href="https://mall.pixivic.net/product/9.html" target="_blank">获取</v-btn>
          </v-col>
          <v-col cols="12" class="code">
            <v-text-field
              v-model="pvalue"
              label="短信验证码(需上面邀请码)"
              maxlength="6"
              :error-messages="pvalueErrors"
              @input="$v.pvalue.$touch()"
              @blur="$v.pvalue.$touch()"
            />
            <!-- <img :src="`data:image/bmp;base64,${imageBase64}`" @click.stop="getCode"> -->
            <v-btn class="btn" color="primary" small :disabled="$v.code.$invalid" @click.stop="dialog = true">获取</v-btn>
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              width="100%"
              @click="register"
            >
              立即注册
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          获取短信验证码
        </v-card-title>
        <v-card-text class="text-center">
          <img :src="`data:image/bmp;base64,${imageBase64}`" width="60" height="30" @click.stop="getCode">
        </v-card-text>
        <v-card-text class="text-center">
          <v-text-field
            v-model="value"
            label="验证码（点击图像可改）"
            maxlength="4"
            :error-messages="valueErrors"
            @input="$v.value.$touch()"
            @blur="$v.value.$touch()"
          />
          <v-text-field
            v-model="phone"
            label="手机号"
            maxlength="11"
            :error-messages="phoneErrors"
            @blur="$v.phone.$touch()"
          />
          <v-btn depressed color="success" :disabled="disabled" @click="getPhoneCode">获取验证码</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, maxLength, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { debounceAsyncValidator } from '@/util';
import Toast from '@/components/toast';
import Confirm from '@/components/confirm';

export default {
  name: 'Register',
  mixins: [validationMixin],
  validations: {
    email: {
      required,
      email,
      isUnique: debounceAsyncValidator(function(value, debounce) {
        if (!value) return true;
        if (!this.$v.email.required || !this.$v.email.email) return true;
        return debounce()
          .then(() => this.$api.user.checkEmail(value))
          .then(res => {
            return Boolean(res.status === 200);
          });
      }, 500)
    },
    username: {
      required,
      maxLength: maxLength(10),
      minLength: minLength(4),
      isValid(value) {
        const patrn = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
        return !patrn.test(value);
      },
      isUnique: debounceAsyncValidator(function(value, debounce) {
        if (!value) return true;
        if (!this.$v.username.required || !this.$v.username.minLength || !this.$v.username.maxLength || !this.$v.username.isValid) return true;
        return debounce()
          .then(() => this.$api.user.checkUser(value))
          .then(res => {
            return Boolean(res.status === 200);
          });
      }, 500)
    },
    password: {
      required,
      minLength: minLength(8),
      maxLength: maxLength(20)
    },
    confirmPassword: {
      sameAsPassword: sameAs('password')
    },
    value: {
      required,
      minLength: minLength(4)
    },
    pvalue: {
      required,
      minLength: minLength(6)
    },
    phone: {
      required,
      isValid(value) {
        const patrn = /^[1]([3-9])[0-9]{9}$/;
        return patrn.test(value);
      },
      isUnique: debounceAsyncValidator(function(value, debounce) {
        if (!value) return true;
        if (!this.$v.phone.required || !this.$v.phone.isValid) return true;
        return debounce()
          .then(() => this.$api.user.checkPhone(value))
          .then(res => {
            return Boolean(res.status === 200);
          });
      }, 500)
    },
    code: {
      required,
      minLength: minLength(16)
    }
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      show: false,
      show2: false,
      imageBase64: '',
      vid: '',
      value: '',
      loading: false,
      dialog: false,
      phone: '',
      pvalue: '',
      code: ''
    };
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push('请输入邮箱');
      !this.$v.email.email && errors.push('请输入合法的邮箱');
      !this.$v.email.isUnique && errors.push('邮箱已被注册');
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.required && errors.push('请输入用户名');
      !this.$v.username.isValid && errors.push('用户名不能包含特殊字符');
      (!this.$v.username.minLength || !this.$v.username.maxLength) && errors.push('用户名4-10位');
      !this.$v.username.isUnique && errors.push('用户名已被注册');
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push('请输入密码');
      (!this.$v.password.minLength || !this.$v.password.maxLength) && errors.push('密码8-20位');
      return errors;
    },
    confirmPasswordErrors() {
      const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAsPassword && errors.push('密码不一致');
      return errors;
    },
    valueErrors() {
      const errors = [];
      if (!this.$v.value.$dirty) return errors;
      !this.$v.value.required && errors.push('请输入验证码');
      !this.$v.value.minLength && errors.push('请输入4位验证码');
      return errors;
    },
    pvalueErrors() {
      const errors = [];
      if (!this.$v.pvalue.$dirty) return errors;
      !this.$v.pvalue.required && errors.push('请输入验证码');
      !this.$v.pvalue.minLength && errors.push('请输入6位验证码');
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.required && errors.push('请输入手机号');
      !this.$v.phone.isValid && errors.push('请输入合法手机号');
      !this.$v.phone.isUnique && errors.push('该手机号已被绑定');
      return errors;
    },
    codeErrors() {
      const errors = [];
      if (!this.$v.code.$dirty) return errors;
      !this.$v.code.required && errors.push('请输入邀请码');
      !this.$v.code.minLength && errors.push('请输入16位邀请码');
      return errors;
    },
    disabled() {
      return this.$v.value.$invalid || this.$v.phone.$invalid;
    }
  },
  mounted() {
    this.getCode();
  },
  methods: {
    goLogin() {
      this.$router.push({
        name: 'Login',
        query: {
          return_to: this.$route.query.return_to
        }
      });
    },
    getCode() {
      this.$api.user.verificationCode()
        .then(res => {
          const { data: { data }} = res;
          this.imageBase64 = data.imageBase64;
          this.vid = data.vid;
        });
    },
    async register() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const res = await Confirm({
          title: '请仔细确认信息，一个邀请码只能使用一次，信息错误也会消耗邀请码，确认无误后按确定完成注册'
        });
        if (res === 'submit') {
          this.loading = true;
          const data = {
            userInfo: {
              username: this.username.trim(),
              email: this.email,
              password: this.password,
              exchangeCode: this.code
            },
            vid: this.phone,
            value: this.pvalue
          };
          const res = await this.$api.user.register(data);
          if (res.status === 200) {
            this.$store.dispatch('setUser', res.data.data);
            const url = this.$route.query.return_to;
            window.location.href = url || `${process.env.VUE_APP_HOME_URL}/me`;
          } else {
            Toast({ content: res.data.message });
            this.loading = false;
            this.getCode();
          }
        }
      }
    },
    getPhoneCode() {
      this.$api.user.getPhoneCode({
        vid: this.vid,
        value: this.value,
        phone: this.phone
      })
        .then(res => {
          if (res.status === 200) {
            this.dialog = false;
          }
          Toast({ content: res.data.message });
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.register
  position relative
  width 100vw
  min-height 100vh
  overflow hidden
  padding 50px
  background-color #eee
  //background url('~@/assets/images/bg.jpg') no-repeat
  background-size cover
  z-index 101
  box-sizing border-box
  .code
    position relative
    .btn
      position absolute
      top 20px
      right 10px
</style>
