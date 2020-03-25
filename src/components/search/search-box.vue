<template>
  <div v-show="showSearchBox" class="search-box">
    <div class="search-header">
      <svg
        font-size="20"
        class="icon"
        aria-hidden="true"
        @click="changeSearchBox"
      >
        <use xlink:href="#picfanhui1" />
      </svg>
      <div class="input">
        <input
          ref="input"
          v-model="value"
          placeholder="(●'◡'●)ﾉ關鍵字の輸入"
          @keyup.enter="enter(value)"
          @focus="focus"
        >
        <!-- <i class="iconfont icon-xiangji1" /> -->
        <svg font-size="30" class="icon" aria-hidden="true">
          <use xlink:href="#picxiangji1-copy" />
        </svg>
        <div class="save">
          <input
            id="uploads"
            type="file"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event)"
          >
        </div>
      </div>
      <svg
        font-size="20"
        class="icon"
        aria-hidden="true"
        @click="dialog = true"
      >
        <use xlink:href="#picshezhi" />
      </svg>
    </div>
    <div class="search-suggest">
      <div
        v-for="(item, index) in keywords"
        :key="index"
        class="suggest-item"
      >
        <div class="tag" @click="enter(item)">
          {{ item }}
        </div>
      </div>
      <div v-show="!keywords.length && value" class="suggest-no">
        (●'◡'●)ﾉ
      </div>
    </div>

    <div v-show="value" class="search-btn">
      <v-btn class="mr-2" @click="translateKeyword">
        翻译并搜索
      </v-btn>
      <v-btn class="mr-2" @click="searchOne('artist')">
        用户搜索
      </v-btn>
      <v-btn @click="searchOne('illust')">
        画作搜索
      </v-btn>
    </div>

    <div v-if="loading" class="search-img">
      <img :src="backgroundImage">
      <Loading style="background: transparent" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import debounce from 'lodash/debounce';
import Alert from '@/components/alert';
import Loading from '@/components/loading/Loading';

export default {
  components: {
    Loading
  },
  data() {
    return {
      value: '',
      diglog: false,
      keywords: '',
      backgroundImage: '',
      loading: false
    };
  },
  computed: {
    ...mapGetters(['showSearchBox'])
  },
  watch: {
    value() {
      this.getKeyword();
    }
  },
  methods: {
    ...mapMutations(['SHOW_SEARCH_BOX']),
    changeSearchBox() {
      this.SHOW_SEARCH_BOX(false);
    },
    getKeyword: debounce(function() {
      this.$api.search.getKeyword(this.value)
        .then(({ data: { data }}) => {
          this.keywords = data.keywordList || [];
        });
    }, 500),
    enter(tag) {
      if (!tag) return;
      this.$router.push({
        name: 'Search',
        query: {
          tag
        }
      });
      this.SHOW_SEARCH_BOX(false);
    },
    focus() {

    },
    translateKeyword() {
      this.$api.search
        .getTranslations(this.value)
        .then(res => {
          this.enter(res.data.data.keyword);
        });
    },
    searchOne(type) {
      const param = {
        type,
        id: this.value
      };
      this.$api.search
        .getExists(param)
        .then(res => {
          if (res.data.data) {
            if (type === 'artist') {
              this.$router.push(`/artist/${this.value}`);
            } else if (type === 'illust') {
              this.$store.dispatch('setDetail', null);
              this.$router.push(`/detail/${this.value}`);
            }
          } else {
            Alert({
              content: '不存在'
            });
          }
        });
    },
    async uploadImg(e) {
      const file = e.target.files[0];
      if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
        Alert({
          content: '请选择正确图片格式'
        });
        return false;
      }
      if (file.size > 1 * 1024 * 1024) {
        Alert({
          content: '图片大小不能超过1M'
        });
        return false;
      }
      const reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.backgroundImage = data;
      };
      reader.readAsArrayBuffer(file);
      this.loading = true;
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const result = await this.$api.search.uploadImg(formData);
      const res = await this.$api.search.searchByImg(result.data.data);
      const { data: { data }} = res;
      if (data) {
        this.$router.push(`/detail/${data[0].id}`);
      } else {
        Alert({
          content: res.data.message
        });
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.search-box
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  background #fff
  z-index 9999
  .search-header
    display flex
    align-items center
    justify-content space-between
    padding 12px 16px 16px
    box-sizing border-box
    svg
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
        padding 0 32px 0 9px
        border-radius 5px
        background-color rgb(245, 245, 245)
        color rgb(31, 31, 31)
      >svg
        position absolute
        top 5px
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
  .search-img
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    img
      width 100%
      height 100%
      object-fit cover
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
        width 100%
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
</style>
