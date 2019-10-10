<template>
  <div :class="['text-input__wrapper', { typing }]">
    <img src="../assets/images/cat.png" alt="cat">
    <input
      class="text-input"
      v-model="value"
      :placeholder="placeholder"
      @input="change"
      @keyup.enter="enter"/>
    <img src="../assets/images/camera.svg" alt="camera">
    <img src="../assets/images/search.svg" @click="enter" alt="search">
    <div class="text-input__keyword" v-if="typing">
      <router-link
        class="text-input__keyword--item"
        v-for="(item, index) in keywords"
        :key="index"
        :to="{ name: 'PopSearch', query: { keyword: item } }"
      >
        <p>{{ item }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

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
      keywords: [],
      value: ''
    }
  },
  watch: {
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
    change () {
      if (this.value) {
        this.typing = true
        this.getKeyword()
      }
    },
    getKeyword: debounce(function () {
      if (!this.typing) return
      this.$api.search
        .getKeyword(this.value).then(({ data: { data } }) => {
          this.keywords = data.keywordList
        })
    }, 500),
    blur () {
      this.typing = false
      this.$emit('blur', this.value)
    },
    enter () {
      this.typing = false
      this.$emit('enter', this.value)
    },
    redirect (val) {
      this.$router.push({ name: 'PopSearch', query: { keyword: val } })
        .catch(e => {
          this.value = val
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .text-input
    padding .8rem
    border 0 none
    border-radius 1rem
    width 100%
    background $white
    font-size 1.4rem
    -webkit-appearance none
    border none
    outline none
    padding-right 6rem
    box-sizing border-box
    &__wrapper
      position relative
      box-sizing border-box
      left 0
      right 0
      margin .8rem
      img
        position absolute
        &:first-child
          width 8rem
          top -6.5rem
          left .7rem
        &:nth-of-type(2), &:nth-of-type(3)
          width 2rem
          height 2rem
          top 0.5rem
        &:nth-of-type(2)
          right 3rem
        &:nth-of-type(3)
          right 0.8rem
    img:first-child
      margin-right 2rem
    &__keyword
      color black
      border-radius .25rem
      background white
      overflow hidden
      &--mask
        position absolute
        top -20px
        left 0
        padding 100px .8rem
        height 100vh
        z-index 1
      &--item
        display inline-block
        box-sizing border-box
        width 100%
        font-size 20px
        padding 0.8rem
        color white
        background #33a3dc4d
        + .text-input__keyword--item
          border-top 1px solid white
</style>
