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
        <svg font-size="40" class="icon" aria-hidden="true">
          <use :xlink:href="item.icon" />
        </svg>
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
        { id: 1, text: 'spotlight', value: '/spotlight', icon: '#picxiangce' },
        { id: 2, text: '论坛', value: 'https://discuss.pixivic.com/', icon: '#picluntan1' },
        { id: 3, text: '关于我们', value: '/links', icon: '#picyonghuxuzhi-' }
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
      width 25%
      height 100px
      display flex
      flex-direction column
      align-items center
      justify-content center
      span
        text-align center
        color #000
        display inline-block
        margin-top 2px
</style>
