<template>
  <input
    class="text-input"
    v-model="value"
    :placeholder="placeholder"
    @blur="blur"
    @keyup.enter="enter"/>
</template>

<script>
// import debounce from 'lodash/debounce'

export default {
  name: 'TextInput',
  props: {
    preset: {
      default: '',
      type: String
    },
    placeholder: {
      default: `(●'◡'●)ﾉ關鍵字の輸入`,
      type: String
    }
  },
  data () {
    return {
      typing: false,
      value: ''
    }
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.typing = true
          this.getKeyword()
          this.$emit('change', val)
        }
      }
    },
    preset: {
      handler (val) {
        if (val) {
          this.value = this.preset
        }
      },
      immediate: true
    }
  },
  methods: {
    getKeyword () {
      if (!this.typing) return
      this.$api.search
        .getKeyword(this.value).then(({ data: { data } }) => {
          console.log(data)
        })
    },
    blur () {
      this.typing = false
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
