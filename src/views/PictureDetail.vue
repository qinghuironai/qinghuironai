<template>
  <div>{{ this.detail }}</div>
</template>

<script>
export default {
  data () {
    return {
      detail: ''
    }
  },
  created () {
    this.detail = JSON.parse(sessionStorage.getItem('detail'))
  }
}
</script>
<style lang='scss' scoped>
</style>
