<template>
  <div
    id="scroll-target"
    ref="scroll"
    class="spotlight"
  >
    <v-row v-scroll:#scroll-target="onScroll" dense>
      <v-col
        v-for="item in list"
        :key="item.id"
        cols="12"
        class="mb-2"
        @click="goSpot(item.id)"
      >
        <v-card>
          <v-img
            :src="item.thumbnail"
            class="white--text align-end"
            height="200px"
          >
            <v-card-title style="font-size: 16px;" v-text="item.title" />
          </v-img>
          <v-card-actions>
            <div
              style="width: 100%;"
              class="pa-1 d-flex align-center justify-space-between"
            >
              <v-chip color="primary">{{ item.subcategoryLabel }}</v-chip>
              <span>{{ item.publishDate }}</span>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <infinite-loading @infinite="infinite" />
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'SpotLight',
  components: {
    InfiniteLoading
  },
  data() {
    return {
      page: 1,
      list: [],
      scrollTop: 0
    };
  },
  activated() {
    this.$refs.scroll.scrollTop = this.scrollTop;
  },
  methods: {
    infinite($state) {
      this.$api.spot
        .getSpotLights({
          page: this.page++
        })
        .then(res => {
          const { data: { data }} = res;
          if (!data) {
            $state.complete();
          } else {
            this.list = this.list.concat(data);
            $state.loaded();
          }
        });
    },
    goSpot(id) {
      this.$router.push(`/spot/${id}`);
    },
    onScroll(e) {
      this.scrollTop = e.target.scrollTop;
    }
  }
};
</script>

<style scoped lang="stylus">
.spotlight
  width 100vw
  min-height 100vh
  overflow scroll
  background #fff
  padding 5px 15px
  box-sizing border-box
</style>
