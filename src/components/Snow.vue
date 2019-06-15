<template>
  <div class="snow"/>
</template>

<script>
import snow from '@/util/snow'

export default {
  name: 'Snow',
  mounted () {
    snow()
  }
}
</script>

<style lang="stylus" scoped>
  .snow
    position: fixed
    width: 100vw
    height: 100vh
    color: $white
    z-index: -1
</style>
