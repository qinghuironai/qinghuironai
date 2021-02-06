<template>
  <div
    id="scroll-target"
    ref="scroll"
    class="artist-collect"
  >
    <Header title="我的关注" />
    <v-list
      v-scroll:#scroll-target="onScroll"
      subheader
      class="list"
    >
      <v-list-item
        v-for="item in artistList"
        :key="item.id"
        @click="$router.push({ name: 'Artist', params: { artistId: item.id }})"
      >
        <v-list-item-avatar>
          <img :src="item.avatar | replaceBig">
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
        </v-list-item-content>
        <v-btn color="primary" small @click.stop="follow(item)">
          {{ item.isFollowed ? '关注中' : '+关注' }}
        </v-btn>
      </v-list-item>
      <infinite-loading @infinite="infinite" />
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import Header from '@/components/header/Header';
import Toast from '@/components/toast';

export default {
  name: 'ArtistCollect',
  components: {
    InfiniteLoading,
    Header
  },
  data() {
    return {
      artistList: [],
      listMap: new Map(),
      page: 1,
      scrollTop: 0
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
  activated() {
    this.$refs.scroll.scrollTop = this.scrollTop;
  },
  methods: {
    infinite($state) {
      this.$api.user
        .getFollowArtist({
          page: this.page++,
          userId: this.user.id
        })
        .then(res => {
          const { data: { data }} = res;
          if (!data) {
            $state.complete();
          } else {
            for (const item of data) {
              // item.avatar = IMG_PREFIX + item.avatar;
              const data = {
                ...item,
                isFollowed: true
              };
              this.artistList.push(data);
              this.listMap.set(data.id, data);
            }
            $state.loaded();
          }
        });
    },
    follow(val) {
      const data = {
        artistId: val.id,
        userId: this.user.id,
        username: this.user.username
      };
      if (val.isFollowed) {
        val.isFollowed = false;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: false })
          .then(res => {
            console.log('取消关注成功');
          })
          .catch(() => {
            val.isFollowed = true;
            Toast({ content: '取消关注失败' });
          });
      } else {
        val.isFollowed = true;
        this.$store.dispatch('handleFollowArtist', { ...data, follow: true })
          .then(res => {
            console.log('关注成功');
          })
          .catch(() => {
            val.isFollowed = false;
            Toast({ content: '关注失败' });
          });
      }
    },
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    }
  }
};
</script>

<style lang="stylus" scoped>
.artist-collect
  width 100%
  min-height 100%
  overflow scroll
  background #fff
</style>
