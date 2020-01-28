<template>
  <transition enter-active-class="animated zoomIn">
    <div v-if="artistDetail" class="artists">
      <Header ref="header" :title="title" @handleClick="handleClick" />
      <div
        ref="imgWrapper"
        class="artists__background"
        :style="{backgroundImage: `url(${artistDetail.avatarSrc})`}"
      >
        <div class="filter" />
      </div>
      <div ref="layer" class="artists__bglayer">
        <div ref="avatar" class="avatar">
          <v-avatar :size="80">
            <img :src="`${artistDetail.avatarSrc}`" alt="">
          </v-avatar>
        </div>
      </div>
      <div ref="scrollWrapper" class="artists__scroll">
        <Scroll :listen-scroll="true" @scroll="onScroll">
          <div>
            <div class="artists-info">
              <v-btn class="mb-5" color="primary" rounded width="35%">+加关注</v-btn>
              <p class="name">{{ artistDetail.name }}</p>
              <div class="link">
                <v-btn
                  :href="artistDetail.webPage"
                  text
                  icon
                  color="lighten-2"
                >
                  <v-icon>iconfont icon-home</v-icon>
                </v-btn>
                <v-btn
                  :href="artistDetail.twitterUrl"
                  text
                  icon
                  color="lighten-2"
                >
                  <v-icon>iconfont icon-ttww</v-icon>
                </v-btn>
              </div>
              <div class="friends">
                <span>
                  {{ artistDetail.totalFollowUsers }}
                  <span>关注</span>
                </span>
                <span>
                  {{ artistDetail.totalIllustBookmarksPublic }}
                  <span>好P友</span>
                </span>
              </div>
              <p class="caption">{{ artistDetail.comment }}</p>
              <div
                v-for="(val, index) in list"
                :key="index"
                class="mt-8"
              >
                <div v-if="val.list.length" class="d-flex justify-space-between align-center mb-1 px-3">
                  <h2 class="font-weight-bold" style="font-size: 18px;">{{ val.text }}</h2>
                  <span style="font-size: 14px;">
                    <router-link :to="{name: 'Artworks', params: {type: val.type}}" style="vertical-align: middle; color: grey;">
                      {{ val.sum }}件作品
                    </router-link>
                    <v-icon size="14" color="#b9eee5">iconfont icon-right</v-icon>
                  </span>
                </div>
                <v-row class="px-6">
                  <v-col
                    v-for="item in val.list"
                    :key="item.id"
                    class="d-flex child-flex pa-0"
                    cols="4"
                  >
                    <router-link :to="`/detail/${item.id}`">
                      <v-img
                        :src="item.imageUrls[0].medium | prefix"
                        aspect-ratio="1"
                        class="grey lighten-2"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular indeterminate color="grey lighten-5" />
                          </v-row>
                        </template>
                      </v-img>
                    </router-link>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </Scroll>
      </div>
      <router-view />
    </div>
  </transition>
</template>

<script>
import Header from '@/components/header/Header';
import Scroll from '@/components/scroll/Scroll';
import { IMG_PREFIX } from '@/util/constants';
const OFFSET = 10;
const HEADER_HEIGHT = 40;

export default {
  name: 'Artist',
  components: {
    Header,
    Scroll
  },
  filters: {
    prefix(val) {
      return IMG_PREFIX + val;
    }
  },
  props: {
    artistId: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      artistDetail: null,
      title: '画师详情',
      imgInitHeight: 0,
      scrollY: 0,
      page: 1,
      illustSum: 0,
      mangaSum: 0,
      illustList: [],
      mangaList: []
    };
  },
  computed: {
    list() {
      return [
        { type: 'illust', text: '插画作品', sum: this.illustSum, list: this.illustList },
        { type: 'manga', text: '漫画作品', sum: this.mangaSum, list: this.mangaList }
      ];
    }
  },
  mounted() {
    this.getArtistInfo();
    this.getList('illust');
    this.getList('manga');
    this.getSummary();
  },
  methods: {
    init() {
      this.imgInitHeight = this.$refs.imgWrapper.offsetHeight;
      this.$refs.scrollWrapper.style.top = `${this.imgInitHeight - OFFSET}px`;
      this.$refs.imgWrapper.style.zIndex = -1;
      this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET}px`;
    },
    getArtistInfo() {
      this.$api.detail
        .reqArtist(this.artistId)
        .then(res => {
          this.artistDetail = { ...res.data.data, avatarSrc: IMG_PREFIX + res.data.data.avatar };
          this.$nextTick(() => {
            this.init();
          });
        });
    },
    getSummary() {
      this.$api.detail
        .reqSummary(this.artistId)
        .then(res => {
          const { data: { data }} = res;
          for (const item of data) {
            if (item.type === 'illust') {
              this.illustSum = item.sum;
            } else if (item.type === 'manga') {
              this.mangaSum = item.sum;
            }
          }
        });
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
      const newY = pos.y;
      const percent = Math.abs(newY / this.imgInitHeight);
      const minScrollY = -this.imgInitHeight + HEADER_HEIGHT;
      if (newY > 0) {
        this.title = '画师详情';
        this.$refs.imgWrapper.style['transform'] = `scale(${1 + percent})`;
        this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET + newY}px`;
      } else if (newY > minScrollY) {
        this.$refs.layer.style.top = `${this.imgInitHeight - OFFSET - Math.abs(newY)}px`;
        this.$refs.layer.style.zIndex = 1;
        this.$refs.imgWrapper.style.paddingTop = '35%';
        this.$refs.imgWrapper.style.height = 0;
        this.$refs.imgWrapper.style.zIndex = -1;
        this.$refs.avatar.style['opacity'] = `${1 - percent * 2}`;
        this.$refs.avatar.style['transform'] = `scale(${1 - percent * 2})`;
      } else {
        this.title = this.artistDetail.name;
        this.$refs.layer.style.top = `${HEADER_HEIGHT - OFFSET}px`;
        this.$refs.layer.style.zIndex = 1;
        this.$refs.header.$refs.header.style.zIndex = 100;

        this.$refs.imgWrapper.style.height = `${HEADER_HEIGHT}px`;
        this.$refs.imgWrapper.style.paddingTop = 0;
        this.$refs.imgWrapper.style.zIndex = 99;
      }
    },
    handleClick() {
      this.$router.back();
    },
    getList(type) {
      this.$api.detail
        .reqArtistIllust({
          artistId: this.artistId,
          type,
          pageSize: 6
        })
        .then(res => {
          if (res.data.data) {
            const { data: { data }} = res;
            if (type === 'illust') {
              this.illustList = data;
            } else if (type === 'manga') {
              this.mangaList = data;
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="stylus" scope>
@import '~@/style/color.styl'
.artists
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100%
  z-index 3
  overflow hidden
  background #f2f3f4
  font-size 16px
  &__background
    position relative
    width 100%
    height 0
    padding-top 35%
    transform-origin top
    background-size cover
    z-index 60
    // filter blur(20px)
    .filter
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background rgba(7, 17, 27, 0.3)
  &__bglayer
    position absolute
    top 0
    bottom 0
    width 100%
    background #fff
    border-radius 10px
    z-index 50
    .avatar
      width 80px
      height 80px
      position absolute
      left 0
      right 0
      top -40px
      margin auto
      // img
      // width 100%
      // height 100%
      // border-radius 50%
  &__tabs
    position absolute
    top 0
    left 0
    width 100%
    height 50px
    background #fff
    border-radius 10px 10px 0 0
    z-index 100
  &__scroll
    position absolute
    // top 340px
    top 0
    left 0
    bottom 0
    right 0
    z-index 51
    .artists-info
      padding-top 60px
      text-align center
      .name
        font-size 20px
      .link
        display flex
        align-items center
        justify-content center
        margin-top 10px
        &-btn
          flex 1
      .friends
        font-size 14px
        margin-top 10px
        >span:first-child
          margin-right 20px
        >span
          span
            color #ccc
            margin-left 5px
      .caption
        padding 20px
        word-wrap break-word
</style>
