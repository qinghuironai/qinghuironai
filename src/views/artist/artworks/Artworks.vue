<template>
  <div class="artworks">
    <List :list="pictureList" @infinite="infinite" />
  </div>
</template>

<script>
import List from '@/components/virtual-list/VirtualList';

export default {
  name: 'Artworks',
  components: {
    List
  },
  filters: {
    filterType(val) {
      if (val === 'illust') {
        return '插画';
      } else if (val === 'manga') {
        return '漫画';
      }
    }
  },
  data() {
    return {
      pictureList: [],
      page: 1,
      artistId: '',
      type: ''
    };
  },
  mounted() {
    const { artistId, type } = this.$route.params;
    this.artistId = artistId;
    this.type = type;
  },
  methods: {
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
    }
  }
};
</script>

<style lang="stylus" scoped>
.artworks
  position fixed
  top 0
  z-index 999
  width 100vw
  height 100vh
  background-color #fff
</style>
