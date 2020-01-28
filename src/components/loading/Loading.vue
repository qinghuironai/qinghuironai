<template>
  <div class="loading-mask">
    <div class="loading-spinner">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="25 25 50 50"
        class="circular"
      >
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="none"
          class="path"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="stylus" scope>
@keyframes loading-rotate
  100%
    transform rotate(1turn)
@keyframes loading-dash
  0%
    stroke-dasharray 1, 200
    stroke-dashoffset 0
  50%
    stroke-dasharray 90, 150
    stroke-dashoffset -40px
  100%
    stroke-dasharray 90, 150
    stroke-dashoffset -120px
.loading-mask
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  margin 0
  z-index 100
  background-color hsla(0, 0%, 100%, 1)
  transition opacity 0.3s
  .loading-spinner
    position absolute
    top 50%
    width 100%
    transform translateY(-50%)
    text-align center
    .circular
      width 42px
      height 42px
      animation loading-rotate 2s linear infinite
      .path
        animation loading-dash 1.5s ease-in-out infinite
        stroke-dasharray 90, 150
        stroke-dashoffset 0
        stroke-width 2
        stroke #FF4040
        stroke-linecap round
</style>
