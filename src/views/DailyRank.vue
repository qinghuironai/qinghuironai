<template>
  <div class="rank">
    <!-- 图片弹窗 下次重写 -->
    <img-dialog :images="images" :info="info" :isShow.sync="isShow"/>
    <!-- 日历弹窗 -->
    <div v-show="calendarShow" class="rank__calendar">
      <div class="rank__calendar--mask" @click.stop="calendarShow = false"></div>
      <Calendar class="rank__calendar--date" v-on:choseDay="clickDay"></Calendar>
    </div>

    <div class="rank__calendar">
      <img src="@/assets/images/calendar.svg" @click="showCalendar" alt="">
    </div>

    <div class="rank__select">
      <select name="sources" placeholder="Source Type" v-model="mode">
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
    </div>

    <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight" :swipe-options="{direction: 'horizontal'}">
      <div class="rank__list">
        <div class="rank__list--item" v-for="(item, index) in pictureList" :key="index">
          <img @click="preview(item.meta_pages, item)" v-if="item.meta_pages.length" v-lazy="item.meta_pages[0].image_urls.large" alt="">
          <img @click="preview(item.meta_single_page.original_image_url, item)" v-else v-lazy="item.meta_single_page.large_image_url" alt="">
          <p class="rank__list--item-title">{{ item.title }}</p>
          <div v-if="item.page_count > 1" class="rank__list--item-count">
            <img src="@/assets/images/count.svg" alt="">
            <span>{{ item.page_count }}</span>
          </div>
        </div>
      </div>
    </v-touch>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="rank__more">
      <div v-if="isBottom" class="rank__more--bottom">(￣ˇ￣)俺也是有底线的</div>
      <img v-else src="../assets/images/loading.gif" alt="">
    </div>
  </div>
</template>

<script>
import { getRank } from '@/api/rank'
import imgDialog from '@/components/Dialog'
import Calendar from 'vue-calendar-component'
import moment from 'moment'

export default {
  name: 'DailyRank',
  components: {
    imgDialog,
    Calendar
  },
  data () {
    return {
      pictureList: [],
      page: 0,
      mode: 'day',
      date: '',
      imgsArr: [],
      // 要预览的图片
      images: [],
      info: {},
      isShow: false,
      calendarShow: false,
      busy: false,
      isBottom: false
    }
  },
  mounted () {
    this.date = moment().add(-3, 'days').format('YYYY-MM-DD')
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
            this.busy = true
            this.isBottom = true
          } else {
            this.pictureList = this.pictureList.concat(data)
          }
        } else {

        }
      }).catch(err => {
        console.error(err)
      })
    },
    preview (val, info) {
      this.info = info
      this.images = []
      if (Array.isArray(val)) {
        val.forEach(item => {
          this.images.push(item.image_urls.original)
        })
      } else {
        this.images.push(val)
      }
      this.isShow = true
    },
    // 显示日历
    showCalendar () {
      this.calendarShow = true
    },
    clickDay (data) {
      const date = data.replace(/\//g, '-') // 2019-7-3
      this.date = moment(date).format('YYYY-MM-DD')
      this.pictureList = []
      this.page = 0
      if (this.mode !== 'day') {
        this.mode = 'day'
        this.calendarShow = false
        return
      }
      this.mode = 'day'
      this.calendarShow = false
      this.getPictures()
    },
    onSwipeLeft () {
      // 左划 前进 下一天 周一 月1
      if (this.mode === 'day') {
        this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD')
      } else if (this.mode === 'week') {
        this.date = moment(this.date).week(moment(this.date).week() + 1).startOf('week').add(1, 'days').format('YYYY-MM-DD')
      } else if (this.mode === 'month') {
        this.date = moment(this.date).month(moment(this.date).month() + 1).startOf('month').format('YYYY-MM-DD')
      }
      this.page = 0
      this.pictureList = []
      this.getPictures()
    },
    onSwipeRight () {
      if (this.mode === 'day') {
        this.date = moment(this.date).add(-1, 'days').format('YYYY-MM-DD')
      } else if (this.mode === 'week') {
        this.date = moment(this.date).week(moment(this.date).week() - 1).startOf('week').add(1, 'days').format('YYYY-MM-DD')
      } else if (this.mode === 'month') {
        this.date = moment(this.date).month(moment(this.date).month() - 1).startOf('month').format('YYYY-MM-DD')
      }
      this.page = 0
      this.pictureList = []
      this.getPictures()
    },
    loadMore () {
      this.busy = true
      setTimeout(() => {
        this.getPictures()
        this.busy = false
      }, 1000)
    }
  },
  watch: {
    mode (val) {
      this.page = 0
      this.pictureList = []
      // 这里选择模式后 周的话要本周一 月的话要本月1号
      if (val === 'week') {
        this.date = moment(this.date).weekday(1).format('YYYY-MM-DD')
      } else if (val === 'month') {
        this.date = moment(this.date).add('month', 0).format('YYYY-MM') + '-01'
      }
      this.getPictures()
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  min-height 100%
  background-color #fff
  position relative
  &__more
    &--bottom
      font-size 1rem
      text-align center
      padding 0.6rem
      color #33a3dc
  &__list
    -moz-column-count 2
    -webkit-column-count 2
    column-count 2
    -moz-column-gap 0.4rem
    -webkit-column-gap 0.4rem
    column-gap 0.4rem
    padding-top 0.2rem
    &--item
      position relative
      padding 0.2rem
      margin-bottom 0.2rem
      -moz-page-break-inside avoid
      -webkit-column-break-inside avoid
      break-inside avoid
      box-shadow 0 1px 3px rgba(0, 0, 0, .3)
      border-radius 0.3rem
      img
        width 100%
        border-radius 0.3rem
      &-title
        line-height 0.8rem
        text-align center
        padding 0.2rem
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        color #666666
        font-size 0.8rem
      &-count
        position absolute
        top 0.4rem
        right 0.4rem
        background-color #0000009e
        padding 0.2rem
        border-radius 0.25rem
        img
          width 1.25rem
          height 1.25rem
          margin-right 0.2rem
          vertical-align middle
        span
          color #fff
          vertical-align middle
          line-height 1.25rem
          font-size 1rem
  &__calendar
      height 4rem
      text-align center
      padding 0.4rem
      img
        width 4rem
        height 4rem
  &__select
    text-align center
    margin-bottom 0.5rem
    select
      outline none
      background-color #5c9cd8
      width 4rem
      height 1.5rem
      font-size 1rem
      color #ffffff
      border-radius 0.4rem
  &__calendar
    position relative
    &--mask
      width 100%
      height 100%
      position fixed
      left 0
      top 0
      background rgba(51, 163, 220, .3)
      z-index 200
    &--date
      position fixed
      top 0
      left 0
      right 0
      z-index 300
      >>> .wh_content_all
        background-color #33a3dc
        opacity 0.4
</style>
