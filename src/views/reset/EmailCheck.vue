<template>
  <div class="email-check">
    <div class="btn">
      <v-btn large color="primary" @click="checkEmail">点击完成验证</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    checkEmail() {
      const query = this.$route.query;
      delete query.VNK;
      this.$api.user.setEmail(query)
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.email-check
  width 100vw
  height 100vh
  position relative
  z-index 102
  background-color #fff
  padding 50px
  box-sizing border-box
  display flex
  justify-content center
  align-items center
  background url('../../assets/images/bg.png') no-repeat
  background-size cover
</style>
