<template>
  <div
    :class="['like', {'is-like': like}]"
    @click.stop="handleLike"
  />
</template>

<script>
export default {
  name: 'Like',
  props: {
    like: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleLike() {
      this.$emit('handleLike');
    }
  }
};
</script>
<style lang="stylus" scoped>
@keyframes heart
  0%
    background-position left
  100%
    background-position right
.like
  position absolute
  bottom 5px
  right -10px
  width 80px
  height 40px
  background url('../../assets/images/like.png') no-repeat
  background-position left
  background-size 2900%
  &.is-like
    background-position right
    animation heart .8s steps(28)
</style>
