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
    <Footer/>
  </div>
</template>

<script>
import Banner from '@/components/Banner'
import TextInput from '@/components/TextInput'
import Footer from '@/components/Footer'
import Snow from '@/components/Snow'

export default {
  name: 'Home',
  components: {
    Snow,
    Banner,
    TextInput,
    Footer
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
      }]
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
</style>
