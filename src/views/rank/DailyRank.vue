<template>
  <div>
    <Header @selectMode="selectMode"
            @selectDate="selectDate" />
    <div class="rank">
      <mescroll-vue ref="mescroll"
                    :up="mescrollUp"
                    @init="mescrollInit">
        <List :list="pictureList" />
      </mescroll-vue>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import List from '@/components/list/Test'
import Header from './header/Header'
import MescrollVue from 'mescroll.js/mescroll.vue'

export default {
  name: 'DailyRank',
  components: {
    List,
    Header,
    MescrollVue
  },
  data () {
    return {
      param: {
        page: 0,
        mode: '',
        date: null
      },
      pictureList: [],
      noMore: false,
      loading: false,
      mescrollUp: {
        callback: this.upCallback
      }
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
    this.param.date = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD')
    this.param.mode = 'day'
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this.param.page = 1
      this.pictureList = [] // 不清空会追加
      this.noMore = false
      this.$api.rank
        .getRank(this.param)
        .then(res => {
          if (!res.data.data.data.length) {
            this.noMore = true
          } else {
            this.pictureList = res.data.data.data
          }
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    getMoreData () {
      this.param.page++
      this.$api.rank
        .getRank(this.param)
        .then(res => {
          if (!res.data.data.data.length) {
            this.noMore = true
          } else {
            // push视图不更新的原因： watch新值和旧值都是指向的还是同一个数组 val和old会相等
            // this.pictureList.push(...res.data.data.data)
            this.pictureList = this.pictureList.concat(res.data.data.data)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    infinite ($state) {
      console.log(1111)
      this.param.page++
      this.$api.rank
        .getRank(this.param)
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
      this.param.date = dayjs(date).format('YYYY-MM-DD')
      this.getData()
    },
    selectMode (selectedVal) {
      this.param.mode = selectedVal[1]
      this.getData()
    },
    onScroll (pos, direction) {
      if (direction === 1) {
        // 上滑
        this.$store.dispatch('changeTab', false)
      } else if (direction === -1) {
        // 下滑
        this.$store.dispatch('changeTab', true)
      }
    },
    upCallback () {

    },
    mescrollInit () {

    }
  }
}
</script>

<style lang="stylus" scoped>
.rank
  position fixed
  top 40px
  right 0
  bottom 0
  left 0
  // width 100%
  // height 100vh
  font-size 16px
</style>
