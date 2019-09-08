<template>
  <div class="pop-search">
    <div class="pop-search__header">
      <TextInput
        class="pop-search__search"
        v-on:blur="popSearch"
        v-on:enter="popSearch" />
      <div class="pop-search__tag">
        <router-link
          v-for="(item, index) in tagsList"
          :key="index"
          :to="{ name: 'PopSearch', query: { keyword: item.tag } }"
        >
          <p>{{ item.tag }}</p>
          <p v-if="item.tag_translation" class="sub">
            {{ item.tag_translation }}
          </p>
        </router-link>
      </div>
    </div>
    <div class="pop-search__content">
      <div class="pop-search__list">
        <div
          class="pop-search__list--item"
          v-for="(item, index) in pictureList"
          :key="index"
        >
          <img
            @click="preview(item.meta_pages, item)"
            v-if="item.meta_pages.length"
            v-lazy="item.meta_pages[0].image_urls.large"
            alt=""
          />
          <img
            @click="preview(item.meta_single_page.original_image_url, item)"
            v-else
            v-lazy="item.meta_single_page.large_image_url"
            alt=""
          />
          <p class="pop-search__list--item-title">{{ item.title }}</p>
          <div v-if="item.page_count > 1" class="pop-search__list--item-count">
            <img src="@/assets/images/count.svg" alt="" />
            <span>{{ item.page_count }}</span>
          </div>
        </div>
      </div>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="isBottom"
        infinite-scroll-distance="10"
        class="rank__more"
      >
        <div v-if="isBottom" class="rank__more--bottom">
          (￣ˇ￣)俺也是有底线的
        </div>
      </div>
    </div>
    <img-dialog :images="images" :info="info" :isShow.sync="isShow" />
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'
import imgDialog from '@/components/Dialog'

export default {
  name: 'PopSearch',
  props: {
    keyword: {
      require: true,
      type: String
    }
  },
  components: {
    imgDialog,
    TextInput
  },
  data () {
    return {
      searchKey: '',
      tagsList: [],
      pictureList: [],
      images: [],
      info: {},
      isShow: false,
      isBottom: false,
      page: {
        tag: 0,
        picture: 0
      }
    }
  },
  watch: {
    keyword: {
      handler (val) {
        if (val) {
          this.pictureList = []
          this.getTags()
          this.getSearch()
        }
      },
      immediate: true
    }
  },
  mounted () {
    if (!this.keyword) {
      this.$router.push('/')
    } else {
      this.searchKey = this.keyword
    }
  },
  methods: {
    popSearch (keyword) {
      if (keyword) {
        this.$router.push({
          path: '/popSearch',
          query: { keyword }
        })
      }
    },
    getSearch (page = 0) {
      this.$api.rank
        .getSearch({ keyword: this.keyword, page })
        .then(({ data: { data } }) => {
          this.page.picture = page
          if (data) {
            this.pictureList = this.pictureList.concat(data)
          }
        })
    },
    getTags () {
      const page = 0
      this.tagsList = []
      this.$api.rank
        .getTags({ keyword: this.keyword, page })
        .then(({ data: { data } }) => {
          this.page.tag = page
          if (data) {
            this.tagsList = this.tagsList.concat(data)
          }
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
    loadMore () {
      this.pictureList.length !== 0 && this.getSearch(this.page.picture + 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pop-search
  display block
  background-color white
  box-sizing border-box
  padding-top 20px
  min-height 100vh
  &__search
    display block
    background #33a3dc4d
    width 300px
    height 50px
    border-radius 6px
    margin 0 auto
    font-size 20px
    color white
    height auto
  &__tag
    position relative
    display flex
    overflow-x scroll
    margin 20px
    height 60px
    a
      display block
      float left
      text-align center
      padding 10px
      background $primary
      border-radius 4px
      + a
        margin-left 8px
    p
      white-space nowrap
      font-size 16px
      color white
      + p
        margin-top 8px
      &:last-child
        margin-right 10px
    .sub
      font-size 10px
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
      margin 10px 4px
      -moz-page-break-inside avoid
      -webkit-column-break-inside avoid
      break-inside avoid
      box-shadow 0 1px 3px rgba(0, 0, 0, .3)
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
</style>
