<template>
  <div>
    <!-- <v-toolbar color="primary" dark>
      <v-btn absolute icon @click="$router.back()">
        <v-icon>iconfont icon-icon-test</v-icon>
      </v-btn>
      <v-toolbar-title class="mx-auto px-0">{{ type }}</v-toolbar-title>
    </v-toolbar> -->
    <List :list="pictureList" @infinite="infinite">
      <div :class="['header',{'show': showTab}]">
        <i class="iconfont icon-icon-test" @click="$router.back()" />
        <p>{{ type }}</p>
      </div>
    </List>
  </div>
</template>

<script>
import List from '@/components/virtual-list/VirtualList';
import { mapGetters } from 'vuex';

export default {
  name: 'Collect',
  components: {
    List
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      pictureList: [],
      page: 1
    };
  },
  computed: {
    ...mapGetters(['user', 'showTab'])
  },
  methods: {
    infinite($state) {
      this.$api.user
        .getCollectList({
          page: this.page++,
          type: this.type,
          userId: this.user.id
        })
        .then(res => {
          console.log(res);
          if (!res.data.data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data);
            $state.loaded();
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.header
  position relative
  height 50px
  width 100%
  background rgb(0, 150, 250)
  z-index 999
  i
    color #ffffff
    position absolute
    top 50%
    left 10px
    transform translateY(-50%)
    font-size 20px
  p
    text-align center
    line-height 50px
    color #ffffff
    font-size 22px
    margin 0 auto
.show
  position fixed
  top 0
  left 0
  right 0
</style>
