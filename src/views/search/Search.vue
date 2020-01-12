<template>
  <transition enter-active-class="animated rollIn"
              leave-active-class="animated rollOut">
    <div class="search">
      <div class="search-header">
        <i class="iconfont icon-icon-test"
           @click="$router.back()"></i>
        <div class="input">
          <input v-model="value"
                 ref="input"
                 placeholder="(●'◡'●)ﾉ關鍵字の輸入"
                 @keyup.enter="enter(value)"
                 @focus="focus" />
          <i class="iconfont icon-xiangji1">
          </i>
          <div class="save">
            <input type="file"
                   id="uploads"
                   accept="image/png, image/jpeg, image/gif, image/jpg"
                   @change="uploadImg($event)">
          </div>
        </div>
        <i class="iconfont icon-xuanxiang- menu"
           v-if="!isSearch"
           @click="showOptions"></i>
      </div>
      <div class="search-suggest"
           v-if="isSearch">
        <div class="suggest-item"
             v-for="(item, index) in keywords"
             :key="index">
          <div class="tag"
               @click="enter(item)">{{item}}</div>
          <i class="iconfont icon-jiantou-copy-copy-copy"
             @click="enter(item)"></i>
        </div>
        <div v-show="!keywords.length && this.value"
             class="suggest-no">(●'◡'●)ﾉ</div>
      </div>
      <div class="search-content"
           v-else>
        <!-- dom长列表优化版本 recycle-list 暂未实现 -->
        <Scroll :data="pictureList"
                :options="options"
                :loading="loading"
                :noMore="noMore"
                ref="scroll"
                @pulling-up="getMoreData">
          <Tags v-for="(item, index) in [tags, exclusive]"
                :key="index"
                :data="item"
                @handleClick="clickTag" />
        </Scroll>
      </div>
      <div v-show="value && isSearch"
           class="search-btn">
        <cube-button :light="true"
                     @click="translateKeyword">翻译并搜索</cube-button>
        <cube-button :light="true"
                     @click="searchType('artist')">用户搜索</cube-button>
        <cube-button :light="true"
                     @click="searchType('illust')">画作搜索</cube-button>
      </div>
      <search-options ref="options"
                      @searchFor="searchFor"></search-options>
    </div>
  </transition>
</template>

<script>
import debounce from 'lodash/debounce'
import searchOptions from './options/Options'
import Tags from '@/components/tags/Tags'
import Scroll from '@/components/scroll/Scroll'

export default {
  name: 'Search',
  components: {
    searchOptions,
    Tags,
    Scroll
  },
  data () {
    return {
      value: '',
      isSearch: true,
      keywords: '',
      pictureList: [],
      page: 1,
      tags: [],
      exclusive: [],
      optionsParams: {}, // 设置的筛选条件
      loading: false,
      noMore: false
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
        probeType: 3
      }
    },
    param () {
      return {
        keyword: this.value,
        page: this.page,
        ...this.optionsParams
        // xRestrict: 1,
        // maxSanityLevel: 10
      }
    }
  },
  methods: {
    getKeyword: debounce(function () {
      this.$api.search.getKeyword(this.value)
        .then(({ data: { data } }) => {
          this.keywords = data.keywordList || []
        })
    }, 500),
    enter (val) {
      if (!this.value) return
      this.value = val
      this.$refs.input.blur()
      this.isSearch = false
      this.getData()
      this.getTags(val)
      this.getExclusive(val)
    },
    getData () {
      this.loading = true
      this.page = 1
      this.pictureList = []
      this.noMore = false
      this.$api.search
        .getSearch(this.param)
        .then(res => {
          if (!res.data.data.illustrations.length) {
            this.noMore = true
          } else {
            this.pictureList = res.data.data.illustrations
          }
          this.loading = false
        })
        .catch(err => {
          console.error(err)
        })
    },
    getMoreData () {
      this.page++
      this.$api.search
        .getSearch(this.param)
        .then(res => {
          if (!res.data.data.illustrations.length) {
            this.noMore = true
          } else {
            this.pictureList = this.pictureList.concat(res.data.data.illustrations)
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getTags (param) {
      this.$api.search
        .getTags(param)
        .then(res => {
          this.tags = res.data.data
        })
    },
    getExclusive (param) {
      this.$api.search
        .getExclusive(param)
        .then(res => {
          this.exclusive = res.data.data
        })
    },
    focus () {
      this.isSearch = true
    },
    showOptions () {
      this.$refs.options.show()
    },
    translateKeyword () {
      this.$api.search
        .getTranslations(this.value)
        .then(res => {
          this.enter(res.data.data.keyword)
        })
    },
    searchFor (options) {
      this.optionsParams = options
      this.getData()
    },
    clickTag (val) {
      this.value = val.keyword
      this.tags = this.exclusive = []
      this.getTags(val.keyword)
      this.getExclusive(val.keyword)
      this.getData()
    },
    async uploadImg (e) {
      const file = e.target.files[0]
      if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$createDialog({
          type: 'alert',
          title: '请选择正确图片格式'
        }).show()
        return false
      }
      if (file.size > 1 * 1024 * 1024) {
        this.$createDialog({
          type: 'alert',
          title: '图片大小不能超过1M'
        }).show()
        return false
      }
      this.isSearch = false
      this.loading = true
      this.pictureList = [] // 清空下 不然会接着之前搜索的
      this.noMore = true
      this.tags = this.exclusive = []
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      const result = await this.$api.search.uploadImg(formData)
      const res = await this.$api.search.searchByImg(result.data.data)
      this.pictureList = res.data.data || []
      this.loading = false
    },
    searchType (type) {
      const param = {
        type,
        id: this.value
      }
      this.$api.search
        .getExists(param)
        .then(res => {
          if (res.data.data) {
            if (type === 'artist') {
              this.$router.push(`/artist/${this.value}`)
            } else if (type === 'illust') {
              this.$router.push(`/detail/${this.value}`)
            }
          } else {
            this.$createDialog({
              type: 'alert',
              title: '不存在',
              icon: 'cubeic-alert'
            }).show()
          }
        })
    }
  },
  activated () {
    // ?
    this.$refs.scroll && this.$refs.scroll.refresh()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Detail' || to.name === 'Artist') {
      // 去详情和作者页面 (前进) 不需销毁
      next()
    } else {
      // 返回排行页 清除缓存并销毁该组件 (后退)
      let cache = this.$vnode.parent.componentInstance.cache
      let keys = this.$vnode.parent.componentInstance.keys
      delete cache['/search']
      let index = keys.indexOf('/search')
      keys.splice(index, 1)
      this.$destroy()
      next()
    }
  },
  watch: {
    value () {
      this.getKeyword()
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@/style/color.styl'
.search
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background-color #ffffff
  z-index 100
  font-size 16px
  .search-header
    display flex
    align-items center
    justify-content space-between
    padding 12px 16px 16px
    box-sizing border-box
    >i
      flex-basis 40px
      position relative
      &:after
        content ''
        position absolute
        top -10px
        right -10px
        bottom -10px
        left 0
    .menu
      text-align right
    .input
      flex 1
      font-size 16px
      box-sizing border-box
      position relative
      >input
        // flex 1
        width 100%
        border none
        // font-size 16px
        box-sizing border-box
        height 40px
        padding 0 25px 0 9px
        border-radius 5px
        background-color rgb(245, 245, 245)
        color rgb(31, 31, 31)
      >i
        position absolute
        top 12px
        right 5px
        &:after
          content ''
          position absolute
          top -10px
          right -10px
          bottom -10px
          left -10px
      .save
        position absolute
        width 40px
        height 40px
        top 0
        right 0
        opacity 0
        >input
          width 100%
          height 100%
  .search-btn
    position fixed
    top 370px
    left 0
    right 0
    margin 5px 15px
    // width 50%
    display flex
    justify-content center
    align-items center
    height 40px
  .search-suggest
    width 100%
    position absolute
    top 80px
    height 300px
    overflow scroll
    .suggest-item
      width 100%
      padding 9px 12px 9px 16px
      display flex
      align-items center
      justify-content space-between
      box-sizing border-box
      .tag
        color #adadad
        font-size 16px
      i
        font-size 24px
        position relative
        &:after
          content ''
          position absolute
          top -10px
          right -10px
          bottom -10px
          left -10px
    .suggest-no
      text-align center
      color $primary
      font-size 20px
  .search-content
    width 100%
    position absolute
    top 70px
    bottom 0
    left 0
    // 要在这里设置样式 组件内无效
    .scroll
      .horizontal-scroll
        .cube-scroll-content
          display inline-block
</style>
