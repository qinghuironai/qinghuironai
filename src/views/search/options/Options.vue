<template>
  <transition enter-active-class="animated slideInRight"
              leave-active-class="animated slideOutRight">
    <div v-if="showOptions"
         class="options">
      <Header title="显示选项"
              background="#b9eee5"
              @handleClick="close" />
      <div class="options-list">
        <div class="item"
             @click="openOptions(1)">
          <p>画作类型</p>
          <span>{{form.illustType === 'illust' ? '插画' : '漫画'}}</span>
        </div>
        <div class="item"
             @click="openOptions(2)">
          <p>搜索类型</p>
          <span>{{form.searchType === 'original' ? '原始' : '自动翻译'}}</span>
        </div>
        <div class="item"
             @click="setData">
          <p>发布日期</p>
          <span>{{form.beginDate}} - {{form.endDate}}</span>
        </div>
        <div class="item"
             @click="setLength('minWidth')">
          <p>最小宽度</p>
          <span>{{form.minWidth}}</span>
        </div>
        <div class="item"
             @click="setLength('minHeight')">
          <p>最小高度</p>
          <span>{{form.minHeight}}</span>
        </div>
      </div>
      <cube-button class="options-btn"
                   @click="searchFor">按这个条件搜索</cube-button>
    </div>
  </transition>
</template>

<script>
import dayjs from 'dayjs'
import Header from '@/components/header/Header'
const column1 = [{ text: '插画', value: 'illust' }, { text: '漫画', value: 'manga' }]
const column2 = [{ text: '原始', value: 'original' }, { text: '自动翻译', value: 'autoTranslate' }]
const dateSegmentData = [
  {
    is: 'cube-date-picker',
    title: '开始时间',
    min: new Date(2008, 0, 1),
    max: new Date()
  },
  {
    is: 'cube-date-picker',
    title: '结束时间',
    min: new Date(2008, 0, 1),
    max: new Date()
  }
]

export default {
  components: {
    Header
  },
  data () {
    return {
      showOptions: false,
      form: {
        searchType: 'original', // 可选original和autoTranslate
        illustType: 'illust', // 画作类型（可选manga和illust）
        minWidth: 0, // 最小宽度
        minHeight: 0, // 最小高度
        beginDate: null, // 画作发布日期限制
        endDate: null // 画作发布日期限制
        // 涩图参数
        // xRestrict: 1
        // maxSanityLevel: 10
      }
    }
  },
  methods: {
    show () {
      this.showOptions = true
    },
    close () {
      this.showOptions = false
    },
    openOptions (type) {
      let column, func
      if (type === 1) {
        column = column1
        func = this.selectIllustType
      }
      if (type === 2) {
        column = column2
        func = this.selectSearchType
      }
      this.picker = this.$createPicker({
        title: 'Picker',
        data: [column],
        onSelect: func
      })
      this.picker.show()
    },
    selectIllustType (selectedVal) {
      this.form.illustType = selectedVal[0]
    },
    selectSearchType (selectedVal) {
      this.form.searchType = selectedVal[0]
    },
    setLength (val) {
      this.dialog = this.$createDialog({
        type: 'prompt',
        title: `请输入${val}`,
        prompt: {
          // value: val === 'minWidth' ? this.form.minWidth : this.form.minHeight,
          value: 0,
          placeholder: `请输入${val}`,
          type: 'number'
        },
        onConfirm: (e, promptValue) => {
          if (val === 'minWidth') {
            this.form.minWidth = promptValue
          } else if (val === 'minHeight') {
            this.form.minHeight = promptValue
          }
        }
      }).show()
    },
    setData () {
      this.dateSegmentPicker.show()
    },
    searchFor () {
      const form = {}
      for (let i in this.form) {
        if (this.form[i]) {
          form[i] = this.form[i]
        }
      }
      this.$emit('searchFor', form)
      this.close()
    }
  },
  mounted () {
    this.dateSegmentPicker = this.$createSegmentPicker({
      data: dateSegmentData,
      onSelect: (selectedDates, selectedVals, selectedTexts) => {
        this.form.beginDate = dayjs(selectedTexts[0]).format('YYYY-MM-DD')
        this.form.endDate = dayjs(selectedTexts[1]).format('YYYY-MM-DD')
      },
      onNext: (i, selectedDate, selectedValue, selectedText) => {
        dateSegmentData[1].min = selectedDate
        if (i === 0) {
          this.dateSegmentPicker.$updateProps({
            data: dateSegmentData
          })
        }
      }
    })
  }
}
</script>

<style lang="stylus" scope>
.options
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background #fff
  z-index 50
  .options-list
    position fixed
    top 60px
    bottom 0
    left 0
    right 0
    .item
      width 100%
      height 60px
      padding 10px 20px
      box-sizing border-box
      display flex
      flex-direction column
      justify-content space-between
      span
        color #ccc
  .options-btn
    position fixed
    bottom 50px
    width 80%
    left 0
    right 0
    margin auto
</style>
