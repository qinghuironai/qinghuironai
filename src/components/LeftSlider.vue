<template>
  <div class="left-slider">
    <transition name="fade">
      <div
        @click="close"
        class="left-slider__mask"
        v-show="showLeftSlider"
      ></div>
    </transition>
    <transition name="slide">
      <div
        class="left-slider__content"
        v-show="showLeftSlider"
      >
        <router-link
          tag="div"
          to="/"
        >
          <img
            alt
            src="../assets/images/spotlight.svg"
          />
          <span>spotlight</span>
        </router-link>
        <router-link
          tag="div"
          to="/"
        >
          <img
            alt
            src="../assets/images/以图搜图.svg"
          />
          <span>以图搜图</span>
        </router-link>
        <router-link
          tag="div"
          to="/"
        >
          <img
            alt
            src="../assets/images/友情链接.svg"
          />
          <span>友情链接</span>
        </router-link>
        <router-link
          tag="div"
          to="/donate"
        >
          <img
            alt
            src="../assets/images/捐助.svg"
          />
          <span>捐助</span>
        </router-link>
        <router-link
          tag="div"
          to="/dailyRank"
        >
          <img
            alt
            src="../assets/images/排行榜.svg"
          />
          <span>排行榜</span>
        </router-link>
        <router-link
          tag="div"
          to="/popSearch"
        >
          <img
            alt
            src="../assets/images/搜索.svg"
          />
          <span>搜索</span>
        </router-link>
        <router-link
          tag="div"
          to="/intro"
        >
          <img
            alt
            src="../assets/images/用户须知.svg"
          />
          <span>用户须知</span>
        </router-link>
        <router-link
          tag="div"
          to="/404"
        >
          <img
            alt
            src="../assets/images/论坛.svg"
          />
          <span>论坛</span>
        </router-link>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    showLeftSlider: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('update:showLeftSlider', false)
    }
  }
}
</script>

<style lang="stylus" scoped>
.left-slider {
  &__mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 1;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
  }

  .fade-enter-to, .fade-leave-to {
    transition: opacity 0.3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  &__content {
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 60vw;
    height: 100vh;
    // border-radius 2.5rem 0 0 2.5rem
    background: #fff;
    padding-top: 10vh;

    div {
      width: 100%;
      height: 10vh;
      display: flex;
      align-items: center;

      &:active {
        background #ccc
      }

      img {
        width: 2rem;
        margin-left: 1rem;
      }

      span {
        font-size: 1rem;
        margin-left: 1rem;
      }
    }
  }

  .slide-leave-active, .slide-enter-active {
    transition: all 0.5s;
  }

  .slide-enter, .slide-leave-to {
    opacity: 0;
    transform: translate(-60vw, 0);

    img {
      width: 15vw;
    }
  }
}
</style>
