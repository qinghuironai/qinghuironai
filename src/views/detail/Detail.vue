<template>
  <div>
    <div v-if="illustDetail" class="detail animated zoomIn">
      <List :list="pictureList" @infinite="infinite">
        <div class="detail-top">
          <div class="detail-img">
            <img
              :height="illustDetail.itemHeight"
              :src="illustDetail.originalSrc"
              :style="imgStyle"
              @load="opacity = 1"
              @click="seePreview"
            >
            <Like
              :width="80"
              :like="illustDetail.isLiked"
              @handleLike="handleLike"
            />
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
          </div>
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
              <a class="work-stats-a">
                <span>{{ illustDetail.createDate }}</span>
              </a>
              <a class="work-stats-a stats-comment" @click="openComment">
                <svg font-size="30" class="icon" aria-hidden="true">
                  <use xlink:href="#picpinglun" />
                </svg>
              </a>
            </div>
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
            <v-divider />
            <div class="title">
              <h2>相关作品</h2>
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
          <v-carousel-item v-for="(item, i) in illustDetail.imgs" :key="i">
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
    <Comment ref="comment" :pid="pid" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import List from '@/components/virtual-list/VirtualList';
import Like from '@/components/like/Like';
import Comment from './components/Comment';
import { IMG_PREFIX } from '@/util/constants';

export default {
  name: 'Detail',
  components: {
    List,
    Like,
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
        { val: 'pixiv', title: '跳转pixiv' },
        { val: 'origin', title: '跳转图片链接' }
      ],
      like: false,
      opacity: 0
    };
  },
  computed: {
    ...mapGetters(['user', 'likeStatus', 'followStatus', 'detail']),
    imgStyle() {
      return {
        filter: this.illustDetail.setu ? `blur(25px)` : '',
        opacity: this.opacity
      };
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
    if (this.detail) {
      this.illustDetail = JSON.parse(JSON.stringify(this.detail));
    } else {
      this.getIllustDetail();
    }
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
            originalSrc: IMG_PREFIX + data.imageUrls[0].original.replace('_webp', ''),
            avatarSrc: IMG_PREFIX + data.artistPreView.avatar,
            createDate: dayjs(data.createDate).format('YYYY-MM-DD'),
            setu: !!((data.xrestrict === 1 || data.sanityLevel > 5)) && this.user.username !== 'pixivic',
            imgs: data.imageUrls.reduce((pre, cur) => {
              return pre.concat(`${IMG_PREFIX + cur.original}`);
            }, [])
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
        case 'pixiv':
          window.open(`https://www.pixiv.net/artworks/${this.pid}`);
          break;
        case 'origin':
          window.open(this.illustDetail.originalSrc);
          break;
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
        this.$store.dispatch('changeTab', false);
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
@import '~@/assets/style/color.styl'
.detail
  background-size contain
  width 100%
  background-color #fff
  z-index 3
  font-size 16px
  &-img
    position relative
    margin 0 -8px
    box-sizing border-box
    background-color grey
    overflow hidden
    img
      width 100%
      transition opacity .3s
      vertical-align bottom
      object-fit cover
  &-info
    padding 8px
    overflow hidden
    >.caption
      word-wrap break-word
      margin-top 5px
    .user
      display flex
      align-items center
      margin 14px 0
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
      margin 10px 0 15px
      user-select none
      position relative
      &-a
        margin-right 10px
        span
          font-size 12px
          margin-left 2px
          color rgba(0, 0, 0, 0.32)
          vertical-align middle
      .stats-comment
        position absolute
        right 0
    .title
      margin-top 12px
      h2
        font-size 18px
        color #333
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
