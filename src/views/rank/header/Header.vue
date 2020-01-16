<template>
  <div class="rank-header">
    <i class="iconfont icon-sousuo1"
       @click="goSearch"></i>
    <span :class="isDown ? '' : 'active'"
          @click="showModePicker">{{modeText}}</span>
    <i class="iconfont icon-rili"
       @click="showDatePicker"></i>
  </div>
</template>

<script>
import { modeData } from '@/util/constants'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      modeText: '日排行',
      isDown: false
    }
  },
  mounted () {
    this.cascadePicker = this.$createCascadePicker({
      title: '模式选择',
      data: modeData,
      selectedIndex: [0, 0],
      onSelect: this.selectMode,
      onCancel: this.cancelMode
    })
  },
  methods: {
    showModePicker () {
      this.isDown = true
      this.cascadePicker.show()
    },
    goSearch () {
      this.$router.push('/search')
    },
    cancelMode () {
      this.isDown = false
    },
    selectMode (selectedVal, selectedIndex, selectedText) {
      this.isDown = false
      this.modeText = selectedText[1]
      this.$emit('selectMode', selectedVal)
    },
    showDatePicker () {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '日期选择',
          min: new Date(2018, 0, 1),
          max: new Date(dayjs(new Date()).add(-3, 'days')),
          value: new Date(dayjs(new Date()).add(-3, 'days')),
          onSelect: this.selectDate
          // onCancel: this.cancelHandle
        })
      }
      this.datePicker.show()
    },
    selectDate (date, selectedVal, selectedText) {
      this.$emit('selectDate', date)
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank-header
  width 100%
  height 40px
  line-height 40px
  z-index 100
  display flex
  align-items center
  justify-content space-between
  padding 5px 15px
  box-sizing border-box
  margin-bottom 8px
  position fixed
  top 0
  background #fff
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
</style>
