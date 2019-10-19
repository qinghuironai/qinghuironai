<template>
  <div class="rank">
    <!-- <div class="rank__header"></div> -->
    <!-- 日历弹窗 -->
    <div class="rank__content">
      <div class="rank__calendar-picker" v-show="calendarShow">
        <div @click.stop="calendarShow = false" class="rank__calendar-picker--mask"></div>
        <calendar
          :futureDayHide="futureDayHide"
          class="rank__calendar-picker--date"
          ref="datePicker"
          v-on:choseDay="clickDay"
        />
      </div>

      <div class="rank__calendar">
        <img @click="showCalendar" alt src="@/assets/images/calendar.svg" />
      </div>

      <div class="rank__select">
        <span>{{ mode }}</span>
        <select name="sources" placeholder="Source Type" v-model="mode">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
      </div>
      <v-touch
        :swipe-options="{ direction: 'horizontal' }"
        v-on:swipeleft="onSwipeLeft"
        v-on:swiperight="onSwipeRight"
      >
        <pic-list :pictureList="pictureList" @loadMore="loadMore"></pic-list>
      </v-touch>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import Calendar from 'vue-calendar-component'
import moment from 'moment'
import PicList from '@/components/PicList'

export default {
  name: 'DailyRank',
  components: {
    Calendar,
    PicList
  },
  data () {
    return {
      pictureList: [],
      page: 0,
      mode: 'day',
      date: '',
      imgsArr: [],
      images: [],
      info: {},
      isShow: false,
      guide: true,
      calendarShow: false,
      loading: false,
      isBottom: false,
      futureDayHide: ''
    }
  },
  mounted () {
    const initDate = moment().add(-3, 'days')
    this.futureDayHide = initDate.unix().toString()
    this.initCalendar(initDate)
  },
  methods: {
    initCalendar (initDate) {
      this.calendarShow = true
      this.$nextTick(() => {
        this.$refs.datePicker.getList(new Date(), initDate.format('YYYY/M/D'))
      })
    },
    getPictures () {
      const data = {
        date: this.date,
        page: this.page,
        mode: this.mode
      }
      this.loading = true
      return this.$api.rank
        .getRank(data)
        .then(res => {
          if (res.status === 200) {
            this.page++
            let data = res.data.data.data
            this.isBottom = false
            if (!data || !data.length) {
              this.isBottom = true
            } else {
              this.pictureList = this.pictureList.concat(data)
            }
          } else {
            this.$aMsg.error(res.data)
          }
          this.loading = false
          if (this.guide) {
            this.guide = false
            setTimeout(() => {
              this.$aMsg({
                message: '左右滑动可以切换日期喔～',
                type: 'none',
                timeout: 3000
              })
            }, 1000)
          }
        })
        .catch(err => {
          this.$aMsg.error(err)
          this.loading = false
          this.isBottom = true
        })
    },
    preview (val) {
      this.info = val
      this.images = val.imageUrls
      this.isShow = true
    },
    showCalendar () {
      this.calendarShow = true
    },
    clickDay (data) {
      const date = data
        .split('/')
        .map(e => e.padStart(2, '0'))
        .join('-')
      const newDate = moment(date).format('YYYY-MM-DD')
      if (newDate === this.date) return
      this.date = newDate
      this.page = 0
      if (this.mode !== 'day') {
        this.mode = 'day'
        this.calendarShow = false
        return
      }
      this.mode = 'day'
      this.calendarShow = false
      this.pictureList = []
      this.getPictures()
    },
    swipe (page) {
      let newDate
      if (this.mode === 'day') {
        newDate = moment(this.date)
          .add('days', page)
          .format('YYYY-MM-DD')
      } else if (this.mode === 'week') {
        newDate = moment(this.date)
          .week(moment(this.date).week() + page)
          .startOf('week')
          .add('days', 1)
          .format('YYYY-MM-DD')
      } else if (this.mode === 'month') {
        newDate = moment(this.date)
          .month(moment(this.date).month() + page)
          .startOf('month')
          .format('YYYY-MM-DD')
      }
      if (moment(newDate).unix() > this.futureDayHide) {
        this.$aMsg.error('新数据尚未注入。。')
        return
      }
      this.date = newDate
      this.page = 0
      this.pictureList = []
      this.getPictures()
    },
    onSwipeLeft () {
      this.swipe(1)
    },
    onSwipeRight () {
      this.swipe(-1)
    },
    loadMore: debounce(function () {
      this.pictureList.length !== 0 && this.getPictures()
    }, 1000)
  },
  watch: {
    mode (val) {
      this.page = 0
      this.pictureList = []
      // 这里选择模式后 周的话要本周一 月的话要本月1号
      if (val === 'week') {
        this.date = moment(this.date)
          .weekday(1)
          .format('YYYY-MM-DD')
      } else if (val === 'month') {
        this.date =
          moment(this.date)
            .add('month', 0)
            .format('YYYY-MM') + '-01'
      }
      this.getPictures()
    },
    loading (val) {
      val && this.$aMsg.loading('loading...')
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  position relative
  &__header
    position absolute
    width 100%
    height 3rem
    background $primary
  &__content
    position absolute
    box-sizing border-box
    width 100%
    min-height 100vh
    background-color white
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
    &--wrapper
      position relative
      padding 10px 4px
    &--item
      position relative
      -moz-page-break-inside avoid
      -webkit-column-break-inside avoid
      break-inside avoid
      box-shadow 0 1px 3px rgba(0, 0, 0, 0.3)
      border-radius 0.3rem
      overflow hidden
      img
        width 100%
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
    position relative
    text-align center
    margin-bottom 1rem
    select
      position absolute
      display block
      top 0
      left 0
      right 0
      margin auto
      width 4rem
      height 1.5rem
      outline none
      opacity 0
    span
      padding 0.2rem 1rem
      width auto
      outline none
      background-color #5c9cd8
      font-size 1rem
      color #ffffff
      border-radius 0.4rem
  &__calendar
    position relative
    &-picker
      &--mask
        width 100%
        height 100%
        position fixed
        left 0
        top 0
        background rgba(51, 163, 220, 0.3)
        z-index 200
      &--date
        position fixed
        top 0
        left 0
        right 0
        margin 1rem
        z-index 300
        >>> .wh_content_all
          background-color #33a3dcd1
          border-radius 10px
          .wh_isToday
            background #ffffffb3
            color #0bcead
            font-weight bold
        >>> .wh_content_item .wh_chose_day
          background white
          color #0bcead
          font-weight bold
</style>
