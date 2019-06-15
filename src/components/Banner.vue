<template>
  <div class="banner">
    <img class="background" alt="芝麻凛" src="@/assets/images/bg.jpg" referrerpolicy="no-referrer">
    <p>
        Pixiv Illustration Collection
    </p>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
  .banner
    z-index: -2
    img
      width: 100%
      border-bottom-right-radius: 70% 30%
      border-bottom-left-radius:70% 30%
      margin: -20% 0 0 0
    p
      text-align: center
      position: absolute
      font-size: 1.9rem
      top: 1rem
      left: 0
      right: 0
      color: $primary
</style>
