<template>
  <div class="i-input">
    <input
      :class="{'padding-right': type === 'password'}"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :type="inputType"
      :value="currentValue"
      ref="input"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <div :class="['i-input__line']"></div>
    <div :class="['i-input__focusline', {'i-input__isfocus': showFocus}]"></div>
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
      showPassword: false,
      showFocus: false // 是否获取焦点
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
    // labelFloat (val) {
    //   console.log(val)
    // }
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
      this.showFocus = false
      this.dispatch('iFormItem', 'on-form-blur', this.currentValue)
    },
    handleFocus () {
      this.showFocus = true
      this.dispatch('iFormItem', 'on-form-focus', this.currentValue)
    }
  },
  mounted () {
    this.$on('on-label-click', (val) => {
      if (val) {
        // 点击 label 升起时要获得焦点
        this.$refs.input.focus()
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
  .i-input
    width 100%
    position relative
    &__line
      position absolute
      left 10%
      right 10%
      background rgba(0, 0, 0, .12)
      height 1px
    &__focusline
      position absolute
      left 10%
      right 10%
      background #2196f3
      height 2px
      transform scaleX(0)
      transition transform .45s cubic-bezier(.23, 1, .32, 1)
    &__isfocus
      transform scaleX(1)
    input
      box-sizing border-box
      padding 0.2rem 0
      width 80%
      outline none
      border none
      box-shadow none
      position relative
      // border-bottom  1px solid rgba(0, 0, 0, .12)
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
