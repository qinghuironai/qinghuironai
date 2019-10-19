<template>
  <div class="pop-search">
    <div class="pop-search__header">
      <text-input
        :preset="keyword"
        class="pop-search__search"
        v-on:enter="popSearch"
      />
      <div
        class="pop-search__tag"
        v-if="!tagEmptyFlag"
      >
        <router-link
          :key="index"
          :to="{ name: 'PopSearch', query: { keyword: item.keyword } }"
          v-for="(item, index) in tagsList"
        >
          <p>{{ item.keyword }}</p>
          <p
            class="sub"
            v-if="item.keywordTranslated"
          >{{ item.keywordTranslated }}</p>
        </router-link>
      </div>
      <!-- <div -->
        <!-- v-else -->
        <!-- class="pop-search__tag" -->
      <!-- >😞No results found.</div> -->
    </div>
    <pic-list
      :pictureList="pictureList"
      @loadMore="loadMore"
    ></pic-list>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TextInput from '@/components/TextInput'
import PicList from '@/components/PicList'

export default {
  name: 'PopSearch',
  props: {
    keyword: {
      require: true,
      type: String
    }
  },
  components: {
    PicList,
    TextInput
  },
  data () {
    return {
      // tagList为空 为true
      tagEmptyFlag: false,
      loading: true,
      searchKey: '',
      pictureList: [],
      tagsList: [],
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
          this.getTags()
          this.getSearch()
        }
      },
      immediate: true
    },
    loading: {
      handler (val) {
        val && this.$aMsg.loading('loading...')
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
    popSearch: debounce(function (keyword) {
      if (keyword) {
        this.$router.push({
          path: '/popSearch',
          query: { keyword }
        })
      }
    }, 500),
    getSearch (page = 1) {
      this.loading = true
      this.$api.search
        .getSearch({ keyword: this.keyword, page })
        .then(({ data: { data } }) => {
          this.page.picture = page
          if (data) {
            const width = (window.innerWidth - 20) / 2
            this.pictureList = this.pictureList.concat(
              data.map(e => ({
                ...e,
                imageUrls: e.imageUrls.map(img => ({
                  ...img,
                  large: img.large.replace('_webp', '')
                })),
                style: { height: `${(e.height / e.width) * width}px` }
              }))
            )
          }
          this.loading = false
        })
        .catch(err => {
          this.$aMsg.error(err)
          this.loading = false
          this.isBottom = true
        })
    },
    getTags () {
      this.tagsList = []
      this.$api.search.getTags(this.keyword).then(({ data: { data } }) => {
        if (data) {
          this.tagsList = data
          this.tagEmptyFlag = data.length === 0
        }
      })
    },
    loadMore: debounce(function () {
      // this.pictureList.length !== 0 && this.getSearch(this.page.picture + 1)
    }, 1000)
  }
}
</script>

<style lang="stylus" scoped>
.pop-search {
  display: block;
  background-color: white;
  box-sizing: border-box;
  padding-top: 20px;
  min-height: 100vh;

  &__search::v-deep input {
    display: block;
    box-sizing: border-box;
    background: #ffffff;
    width: 100%;
    height: 50px;
    border: 1px solid #33a3dc4d;
    border-radius: 6px;
    margin: 0 auto;
    font-size: 20px;
    color: black;
    height: auto;
  }

  &__tag {
    position: relative;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    overflow-x: scroll;
    margin: 20px;
    height: 60px;
    font-size: 1.4rem;
    // border-radius: 1rem;
    // border: 1px solid #33a3dc4d;
    line-height: 60px;

    a {
      display: block;
      float: left;
      text-align: center;
      padding: 10px;
      background: $primary;
      border-radius: 4px;

      + a {
        margin-left: 8px;
      }
    }

    p {
      white-space: nowrap;
      font-size: 16px;
      color: white;

      + p {
        margin-top: 8px;
      }

      &:last-child {
        margin-right: 10px;
      }
    }

    .sub {
      font-size: 10px;
    }
  }

  &__list {
    display: flex;
    padding-top: 2px;

    .col {
      position: relative;
      width: 50%;
    }

    &--wrapper {
      position: relative;
      padding: 10px 4px;
    }

    &--item {
      position: relative;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      border-radius: 0.3rem;
      overflow: hidden;

      img {
        width: 100%;
      }

      &-title {
        line-height: 0.8rem;
        text-align: center;
        padding: 0.2rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #666666;
        font-size: 0.8rem;
      }

      &-count {
        position: absolute;
        top: 0.4rem;
        right: 0.4rem;
        background-color: #0000009e;
        padding: 0.2rem;
        border-radius: 0.25rem;

        img {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.2rem;
          vertical-align: middle;
        }

        span {
          color: #fff;
          vertical-align: middle;
          line-height: 1.25rem;
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
