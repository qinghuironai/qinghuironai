<template>
  <div class="rank">
    <vue-waterfall-easy
      class="rank__waterfall"
      :imgsArr="pictureList"
      @scrollReachBottom="getPictures"
      ref="waterfall"
      @click="goDetail">
      <div class="rank__waterfall--info" slot-scope="props">
        <p>{{ props.value.title }}</p>
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
      date: this.getTimeDay(),
      imgsArr: []
    }
  },
  mounted () {
    this.getPictures()
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
    // 获取三天前日期 （最早三天前才有排行）
    getTimeDay () {
      let time = new Date(Date.now() - (3 * 3600 * 24 * 1000))
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return `${y}-${m}-${d}`
    },
    goDetail (event, { index, value }) {
      event.preventDefault()
      // 图片预览
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  width 100%
  height 100%
  background-color #fff
  .rank__waterfall
    .rank__waterfall--info
      padding 0.4rem
      p
        text-align center
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        color #666666
        font-size 0.8rem
</style>
