<template>
  <div class="home">
    <Snow/>
    <Banner/>
    <div class="home__content">
      <div class="home__content--search">
        <TextInput v-on:enter="popSearch"/>
      </div>
      <router-link
        class="home__content--daily-rank"
        tag="a"
        to="/dailyRank">
        <img src="@/assets/images/beer.svg"/>
        <p>插画排行榜</p>
      </router-link>
      <div class="home__content--help">
        <router-link
          tag="a"
          v-for="path in paths"
          :key="path.label"
          :to="path.route">
          {{ path.label }}
          <span>{{ path.suffix }}</span>
        </router-link>
      </div>
    </div>
    <div :class="['home__login', { 'home__login--bobble': isBobble }]" @click="goLogin"></div>
    <Footer/>

    <!-- 登录注册弹窗 -->
    <div class="home__dialog" v-show="isShow">
      <div class="home__dialog--content">
        <Login v-show="status === 'login'" @signUp="sign" @lostPwd="sign" class="animated jackInTheBox"/>
        <Register v-show="status === 'register'" @signIn="sign" class="animated jackInTheBox"/>
        <FindPwd v-show="status === 'find'" class="animated jackInTheBox"/>
      </div>
      <div class="home__dialog--mask" @click="close"></div>
    </div>
  </div>
</template>

<script>
import Banner from '@/components/Banner'
import TextInput from '@/components/TextInput'
import Footer from '@/components/Footer'
import Snow from '@/components/Snow'
import Login from '@/components/Login'
import Register from '@/components/Register'
import FindPwd from '@/components/FindPwd'

export default {
  name: 'Home',
  components: {
    Snow,
    Banner,
    TextInput,
    Footer,
    Login,
    Register,
    FindPwd
  },
  data () {
    return {
      paths: [{
        label: '须知',
        route: '/intro',
        suffix: ' · '
      }, {
        label: '捐助',
        route: '/donate',
        suffix: ' & '
      }, {
        label: '留言板',
        route: '/comments',
        suffix: ' & '
      }, {
        label: '友链传送',
        route: '/links'
      }],
      isShow: false,
      status: 'login',
      isBobble: false
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  .home
    display: flex
    box-sizing: border-box
    width: 100vw
    height: 100vh
    flex-direction: column
    overflow hidden
    &__content
      flex: 1
      &--search
        margin-top: 1.4rem
        text-align: center
      &--daily-rank
        display: block
        margin: 2rem
        text-align: center
        p
          margin: .8rem
          text-align: center
          color: $white
          font-size: 1rem
      &--help
        color: $white
        text-align: center
        a
          font-size: 1.4rem
    &__dialog
      position fixed
      width 100%
      height 100%
      font-size 1rem
      display flex
      justify-content center
      align-items center
      &--content
        position relative
        width 80vw
        z-index 999
      &--mask
        position fixed
        width 100%
        height 100%
        left 0
        top 0
        // background rgba(51, 163, 220, .3)
        background-color transparent
        z-index 200
    &__login
      width 2rem
      height 2rem
      overflow hidden
      background-color #FFB5C5
      border-radius 50%
      transition all 1000ms, 1000ms cubic-bezier(0.680, -0.550, 0.265, 1.550)
      transition-timing-function cubic-bezier(0.680, -0.550, 0.265, 1.550)
      &--bobble
        transform scale(32)
        // background-color #FFB5C5
</style>
