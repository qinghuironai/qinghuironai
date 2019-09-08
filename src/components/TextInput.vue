<template>
  <input
    class="text-input"
    v-model="value"
    :placeholder="placeholder"
    @blur="blur"
    @keyup.enter="enter"/>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    placeholder: {
      default: `(●'◡'●)ﾉ關鍵字の輸入`,
      type: String
    }
  },
  data () {
    return {
      value: ''
    }
  },
  methods: {
    blur () {
      this.$emit('blur', this.value)
    },
    enter () {
      this.$emit('enter', this.value)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .text-input
    padding: .8rem
    border: 0 none
    left: 0
    right: 0
    margin: 0 auto
    border-radius: .25rem
    width: 16rem
    background: $white
    font-size: 1.4rem
    -webkit-appearance: none
    border none
    outline none
</style>
