<template>
  <List
    :list="artistList"
    :height="height"
    @infinite="infinite"
    @resize="resize"
  >
    <v-subheader>关注画师列表</v-subheader>
    <template v-slot:cell="props">
      <div class="item-container">
        <div class="artist-illust">
          <div
            v-for="(item, index) in props.data.recentlyIllustrations"
            :key="index"
            class="illust-item"
          >
            <div class="img-item" @click="goDetail(item)">
              <v-img
                :src="item.imageUrls[0].squareMedium | replaceImg"
                :style="{filter: (item.xrestrict === 1 || item.sanityLevel > 5) ? `blur(20px)` : ''}"
                width="100%"
                height="100%"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-3" />
                  </v-row>
                </template>
              </v-img>
              <div class="mask" />
            </div>
          </div>
        </div>
        <v-list-item class="user-item" @click="handleClick(props.data.id)">
          <v-list-item-avatar>
            <v-img class="grey lighten-2" :src="props.data.avatar | replaceBig" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="props.data.name" />
          </v-list-item-content>
          <v-btn color="primary" small @click.stop="follow(props.data)">
            {{ props.data.isFollowed ? '关注中' : '+关注' }}
          </v-btn>
        </v-list-item>
      </div>
    </template>
  </List>
</template>

<script>
import { mapGetters } from 'vuex';
import { getClient } from '@/util/dom';
import Alert from '@/components/alert';
import List from '@/components/list/List';

export default {
  name: 'ArtistCollect',
  components: {
    List
  },
  filters: {
    replaceImg(val) {
      return 'https://img.cheerfun.dev:233/c/360x360_70/img-master' + val.split('img-master')[1];
    }
  },
  data() {
    return {
      artistList: [],
      listMap: new Map(),
      page: 1,
      userId: null,
      height: 0
    };
  },
  computed: {
    ...mapGetters(['user', 'followStatus'])
  },
  watch: {
    followStatus(val) {
      const { artistId, follow } = val;
      const item = this.listMap.get(artistId);
      if (item) {
        this.$set(item, 'isFollowed', follow);
      }
    }
  },
  created() {
    this.resize();
  },
  mounted() {
    const { userId } = this.$route.query;
    this.userId = userId || this.user.id;
  },
  methods: {
    infinite($state) {
      this.$api.user
        .getArtists({
          page: this.page++,
          userId: this.userId
        })
        .then(res => {
          const { data: { data }} = res;
          if (!data) {
            $state.complete();
          } else {
            for (const item of data) {
              this.artistList.push(item);
              this.listMap.set(item.id, item);
            }
          }
          $state.loaded();
        });
    },
    follow(item) {
      const val = this.listMap.get(item.id);
      const data = {
        artistId: val.id,
        userId: this.user.id,
        username: this.user.username
      };
      if (val.isFollowed) {
        val.isFollowed = false;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {})
          .catch(() => {
            val.isFollowed = true;
            Alert({
              content: '取消关注失败'
            });
          });
      } else {
        val.isFollowed = true;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {})
          .catch(() => {
            val.isFollowed = false;
            Alert({
              content: '关注失败'
            });
          });
      }
    },
    handleClick(id) {
      this.$router.push(`/artist/${id}`);
    },
    resize() {
      this.height = (getClient().width - 16) / 3 + 100;
      for (const item of this.artistList) {
        item.height = this.height;
      }
    },
    goDetail(data) {
      this.$store.dispatch('setDetail', data);
      this.$router.push(`/detail/${data.id}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
.item-container
  box-sizing border-box
  margin-bottom 20px
  height 100%
  .artist-illust
    width 100%
    display flex
    .illust-item
      position relative
      width calc((100vw - 16px) / 3)
      height calc((100vw - 16px) / 3)
      .img-item
        width 100%
        height 100%
      .mask
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        width 100%
        height 100%
        background-image linear-gradient(to right, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))
  .user-item
    padding 0
    box-sizing border-box
    margin 8px 16px
</style>
