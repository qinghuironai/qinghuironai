<template>
  <div class="rank">
    <div class="rank__header">
      <i class="iconfont icon-sousuo1"
         @click="goSearch"></i>
      <span :class="isDown ? '' : 'active'"
            @click="showModePicker">{{modeText}}</span>
      <i class="iconfont icon-rili"
         @click="showDatePicker"></i>
    </div>
    <div class="rank__scroll">
      <cube-scroll :data="pictureList"
                   :options="options"
                   ref="scroll"
                   class="scroll"
                   :scroll-events="['scroll']"
                   @scroll="onScroll"
                   @pulling-up="onPullingUp">
        <List :list="pictureList" />
      </cube-scroll>
      <Loading v-if="!pictureList.length" />
    </div>
    <div :class="['top', { 'is-active': showBackUp }]"
         @click="scrollToTop">
      <i class="iconfont icon-fanhuidingbu"></i>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import List from '@/components/list/List'
import Loading from '@/components/loading/Loading'

export default {
  name: 'DailyRank',
  components: {
    List,
    Loading
  },
  data () {
    const modeData = [
      {
        value: 'zonghe',
        text: '综合',
        children: [
          { text: '日排行', value: 'day' },
          { text: '周排行', value: 'week' },
          { text: '月排行', value: 'month' },
          { text: '男性日排行', value: 'day_male' },
          { text: '女性日排行', value: 'day_female' }
        ]
      },
      {
        value: 'manhua',
        text: '漫画',
        children: [
          { text: '日排行', value: 'day_manga' },
          { text: '周排行', value: 'week_manga' },
          { text: '月排行', value: 'month_manga' },
          { text: '新秀周排行', value: 'week_rookie_manga' }
        ]
      }
    ]
    return {
      pictureList: [],
      page: 1,
      mode: '',
      date: null,
      isDown: false,
      modeData,
      modeText: '日排行',
      noData: false,
      showBackUp: false
    }
  },
  computed: {
    options () {
      return {
        pullUpLoad: {
          threshold: 0,
          txt: { more: '上拉加载更多', noMore: '(￣ˇ￣)俺也是有底线的' },
          visible: false
        },
        scrollbar: true,
        probeType: 3
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.date = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD')
      this.mode = 'day'
      this.getPictures()
      this.cascadePicker = this.$createCascadePicker({
        title: '模式选择',
        data: this.modeData,
        selectedIndex: [0, 0],
        onSelect: this.selectMode,
        onCancel: this.cancelMode
      })
    },
    initParams () {
      this.page = 1
      this.pictureList = []
      this.noData = false
    },
    getPictures () {
      if (this.noData) return this.$refs.scroll.forceUpdate()
      const data = {
        date: this.date,
        page: this.page++,
        mode: this.mode
      }
      this.$api.rank
        .getRank(data)
        .then(res => {
          if (!res.data.data.data.length) {
            this.$refs.scroll.forceUpdate()
            this.noData = true
            return
          }
          this.pictureList = this.pictureList.concat(res.data.data.data)
        })
        .catch(err => {
          console.error(err)
        })
    },
    onPullingUp () {
      // this.page++
      this.getPictures()
    },
    showDatePicker () {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '日期选择',
          min: new Date(2018, 12, 12),
          max: new Date(dayjs(new Date()).add(-3, 'days')),
          value: new Date(dayjs(new Date()).add(-3, 'days')),
          onSelect: this.selectDate
          // onCancel: this.cancelHandle
        })
      }
      this.datePicker.show()
    },
    selectDate (date, selectedVal, selectedText) {
      this.date = dayjs(date).format('YYYY-MM-DD')
      this.initParams()
      this.getPictures()
    },
    showModePicker () {
      this.isDown = true
      this.cascadePicker.show()
    },
    selectMode (selectedVal, selectedIndex, selectedText) {
      this.isDown = false
      this.modeText = selectedText[1]
      this.mode = selectedVal[1]
      this.initParams()
      this.getPictures()
    },
    cancelMode () {
      this.isDown = false
    },
    onScroll (pos) {
      if (pos.y < -300) {
        const direction = this.$refs.scroll.scroll.movingDirectionY
        if (direction === 1) {
          this.showBackUp = false
        } else if (direction === -1) {
          this.showBackUp = true
        }
      } else {
        this.showBackUp = false
      }
    },
    scrollToTop () {
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
    goSearch () {
      this.$router.push('/search')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/style/color.styl'
.rank
  position fixed
  top 0
  right 0
  bottom 60px
  left 0
  font-size 16px
  &__header
    position fixed
    top 0
    right 0
    left 0
    width 100%
    height 40px
    line-height 40px
    z-index 2
    display flex
    align-items center
    justify-content space-between
    padding 5px 15px
    box-sizing border-box
    i
      font-size 18px
    span
      font-size 18px
      position relative
      &:after
        content ''
        position absolute
        top 15px
        margin-left 4px
        width 0
        height 0
        border-width 0 6px 6px
        border-style solid
        border-color transparent transparent #000
        transition transform 0.3s
    .active
      &:after
        transform rotate(180deg)
  &__scroll
    position fixed
    top 40px
    right 0
    bottom 60px
    left 0
  .top
    position fixed
    width 40px
    height 40px
    bottom 80px
    left 0
    right 0
    margin auto
    opacity 0
    transform translateY(90px)
    background $primary
    text-align center
    border-radius 50%
    box-shadow 0 0 10px rgba(0, 0, 0, 0.6)
    transition all 1s
    &.is-active
      transform translateY(0)
      opacity 1
    i
      display block
      font-size 30px
      line-height 40px
      color white
</style>
