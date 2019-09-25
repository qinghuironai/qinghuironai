<template>
<div class="pic__content">
  <img-dialog :images="images" :info="info" :isShow.sync="isShow" />
  <div class="pic__list">
    <div class="col">
      <div
        class="pic__list--wrapper"
        v-for="(item, index) in leftList.list"
        :key="index"
        >
        <div class="pic__list--item">
          <img
            @click="preview(item)"
            v-lazy="
                    'https://img.pixivic.com:23334/get/' + item.imageUrls[0].large
                    "
            :style="item.style"
            alt=""
            />
          <p class="pic__list--item-title">{{ item.title }}</p>
          <div
            v-if="item.imageUrls.length > 1"
            class="pic__list--item-count"
            >
            <img src="@/assets/images/count.svg" alt="" />
            <span>{{ item.imageUrls.length }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="col">
      <div
        class="pic__list--wrapper"
        v-for="(item, index) in rightList.list"
        :key="index"
        >
        <div class="pic__list--item">
          <img
            @click="preview(item)"
            v-lazy="
                    'https://img.pixivic.com:23334/get/' + item.imageUrls[0].large
                    "
            :style="item.style"
            alt=""
            />
          <p class="pic__list--item-title">{{ item.title }}</p>
          <div
            v-if="item.imageUrls.length > 1"
            class="pic__list--item-count"
            >
            <img src="@/assets/images/count.svg" alt="" />
            <span>{{ item.imageUrls.length }}</span>
          </div>
        </div>
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
</template>

<script>
import imgDialog from '@/components/Dialog'

export default {
  name: 'PicList',
  props: {
    keyword: {
      require: true,
      type: String
    }
  },
  components: {
    imgDialog
  },
  data () {
    return {
      searchKey: '',
      pictureList: [],
      leftList: {
        height: 0
      },
      rightList: {
        height: 0,
        list: []
      },
      images: [],
      info: {},
      isShow: false,
      isBottom: false,
      page: {
        picture: 1
      }
    }
  },
  watch: {
    keyword: {
      handler (val) {
        if (val) {
          this.pictureList = []
          this.getSearch()
        }
      },
      immediate: true
    },
    pictureList: {
      handler (val, old) {
        if (val.length === 0) {
          this.leftList.height = 0
          this.leftList.list = []
          this.rightList.height = 0
          this.rightList.list = []
        } else {
          const list = val.filter(e => !old.includes(e))
          list.sort((a, b) => a.height >= b.height ? 1 : -1)
          console.log(list.map(e => e.height))
          for (var i = 0; i < list.length / 2; i++) {
            const a = list[i]
            const b = list[list.length - 1 - i]
            if (this.leftList.height <= this.rightList.height) {
              this.leftList.height += a.height + b.height
              this.leftList.list.push(a)
              this.leftList.list.push(b)
            } else {
              this.rightList.height += a.height + b.height
              this.rightList.list.push(a)
              this.rightList.list.push(b)
            }
          }
          console.log(this.leftList.height, this.rightList.height)
        }
      },
      deep: true,
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
    getSearch (page = 1) {
      this.$api.search
        .getSearch({ keyword: this.keyword, page })
        .then(({ data: { data } }) => {
          this.page.picture = page
          console.log('sadasds', this.page.picture)
          console.log(data)
          if (data) {
            const width = (window.innerWidth - 20) / 2
            this.pictureList = this.pictureList.concat(
              data.map(e => ({
                ...e,
                imageUrls: e.imageUrls.map(img => ({
                  ...img,
                  large: img.large.replace('_webp', '')
                })),
                height: (e.height / e.width) * width,
                style: { height: `${(e.height / e.width) * width}px` }
              }))
            )
          }
        })
    },
    preview (info) {
      this.info = info
      this.images = []
      this.images = info.imageUrls
      this.isShow = true
    },
    loadMore () {
      this.pictureList.length !== 0 && this.getSearch(this.page.picture + 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pic
  &__list
    display flex
    padding-top 2px
    .col
      position relative
      width 50%
    &--wrapper
      position relative
      padding 10px 4px
    &--item
      position relative
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
