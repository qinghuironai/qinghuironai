<template>
  <div class="rank">
    <Scroll ref="scroll"
            :data="pictureList"
            :options="options"
            :loading="loading"
            @pulling-up="onPullingUp">
      <Header @selectMode="selectMode"
              @selectDate="selectDate" />
    </Scroll>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import Scroll from '@/components/scroll/Scroll'
import Header from './header/Header'

export default {
  name: 'DailyRank',
  components: {
    Scroll,
    Header
  },
  data () {
    return {
      pictureList: [],
      page: 1,
      mode: '',
      date: null,
      noData: false,
      loading: false
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
        scrollbar: false,
        probeType: 3
      }
    }
  },
  mounted () {
    this.date = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD')
    this.mode = 'day'
    this.getPictures()
  },
  methods: {
    initParams () {
      this.page = 1
      this.pictureList = []
      this.noData = false
    },
    getPictures () {
      if (this.noData) {
        return this.$refs.scroll.forceUpdate()
      }
      if (this.page === 1) {
        this.loading = true
      }
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
            this.loading = false
            return
          }
          this.pictureList = this.pictureList.concat(res.data.data.data)
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    onPullingUp () {
      this.getPictures()
    },
    selectDate (date) {
      this.date = dayjs(date).format('YYYY-MM-DD')
      this.initParams()
      this.getPictures()
    },
    selectMode (selectedVal) {
      this.mode = selectedVal[1]
      this.initParams()
      this.getPictures()
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  position fixed
  top 0
  right 0
  bottom 60px
  left 0
  font-size 16px
</style>
