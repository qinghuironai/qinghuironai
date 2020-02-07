<template>
  <div class="login">
    <v-btn color="primary" absolute top right @click="$router.push('/register')">注册</v-btn>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="username"
              :rules="nameRules"
              label="用户名或邮箱"
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="passwordRules"
              name="input-10-1"
              label="密码"
              @click:append="show = !show"
            />
          </v-col>
          <v-col cols="12" md="4" class="code">
            <v-text-field
              v-model="value"
              label="验证码"
              maxlength="4"
              :rules="codeRules"
            />
            <img :src="`data:image/bmp;base64,${imageBase64}`" @click.stop="getCode">
          </v-col>
          <v-col cols="12" md="4">
            <v-btn
              color="primary"
              width="100%"
              @click="login"
            >
              立即登录
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      username: '',
      password: '',
      show: false,
      imageBase64: '',
      vid: '',
      value: '',
      loading: false,
      nameRules: [
        v => !!v || '请填写用户名',
        v => v.length >= 4 || '用户名或邮箱4位以上'
      ],
      passwordRules: [
        v => !!v || '请填写密码'
      ],
      codeRules: [
        v => !!v || '请填写验证码'
      ]
    };
  },
  mounted() {
    this.getCode();
  },
  methods: {
    getCode() {
      this.$api.user.verificationCode()
        .then(res => {
          const { data: { data }} = res;
          this.imageBase64 = data.imageBase64;
          this.vid = data.vid;
        });
    },
    login() {
      if (this.valid) {
        this.loading = true;
        const data = {
          userInfo: {
            username: this.username,
            password: this.password
          },
          vid: this.vid,
          value: this.value
        };
        this.$api.user.login(data)
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('user', JSON.stringify(res.data.data));
              this.$store.dispatch('setUser', res.data.data);
              this.$router.push('/me');
            } else {
              alert(res.data.message);
            }
          })
          .catch(err => {
            console.error(err);
          })
          .finally(() => {
            this.loading = false;
            this.getCode();
          });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.login
  position relative
  width 100vw
  min-height 100vh
  overflow hidden
  padding 50px
  background-color #eee
  background url('../../assets/images/bg.jpg') no-repeat
  background-size cover
  z-index 101
  .code
    position relative
    img
      position absolute
      top 20px
      right 10px
      width 60px
      height 30px
</style>
