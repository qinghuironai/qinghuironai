<template>
  <footer>
    <div class="author">
      <span
        v-for="coder in coders"
        :key="coder.label"
      >
        <a
          v-for="member in coder.members"
          :key="member.name"
          :href="member.link"
          :title="coder.label"><span>{{coder.label}}:</span>
          <a
          :href="member.github.link">
            <img :src="member.github.icon" :alt="member.name">
          </a>
        </a>
        <span>{{coder.suffix}}</span>
      </span>
    </div>
    <p class="copyright">
      &copy;2018-2019 pixivic.com All Right Reserved.
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      coders: [{
        label: 'front-end',
        suffix: ' / ',
        members: [{
          name: 'Arius',
          link: 'https://github.com/Ariussssss',
          github: {
            link: 'https://github.com/Ariussssss',
            icon: require('@/assets/images/github.svg')
          }
        }]
      }, {
        label: 'back-end',
        members: [{
          name: 'Oysterqaq',
          link: 'https://www.oysterqaq.com',
          github: {
            link: 'https://github.com/OysterQAQ',
            icon: require('@/assets/images/github.svg')
          }
        }]
      }]
    }
  }
}
</script>

<style lang="stylus" scoped>
  footer
    margin: .2rem
    color: $white
    text-align: center
    font-size: 1.5rem
    line-height: 1.5rem
    .author
      img
        height: 1.5rem
    .copyright
      font-size: 1rem
</style>
