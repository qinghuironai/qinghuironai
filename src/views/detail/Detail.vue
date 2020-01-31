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
            <Like :like="illustDetail.isLiked" @handleLike="handleLike" />
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
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '@/components/virtual-list/VirtualList';
import Like from '@/components/like/Like';
import { IMG_PREFIX } from '@/util/constants';

export default {
  name: 'Detail',
  components: {
    List,
    Like
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
    },
    handleLike() {
      if (!this.user.id) {
        return alert('请先登录~');
      }
      // 注意这里有两个List列表 一个排行 一个相关作品 都会触发List里面的watch
      // 而这个列表不一定有当前作品 List需要watch里面判断下
      const params = {
        userId: this.user.id,
        illustId: this.illustDetail.id
      };
      if (!this.illustDetail.isLiked) {
        this.illustDetail.isLiked = true;
        this.$store.dispatch('handleCollectIllust', params)
          .then(() => {
            console.log('收藏成功');
          })
          .catch(err => {
            this.illustDetail.isLiked = false;
            alert('收藏失败', err);
          });
      } else {
        this.illustDetail.isLiked = false;
        this.$store.dispatch('deleteCollectIllust', params)
          .then(() => {
            console.log('取消收藏成功');
          })
          .catch(err => {
            this.illustDetail.isLiked = true;
            alert('取消收藏失败', err);
          });
      }
    },
    follow() {
      const data = {
        artistId: this.illustDetail.artistPreView.id,
        userId: this.user.id
      };
      if (!this.illustDetail.artistPreView.isFollowed) {
        this.illustDetail.artistPreView.isFollowed = true;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {
            console.log('关注成功');
          })
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = false;
            alert('关注失败');
          });
      } else {
        this.illustDetail.artistPreView.isFollowed = false;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {
            console.log('取消关注成功');
          })
          .catch(() => {
            this.illustDetail.artistPreView.isFollowed = true;
            alert('取消关注失败');
          });
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
