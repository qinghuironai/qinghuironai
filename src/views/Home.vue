<template>
  <div
    :style="{backgroundImage: `url(${bg})`}"
    class="home"
  >
    <Snow />
    <div class="home__content">
      <div class="home__content--header">
        <div
          :class="[{ active: showLeftSlider }, 'home__content--header-left']"
          @click="openLeft"
        >
          <!-- <img src="../assets/images/菜单.svg" alt="" :class="{ rotate: showLeftSlider }"> -->
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="home__content--header-right">
          <!-- 用户登陆后显示头像 -->
          <img
            @click="openRight"
            alt
            src="../assets/images/avatar.png"
            v-if="Object.keys(user).length"
          />
          <div
            :class="['home__login', { 'home__login--bobble': isBobble }]"
            @click="goLogin"
            v-else
          >GO</div>
        </div>
      </div>
      <div
        class="home__content--search"
        v-show="!isShow"
      >
        <TextInput v-on:enter="popSearch" />
      </div>
    </div>
    <LeftSlider
      :bgImage="bg"
      :showLeftSlider.sync="showLeftSlider"
    />
    <RightSlider :showRightSlider.sync="showRightSlider" />
    <!-- 登录注册弹窗 -->
    <div
      class="home__dialog"
      v-show="isShow"
    >
      <div class="home__dialog--content">
        <Login
          @closeLogin="closeLogin"
          @lostPwd="sign"
          @signUp="sign"
          class="animated jackInTheBox"
          v-show="status === 'login'"
        />
        <Register
          @signIn="sign"
          class="animated jackInTheBox"
          v-show="status === 'register'"
        />
        <FindPwd
          class="animated jackInTheBox"
          v-show="status === 'find'"
        />
      </div>
      <div
        @click="close"
        class="home__dialog--mask"
      ></div>
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'
import Snow from '@/components/Snow'
import Login from '@/components/Login'
import Register from '@/components/Register'
import FindPwd from '@/components/FindPwd'
import RightSlider from '@/components/RightSlider'
import LeftSlider from '@/components/LeftSlider'
import bg1 from '@/assets/images/background/bg1.jpg'
import bg2 from '@/assets/images/background/bg2.jpg'
import bg3 from '@/assets/images/background/bg3.jpg'

export default {
  name: 'Home',
  components: {
    Snow,
    TextInput,
    Login,
    Register,
    FindPwd,
    RightSlider,
    LeftSlider
  },
  data () {
    return {
      paths: [
        {
          label: '须知',
          route: '/intro',
          suffix: ' · '
        },
        {
          label: '捐助',
          route: '/donate',
          suffix: ' & '
        },
        {
          label: '留言板',
          route: '/comments',
          suffix: ' & '
        },
        {
          label: '友链传送',
          route: '/links'
        }
      ],
      isShow: false,
      status: 'login',
      isBobble: false,
      backgroundImage: `url(${bg1})`,
      bg: bg1,
      showLeftSlider: false,
      showRightSlider: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  methods: {
    popSearch (keyword) {
      this.$router.push({
        path: '/popSearch',
        query: { keyword }
      })
    },
    dailyRank () {
      this.$router.push('/dailyRank')
    },
    goLogin () {
      this.isBobble = true
      setTimeout(() => {
        this.isShow = true
      }, 1000)
    },
    close () {
      this.isShow = false
      this.status = 'login'
      this.isBobble = false
    },
    sign (val) {
      console.log(val)
      this.status = val
    },
    openLeft () {
      this.showLeftSlider = !this.showLeftSlider
    },
    openRight () {
      this.showRightSlider = true
    },
    closeLogin () {
      this.isBobble = false
      this.isShow = false
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      switch (this.bg) {
        case bg1:
          this.bg = bg2
          break
        case bg2:
          this.bg = bg3
          break
        case bg3:
          this.bg = bg1
      }
    }, 5000)
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
.home {
  display: flex;
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
  // background-image url('../assets/images/background/bg1.jpg')
  background-size: cover;
  transition: background 0.2s linear;

  &__content {
    flex: 1;

    &--header {
      display: flex;
      justify-content: space-between;
      color: #fff;

      &-right, &-left {
        margin: 1.2rem;

        img {
          width: 3rem;
          margin-top: 0.6rem;
        }

        span {
          position: absolute;
          width: 2rem;
          height: 1.8px;
          margin-top: 1rem;
          background-color: rgba(255, 255, 255, 1);

          &:nth-child(1) {
            transform: translateY(0.6rem) rotate(0deg);
          }

          &:nth-child(3) {
            transform: translateY(1.2rem) rotate(0deg);
          }
        }

        div {
          position: absolute;
          top: 1.8rem;
          right: 1.4rem;
          font-size: 0.6rem;
          text-align: center;
        }
      }

      .active {
        z-index: 104;

        span {
          background: red;
          transition: all 0.5s;

          &:nth-child(1) {
            transform: translateY(0) rotate(45deg);
          }

          &:nth-child(3) {
            transform: translateY(0) rotate(-45deg);
          }

          &:nth-child(2) {
            opacity: 0;
          }
        }
      }
    }

    &--search {
      margin-top: 30vh;
      text-align: center;
    }

    &--daily-rank {
      display: block;
      margin: 2rem;
      text-align: center;

      p {
        margin: 0.8rem;
        text-align: center;
        color: $white;
        font-size: 1rem;
      }
    }

    &--help {
      color: $white;
      text-align: center;

      a {
        font-size: 1.4rem;
      }
    }
  }

  &__dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    &--content {
      position: relative;
      width: 80vw;
      z-index: 999;
    }

    &--mask {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      // background rgba(51, 163, 220, .3)
      background-color: transparent;
      z-index: 200;
    }
  }

  &__login {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    background-color: #FFB5C5;
    border-radius: 50%;
    transition: all 1000ms, 1000ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);

    &--bobble {
      transform: scale(50);
      font-size: 0 !important;
      // background-color #FFB5C5
    }
  }
}
</style>
