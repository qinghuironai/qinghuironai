<template>
  <List
    :list="artistList"
    @infinite="infinite"
  >
    <v-subheader>关注画师列表</v-subheader>
    <template v-slot:cell="props">
      <v-list-item @click="handleClick(props.data.id)">
        <v-list-item-avatar>
          <v-img class="grey lighten-2" :src="props.data.avatar" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="props.data.name" />
        </v-list-item-content>
        <v-btn color="primary" small @click.stop="follow(props.data)">
          {{ props.data.isFollowed ? '关注中' : '+关注' }}
        </v-btn>
      </v-list-item>
    </template>
  </List>
</template>

<script>
import { mapGetters } from 'vuex';
import { replaceBigImg } from '@/util';
import Alert from '@/components/alert';
import List from '@/components/list/List';

export default {
  name: 'ArtistCollect',
  components: {
    List
  },
  data() {
    return {
      artistList: [],
      listMap: new Map(),
      page: 1,
      userId: null
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
  mounted() {
    const { userId } = this.$route.query;
    this.userId = userId || this.user.id;
  },
  methods: {
    infinite($state) {
      this.$api.user
        .getFollowArtist({
          page: this.page++,
          userId: this.userId
        })
        .then(res => {
          const { data: { data }} = res;
          if (!data) {
            $state.complete();
          } else {
            for (const item of data) {
              const data = {
                ...item,
                avatar: replaceBigImg(item.avatar)
              };
              this.artistList.push(data);
              this.listMap.set(data.id, data);
            }
            $state.loaded();
          }
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
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
