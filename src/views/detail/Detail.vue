<template>
  <div>
    <div v-if="illustDetail" class="detail animated zoomIn">
      <List :list="pictureList" @infinite="infinite">
        <div class="detail-top">
          <v-img
            class="grey lighten-2"
            :height="illustDetail.itemHeight"
            :src="illustDetail.src"
            :lazy-src="illustDetail.mediumSrc"
            :style="{filter: illustDetail.setu ? `blur(25px)` : ''}"
            @click="seePreview"
          >
            <Like :like="illustDetail.isLiked" @handleLike="handleLike" />
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
          <v-btn
            absolute
            top
            style="left: 0;top: 0;"
            icon
            @click.stop="$router.back()"
          >
            <svg font-size="20" class="icon" aria-hidden="true">
              <use xlink:href="#picfanhui" />
            </svg>
          </v-btn>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                absolute
                style="right: 0;top: 0;"
                @click.stop
                v-on="on"
              >
                <svg font-size="20" class="icon" aria-hidden="true">
                  <use xlink:href="#piccaidan" />
                </svg>
              </v-btn>
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
          <div class="detail-info">
            <h2 class="text-no-wrap text-truncate">{{ illustDetail.title }}</h2>
            <p class="caption" v-html="illustDetail.caption" />
            <div class="tags">
              <span
                v-for="(item, index) in illustDetail.tags"
                :key="index"
                class="caption tag"
                @click="searchByTag(item.name)"
              >
                <a>{{ item.name }}</a>
                <a>{{ item.translatedName }}</a>
              </span>
            </div>
            <div class="work-stats">
              <a class="work-stats-a">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#picyanjing" />
                </svg>
                <span>{{ illustDetail.totalView }}</span>
              </a>
              <a class="work-stats-a">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#picaixin" />
                </svg>
                <span>{{ illustDetail.totalBookmarks }}</span>
              </a>
              <a class="work-stats-a" @click="openComment">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#picliuyan" />
                </svg>
                <span>评论</span>
              </a>
              <a class="work-stats-a">
                <span>{{ illustDetail.createDate }}</span>
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
              <v-btn color="primary" rounded @click="follow">
                {{ illustDetail.artistPreView.isFollowed ? '已关注' : '+加关注' }}
              </v-btn>
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
          <svg font-size="20" class="icon" aria-hidden="true">
            <use xlink:href="#picguanbi7" />
          </svg>
        </v-btn>
      </div>
    </div>
    <Loading v-else />
    <Comment ref="comment" :pid="pid" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import List from '@/components/virtual-list/VirtualList';
import Like from '@/components/like/Like';
import Loading from '@/components/loading/Loading';
import Comment from './components/Comment';
import { IMG_PREFIX } from '@/util/constants';

export default {
  name: 'Detail',
  components: {
    List,
    Like,
    Loading,
    Comment
  },
  props: {
    pid: {
      required: true,
      type: [String, Number]
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
      ],
      like: false
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus']),
    imgs() {
      return this.illustDetail.imageUrls.reduce((pre, cur) => {
        return pre.concat(`${IMG_PREFIX + cur.original}`);
      }, []);
    }
  },
  watch: {
    // 详情去画师那里更改点赞状态 然后后退回来详情 状态也要变
    likeStatus(val, old) {
      const { illustId, like } = val;
      if (illustId === this.illustDetail.id) {
        this.illustDetail.isLiked = like;
      }
    },
    followStatus(val) {
      if (val.artistId === this.illustDetail.artistPreView.id) {
        this.illustDetail.artistPreView.isFollowed = val.follow;
      }
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
            src: IMG_PREFIX + data.imageUrls[0].original.replace('_webp', ''),
            avatarSrc: IMG_PREFIX + data.artistPreView.avatar,
            mediumSrc: IMG_PREFIX + data.imageUrls[0].medium,
            createDate: dayjs(data.createDate).format('YYYY-MM-DD HH:mm:ss'),
            setu: !!((data.xrestrict === 1 || data.sanityLevel > 5)) && this.user.username !== 'pixivic'
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
    },
    handleLike() {
      if (!this.user.id) {
        return alert('请先登录~');
      }
      const params = {
        userId: this.user.id,
        illustId: this.illustDetail.id
      };
      if (!this.illustDetail.isLiked) {
        this.illustDetail.isLiked = true;
        this.$store.dispatch('handleCollectIllust', params)
          .then(() => {})
          .catch(err => {
            this.illustDetail.isLiked = false;
            alert('收藏失败', err);
          });
      } else {
        this.illustDetail.isLiked = false;
        this.$store.dispatch('deleteCollectIllust', params)
          .then(() => {})
          .catch(err => {
            this.illustDetail.isLiked = true;
            alert('取消收藏失败', err);
          });
      }
    },
    follow() {
      if (!this.user.id) {
        return alert('请先登录~');
      }
      const data = {
        artistId: this.illustDetail.artistPreView.id,
        userId: this.user.id
      };
      if (!this.illustDetail.artistPreView.isFollowed) {
        this.illustDetail.artistPreView.isFollowed = true;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = false;
            alert('关注失败');
          });
      } else {
        this.illustDetail.artistPreView.isFollowed = false;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {})
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = true;
            alert('取消关注失败');
          });
      }
    },
    seePreview() {
      if (!this.illustDetail.setu) {
        this.preview = true;
      }
    },
    openComment() {
      if (this.user.id) {
        this.$refs.comment.show();
      } else {
        this.$router.push('/login');
      }
    },
    searchByTag(tag) {
      this.$router.push({
        name: 'Search',
        query: {
          tag
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~@/style/color.styl'
.detail
  background-size contain
  width 100%
  background-color #fff
  z-index 3
  font-size 16px
  &-info
    // padding 5px 10px
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
        user-select none
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
      user-select none
      &-a
        margin-right 10px
        span
          font-size 12px
          margin-left 2px
          color rgba(0, 0, 0, 0.32)
          vertical-align middle
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
