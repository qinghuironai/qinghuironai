<template>
  <div class="find">
    <div class="container">
      <a
        v-for="item in list"
        :key="item.id"
        v-ripple
        :href="item.value"
        class="items"
      >
        <img :src="item.img" alt="">
        <span>{{ item.text }}</span>
      </a>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Find',
  data() {
    return {
      list: [
        { id: 1, text: 'spotlight', value: '/spotlight', img: require('../../assets/images/spotlight.svg') },
        { id: 2, text: '论坛', value: 'https://discuss.pixivic.com/', img: require('../../assets/images/论坛.svg') }
      ]
    };
  }
};
</script>

<style scoped lang="stylus">
.find
  width 100vw
  height 100vh
  position relative
  z-index 2
  padding 20px
  background url('../../assets/images/bg.jpg') no-repeat
  background-size cover
  .container
    width 100%
    height 100%
    padding 5px
    box-sizing border-box
    display flex
    flex-wrap wrap
    .items
      width 33.3%
      height 100px
      display flex
      flex-direction column
      align-items center
      img
        width 80px
        height 80px
      span
        text-align center
        color #fff
        display inline-block
        margin-top -10px
</style>
