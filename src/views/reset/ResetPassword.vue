<template>
  <div class="reset-password">
    <v-form v-model="valid">
      <v-container>
        <v-row class="row">
          <v-col cols="12">
            <v-text-field
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              :rules="passwordRules"
              name="input-10-1"
              label="新密码"
              @click:append="show = !show"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="confirmPassword"
              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show2 ? 'text' : 'password'"
              :rules="confirmPasswordRules"
              name="input-10-1"
              label="确认新密码"
              @click:append="show2 = !show2"
            />
          </v-col>
          <v-col cols="12">
            <v-btn
              color="primary"
              width="100%"
              :disabled="!valid"
              @click="resetPassword"
            >
              完成重置
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vid: '',
      value: '',
      valid: false,
      show: false,
      show2: false,
      password: '',
      confirmPassword: '',
      passwordRules: [
        v => !!v || '请填写新密码',
        v => (v.length >= 8 && v.length <= 20) || '密码在8-20位'
      ],
      confirmPasswordRules: [
        v => v === this.password || '输入密码不一致'
      ]
    };
  },
  mounted() {
    const query = this.$route.query;
    this.vid = query.vid;
    this.value = query.value;
  },
  methods: {
    resetPassword() {
      const data = {
        password: this.password,
        value: this.value,
        vid: this.vid
      };
      this.$api.user
        .resetPassword(data)
        .then(res => {
          if (res.status === 200) {
            alert('重置成功，点击返回登录页面');
            window.location.href = 'https://m.pixivic.com/login';
          } else {
            alert(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.reset-password
  width 100vw
  height 100vh
  position relative
  z-index 102
  background-color #fff
  padding 50px
  box-sizing border-box
</style>
