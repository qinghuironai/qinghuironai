<template>
  <div>
    <Header @selectMode="selectMode"
            @selectDate="selectDate" />
    <div class="rank">
      <List :list="pictureList"
            :identifier="identifier"
            @infinite="infinite" />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import List from '@/components/virtual-list/VirtualList'
import Header from './header/Header'

export default {
  name: 'DailyRank',
  components: {
    List,
    Header
  },
  data () {
    return {
      page: 1,
      mode: '',
      date: null,
      pictureList: [],
      noMore: false,
      loading: false,
      identifier: +new Date()
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
        probeType: 2
      }
    }
  },
  mounted () {
    this.date = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD')
    this.mode = 'day'
    // this.getData()
  },
  methods: {
    infinite ($state) {
      this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        })
        .then(res => {
          if (!res.data.data.data.length) {
            $state.complete()
          } else {
            // push视图不更新的原因： watch新值和旧值都是指向的还是同一个数组 val和old会相等
            // this.pictureList.push(...res.data.data.data)
            this.pictureList = this.pictureList.concat(res.data.data.data)
            $state.loaded()
          }
        })
    },
    selectDate (date) {
      this.date = dayjs(date).format('YYYY-MM-DD')
      this.page = 1
      this.pictureList = []
      // this.getData()
      this.identifier += 1
    },
    selectMode (selectedVal) {
      this.mode = selectedVal[1]
      this.page = 1
      this.pictureList = []
      this.identifier += 1
    },
    onScroll (pos, direction) {
      if (direction === 1) {
        // 上滑
        this.$store.dispatch('changeTab', false)
      } else if (direction === -1) {
        // 下滑
        this.$store.dispatch('changeTab', true)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  // position fixed
  // top 0
  // right 0
  // bottom 0
  // left 0
  // width 100%
  // height 100vh
  font-size 16px
  margin-top 40px
  position relative
</style>
