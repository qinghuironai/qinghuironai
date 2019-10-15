<template>
  <div class="i-input">
    <input
      :class="{'padding-right': type === 'password'}"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :type="inputType"
      :value="currentValue"
      @input="handleInput"
      @blur="handleBlur"
    />
    <span v-if="type === 'password'">
      <img v-show="showPassword && value" @click="showPassword = false" src="@/assets/images/showpwd.svg" alt="">
      <img v-show="!showPassword && value" @click="showPassword = true" src="@/assets/images/hidepwd.svg" alt="">
    </span>
  </div>
</template>

<script>
import Emitter from '../mixins/emitter'
export default {
  name: 'iInput',
  mixins: [Emitter],
  props: {
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String
    },
    value: {
      type: String,
      default: ''
    },
    maxlength: {
      type: [String, Number]
    }
  },
  data () {
    return {
      currentValue: this.value,
      showPassword: false
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  computed: {
    inputType () {
      if (this.type === 'text') return 'text'
      if (this.type === 'password' && this.showPassword) {
        return 'text'
      } else if (this.type === 'password' && !this.showPassword) {
        return 'password'
      }
      return 'text'
    }
  },
  methods: {
    handleInput (event) {
      const value = event.target.value
      this.currentValue = value
      this.$emit('input', value)
      this.dispatch('iFormItem', 'on-form-change', value)
    },
    handleBlur () {
      this.dispatch('iFormItem', 'on-form-blur', this.currentValue)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .i-input
    width 100%
    position relative
    input
      box-sizing border-box
      background-color #ECF0F1
      border 0.1rem solid transparent
      padding 0.2rem 0
      width 80%
      transition border .5s
      &:focus
        border 0.1rem solid #3498DB
        box-shadow none
    .padding-right
      padding-right 10%
    span
      position absolute
      top 0
      right 10%
      width 1.8rem
      height 100%
      text-align center
      z-index 1
      img
        width 100%
        position absolute
        right 0
</style>
