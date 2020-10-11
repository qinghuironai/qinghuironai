<template>
  <div class="spot">
    <List :list="pictureList" @infinite="infinite">
      <Header title="画集作品" />
    </List>
  </div>
</template>

<script>
import List from '@/components/virtual-list/VirtualList';
import Header from '@/components/header/Header';

export default {
  name: 'Illustrations',
  components: {
    List,
    Header
  },
  props: {
    id: {
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
  methods: {
    infinite($state) {
      this.$api.collections
        .getIllustrations({
          collectoinId: this.id,
          page: this.page++
        })
        .then(res => {
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

<style>
</style>
