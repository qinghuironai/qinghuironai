<template>
  <transition>
    <div class="search">
      <div class="search-header">
        <svg
          font-size="20"
          class="icon"
          aria-hidden="true"
          @click="$router.back()"
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
      <div v-if="isSearch" class="search-suggest">
        <div
          v-for="(item, index) in keywords"
          :key="index"
          class="suggest-item"
        >
          <div class="tag" @click="enter(item)">
            {{ item }}
          </div>
        </div>
        <div v-show="!keywords.length && this.value" class="suggest-no">
          (●'◡'●)ﾉ
        </div>
      </div>
      <div v-else class="search-content">
        <List
          :list="pictureList"
          :identifier="identifier"
          @infinite="infinite"
        >
          <Tags :data="[...tags, ...exclusive]" @handleClick="clickTag" />
        </List>
      </div>
      <div v-show="value && isSearch" class="search-btn">
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
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <svg font-size="20" class="icon" aria-hidden="true">
                <use xlink:href="#picfanhui1" />
              </svg>
            </v-btn>
            <v-toolbar-title>显示选项</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-list three-line subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>画作类型</v-list-item-title>
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-list-item-subtitle v-on="on">{{ optionsParams.illustType }}</v-list-item-subtitle>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in type"
                      :key="index"
                      @click="illustType = item.value"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>搜索类型</v-list-item-title>
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-list-item-subtitle v-on="on">{{ optionsParams.searchType }}</v-list-item-subtitle>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in searchTypes"
                      :key="index"
                      @click="searchType = item.value"
                    >
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>发布时间</v-list-item-title>
                <v-bottom-sheet v-model="showDate">
                  <template v-slot:activator="{ on }">
                    <v-list-item-subtitle v-on="on">{{ optionsParams.beginDate + ' - ' + optionsParams.endDate }}</v-list-item-subtitle>
                  </template>
                  <v-sheet class="text-center">
                    <v-date-picker
                      v-model="date"
                      full-width
                      no-title
                      color="#b9eee5"
                      locale="zh-cn"
                      multiple
                      @input="selectDate"
                    />
                  </v-sheet>
                </v-bottom-sheet>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>最小宽度</v-list-item-title>
                <v-text-field
                  v-model="minWidth"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>最小高度</v-list-item-title>
                <v-text-field
                  v-model="minHeight"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                />
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="user.username === 'pixivic'">
              <v-list-item-content>
                <v-list-item-title>其它</v-list-item-title>
                <v-checkbox
                  v-model="xRestrict"
                  label="xRestrict"
                  :false-value="0"
                  :true-value="1"
                />
                <v-text-field
                  v-model="maxSanityLevel"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  placeholder="maxSanityLevel"
                />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import debounce from 'lodash/debounce';
import Tags from '@/components/tags/Tags';
import List from '@/components/virtual-list/VirtualList';
import Loading from '@/components/loading/Loading';
import Alert from '@/components/alert';

export default {
  name: 'Search',
  components: {
    Tags,
    List,
    Loading
  },
  data() {
    return {
      value: '',
      isSearch: true,
      keywords: '',
      pictureList: [],
      page: 1,
      tags: [],
      exclusive: [],
      loading: false,
      identifier: +new Date(),
      dialog: false,
      type: [{ text: '插画', value: 'illust' }, { text: '漫画', value: 'manga' }],
      searchTypes: [{ text: '原始', value: 'original' }, { text: '自动翻译', value: 'autoTranslate' }],
      date: [],
      showDate: false,
      illustType: 'illust',
      searchType: 'original',
      minWidth: 0, // 最小宽度
      minHeight: 0, // 最小高度
      beginDate: null, // 画作发布日期限制
      endDate: null, // 画作发布日期限制
      xRestrict: 0,
      maxSanityLevel: 6,
      backgroundImage: null
    };
  },
  computed: {
    optionsParams() {
      const data = {
        illustType: this.illustType,
        searchType: this.searchType,
        minWidth: 0,
        minHeight: 0,
        beginDate: this.date[0] || '',
        endDate: this.date[1] || '',
        xRestrict: this.xRestrict, // 0关 1开
        maxSanityLevel: this.maxSanityLevel // 16禁
      };
      Object.keys(data).forEach(item => {
        if (!data[item]) { delete data[item]; }
      });
      return data;
    },
    allTags() {
      return [...this.tags, ...this.exclusive];
    },
    ...mapGetters(['user'])
  },
  watch: {
    value() {
      this.getKeyword();
    }
  },
  mounted() {
    const { tag } = this.$route.query;
    if (tag) {
      this.value = tag;
      this.enter(tag);
    }
  },
  methods: {
    getKeyword: debounce(function() {
      this.$api.search.getKeyword(this.value)
        .then(({ data: { data }}) => {
          this.keywords = data.keywordList || [];
        });
    }, 500),
    enter(val) {
      if (!this.value) return;
      this.value = val;
      this.$refs.input.blur();
      this.isSearch = false;

      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;

      this.getTags(val);
      this.getExclusive(val);
    },
    getTags(param) {
      this.$api.search
        .getTags(param)
        .then(res => {
          this.tags = res.data.data || [];
        });
    },
    getExclusive(param) {
      this.$api.search
        .getExclusive(param)
        .then(res => {
          this.exclusive = res.data.data || [];
        });
    },
    focus() {
      this.isSearch = true;
    },
    translateKeyword() {
      this.$api.search
        .getTranslations(this.value)
        .then(res => {
          this.enter(res.data.data.keyword);
        });
    },
    clickTag(val) {
      this.value = val.keyword;
      this.tags = this.exclusive = [];
      this.getTags(val.keyword);
      this.getExclusive(val.keyword);
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
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
              this.$router.push(`/detail/${this.value}`);
            }
          } else {
            Alert({
              content: '不存在'
            });
          }
        });
    },
    infinite($state) {
      this.$api.search
        .getSearch({
          ...this.optionsParams,
          page: this.page++,
          keyword: this.value
        })
        .then(res => {
          const data = res.data.data;
          if (!data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(data);
            $state.loaded();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    selectDate(val) {
      if (val.length > 2) {
        this.date.shift();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/color.styl'
.search
  z-index 100
  font-size 16px
  background #fff
  // overflow scroll
  width 100%
  height 100vh
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
  .search-content
   // width 100%
    // height 100vh
    //overflow scroll
    // width 100%
    // position absolute
    // top 70px
    // bottom 0
    // left 0
    // // 要在这里设置样式 组件内无效
    // .scroll
    // .horizontal-scroll
    // .cube-scroll-content
    // display inline-block
</style>
