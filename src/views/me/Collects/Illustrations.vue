<template>
  <div class="spot">
    <List ref="list" :list="pictureList" ownpress @infinite="infinite" @press="press">
      <Header title="画集作品" />
    </List>
  </div>
</template>

<script>
import List from '@/components/virtual-list/VirtualList';
import Header from '@/components/header/Header';
import Confirm from '@/components/confirm';

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
    },
    async press(id) {
      const res = await Confirm({
        title: '确认从该画集删除该画作吗?'
      });
      if (res === 'submit') {
        this.$api.collections.deleteCollects(id)
          .then(res => {
            if (res.status === 200) {
              const index = this.pictureList.findIndex(item => item.id === id);
              if (index > -1) {
                this.pictureList.splice(index, 1);
                this.$refs.list.waterFall();
              }
            }
          });
      }
    }
  }
};
</script>

<style>
</style>
