<template>
  <div class="password">
    <input
      :type="isShow ? 'text' : 'password'"
      :placeholder="placeholder"
      :value="value"
      :class="[{ 'bounceIn': incorrect }, { 'password__error': incorrect }, 'animated']"
      @input="$emit('input', $event.target.value)"/>
    <img v-show="isShow && value" @click="isShow = false" src="@/assets/images/showpwd.svg" alt="">
    <img v-show="!isShow && value" @click="isShow = true" src="@/assets/images/hidepwd.svg" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShow: false
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '密码'
    },
    value: {
      type: String
    },
    incorrect: {
      type: Boolean,
      default: false
    }
  },
  methods: {}
}

</script>
<style lang='stylus' scoped>
.password
  position relative
  input
    box-sizing border-box
    background-color #ECF0F1
    border 0.2rem solid transparent
    padding 0.2rem 0
    padding-right 1rem
    width 82%
    transition border .5s
    z-index 100
    &:focus
      border 0.2rem solid #3498DB
      box-shadow none
  &__error
    border 0.2rem solid red !important
    transition border .5s !important
    &:focus
       border 0.2rem solid red !important
  img
    width 1rem
    height 1rem
    position absolute
    top 0.4rem
    right 1.6rem
    color #c0c4cc
    transition all 0.3s
    z-index 999
</style>
