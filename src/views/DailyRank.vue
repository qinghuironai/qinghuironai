<template>
  <div class="rank">
    <vue-waterfall-easy
      :imgsArr="pictureList"
      @scrollReachBottom="getPictures"
      ref="waterfall"
      @click="goDetail">
      <div class="img-info" slot-scope="props">
        <p class="some-info">{{ props.value.title }}</p>
      </div>
      <div slot="waterfall-over">已经到底了喵～</div>
    </vue-waterfall-easy>
  </div>
</template>

<script>
import { getRank } from '@/api/rank'
import vueWaterfallEasy from 'vue-waterfall-easy'

export default {
  name: 'DailyRank',
  components: {
    vueWaterfallEasy
  },
  data () {
    return {
      pictureList: [],
      page: 0,
      mode: 'day',
      date: '2019-06-26',
      imgsArr: []
    }
  },
  created () {
    this.getPictures()
  },
  activated () {
  },
  deactivated () {
  },
  methods: {
    getPictures () {
      const data = {
        date: this.date,
        page: this.page,
        mode: this.mode
      }
      getRank(data).then(res => {
        if (res.status === 200) {
          this.page++
          let data = res.data.data.illustrations
          if (!data || !data.length) {
            this.$refs.waterfall.waterfallOver()
            return
          }
          data.forEach(item => {
            let src = item.meta_pages[0]
            // 给列表添加一个src属性 方便使用
            src = src ? src.image_urls.large : ''
            item.src = item.meta_single_page.large_image_url || src
          })
          this.pictureList = this.pictureList.concat(data)
        } else {

        }
      }).catch(err => {
        console.error(err)
      })
    },
    goDetail (event, { index, value }) {
      event.preventDefault()
      console.log(this.$refs.waterfall.scrollTop)
      sessionStorage.setItem('detail', JSON.stringify(value))
      this.$router.push({
        path: `/detail`
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  width 100%
  height 100%
  background-color #fff
.img-info
  padding 0.4rem
.some-info
  text-align center
  color #666666
  overflow hidden
  padding 0rem
  font-size 0.8rem
</style>
