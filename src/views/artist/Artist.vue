<template>
  <transition enter-active-class="animated zoomIn">
    <div v-if="artistDetail" class="artists">
      <Header title="画师详情" @handleClick="handleClick" />
      <List
        :list="pictureList"
        :identifier="identifier"
        @infinite="infinite"
      >
        <div class="list-header">
          <div class="avatar">
            <v-avatar :size="80">
              <img :src="`${artistDetail.avatarSrc}`" alt="">
            </v-avatar>
          </div>
          <div class="artists-info">
            <p class="name">{{ artistDetail.name }}</p>
            <v-btn
              class="mb-5"
              color="primary"
              rounded
              width="75%"
              max-width="300"
              @click="follow"
            >
              {{ artistDetail.isFollowed ? '已关注' : '+加关注' }}
            </v-btn>
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
          </div>
          <v-tabs centered grow>
            <v-tab v-if="illustSum" @click="getList('illust')">
              插画
              <span>({{ illustSum }})</span>
            </v-tab>
            <v-tab v-if="mangaSum" @click="getList('manga')">
              漫画
              <span>({{ mangaSum }})</span>
            </v-tab>
          </v-tabs>
        </div>
      </List>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/header/Header';
import List from '@/components/virtual-list/VirtualList';
import { IMG_PREFIX } from '@/util/constants';

export default {
  name: 'Artist',
  components: {
    Header,
    List
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
      page: 1,
      type: 'illust',
      identifier: +new Date(),
      illustSum: 0,
      mangaSum: 0,
      pictureList: []
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      if (val.artistId === this.artistDetail.id) {
        this.artistDetail.isFollowed = val.follow;
      }
    }
  },
  mounted() {
    this.getArtistInfo();
    this.getSummary();
  },
  methods: {
    getArtistInfo() {
      this.$api.detail
        .reqArtist(this.artistId)
        .then(res => {
          this.artistDetail = {
            ...res.data.data,
            avatarSrc: IMG_PREFIX + res.data.data.avatar
          };
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
    handleClick() {
      this.$router.back();
    },
    infinite($state) {
      this.$api.detail
        .reqArtistIllust({
          page: this.page++,
          artistId: this.artistId,
          type: this.type
        })
        .then(res => {
          if (res.data.data) {
            const { data: { data }} = res;
            this.pictureList = this.pictureList.concat(data);
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getList(type) {
      this.type = type;
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
    },
    follow() {
      const data = {
        artistId: this.artistDetail.id,
        userId: this.user.id
      };
      if (!this.artistDetail.isFollowed) {
        this.artistDetail.isFollowed = true;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {
            console.log('关注成功');
          })
          .catch(() => {
            this.artistDetail.isFollowed = false;
            alert('关注失败');
          });
      } else {
        this.artistDetail.isFollowed = false;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {
            console.log('取消关注成功');
          })
          .catch(() => {
            this.artistDetail.isFollowed = true;
            alert('取消关注失败');
          });
      }
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
  .list-header
    .avatar
      padding-top 50px
      text-align center
    .artists-info
      padding-top 15px
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
