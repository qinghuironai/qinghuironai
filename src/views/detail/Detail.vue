<template>
  <transition
    enter-active-class="animated zoomIn"
    leave-active-class="animated rollOut"
    :duration="200"
  >
    <div v-if="illustDetail" class="detail">
      <List :list="pictureList" @infinite="infinite">
        <div class="detail-top">
          <v-toolbar
            class="elevation-0"
            :height="illustDetail.itemHeight"
            dark
            prominent
            :src="illustDetail.src"
            @click="preview = true"
          >
            <v-btn icon @click.stop="$router.back()">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer />
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-app-bar-nav-icon @click.stop v-on="on" />
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  @click="clickMenu(item.val)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
          <div class="detail-info">
            <h2 class="text-no-wrap text-truncate">{{ illustDetail.title }}</h2>
            <p class="caption" v-html="illustDetail.caption" />
            <div class="tags">
              <span v-for="(item, index) in illustDetail.tags" :key="index" class="caption tag">
                <a>{{ item.name }}</a>
                <a>{{ item.translatedName }}</a>
              </span>
            </div>
            <div class="work-stats">
              <a class="work-stats-a">
                <v-icon size="16">iconfont icon-yanjing</v-icon>
                <span>{{ illustDetail.totalView }}</span>
              </a>
              <a class="work-stats-a">
                <v-icon size="16">iconfont icon-xihuan</v-icon>
                <span>{{ illustDetail.totalBookmarks }}</span>
              </a>
            </div>
            <v-divider />
            <div class="user">
              <router-link :to="`/artist/${illustDetail.artistId}`" class="text-no-wrap text-truncate">
                <v-avatar>
                  <v-img :src="illustDetail.avatarSrc" alt="avatar" />
                </v-avatar>
                <span>{{ illustDetail.artistPreView.name }}</span>
              </router-link>
              <v-btn color="primary" rounded>+加关注</v-btn>
            </div>
          </div>
        </div>
      </List>
      <div v-if="preview" class="detail-preview">
        <v-carousel
          height="100vh"
          hide-delimiter-background
          hide-delimiters
          show-arrows-on-hover
        >
          <v-carousel-item v-for="(item, i) in imgs" :key="i">
            <v-row class="fill-height" align="center" justify="center">
              <img width="100%" :src="item">
            </v-row>
          </v-carousel-item>
        </v-carousel>
        <v-btn
          color="pink"
          dark
          small
          fixed
          top
          right
          fab
          @click="preview = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script>
import List from '@/components/virtual-list/VirtualList';
import { IMG_PREFIX } from '@/util/constants';

export default {
  name: 'Detail',
  components: {
    List
  },
  props: {
    pid: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      pictureList: [],
      illustDetail: null,
      page: 1,
      preview: false,
      items: [
        { val: 'origin', title: '跳转原图链接' },
        { val: 'share', title: '分享' },
        { val: 'more', title: '更多' }
      ]
    };
  },
  computed: {
    imgs() {
      return this.illustDetail.imageUrls.reduce((pre, cur) => {
        return pre.concat(`${IMG_PREFIX + cur.original}`);
      }, []);
    }
  },
  mounted() {
    this.getIllustDetail();
  },
  methods: {
    getIllustDetail() {
      this.$api.detail
        .reqIllustDetail(this.pid)
        .then(res => {
          const data = res.data.data;
          this.illustDetail = {
            ...data,
            itemHeight: parseInt((data.height / data.width) * document.body.clientWidth),
            src: IMG_PREFIX + data.imageUrls[0].large.replace('_webp', ''),
            avatarSrc: IMG_PREFIX + data.artistPreView.avatar
          };
        });
    },
    infinite($state) {
      this.$api.detail
        .reqRelatedIllust({
          page: this.page++,
          illustId: this.pid
        })
        .then(res => {
          if (!res.data.data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data);
            $state.loaded();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    clickMenu(id) {
      switch (id) {
        case 'origin': {
          window.open(`https://www.pixiv.net/artworks/${this.pid}`);
          break;
        }
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/style/color.styl'
.detail
  background-size contain
  // width 100vw
  background-color #fff
  z-index 3
  font-size 16px
  &-info
    padding 5px 10px
    // width 100vw
    overflow hidden
    >.caption
      word-wrap break-word
      margin-top 5px
    .user
      display flex
      align-items center
      margin 10px 0
      a
        flex 1
        span
          margin-left 10px
          color rgba(0, 0, 0, 0.88)
    .tags
      .tag
        a:first-child
          color $primary
          margin-right 4px
          &::before
            content '#'
        a:last-child
          color #adadad
          margin-right 8px
    .work-stats
      margin-top 10px
      &-a
        margin-right 10px
        span
          font-size 12px
          margin-left 2px
          color rgba(0, 0, 0, 0.32)
  &-preview
    position fixed
    top 0
    left 0
    right 0
    height 100vh
    overflow scroll
    background #fff
    >>>.v-carousel
      overflow-y scroll !important
    >>>.v-responsive
      overflow-y scroll !important
</style>
