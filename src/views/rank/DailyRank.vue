<template>
  <div class="rank">
    <List
      :list="pictureList"
      :identifier="identifier"
      @infinite="infinite"
    >
      <Header @selectMode="selectMode" @selectDate="selectDate" />
    </List>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import List from '@/components/virtual-list/VirtualList';
import Header from './header/Header';

export default {
  name: 'DailyRank',
  components: {
    List,
    Header
  },
  data() {
    return {
      page: 1,
      mode: 'day',
      date: null,
      pictureList: [],
      identifier: +new Date()
    };
  },
  mounted() {
    this.date = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD');
  },
  methods: {
    infinite($state) {
      this.$api.rank
        .getRank({
          page: this.page++,
          date: this.date,
          mode: this.mode
        })
        .then(res => {
          if (!res.data.data.data.length) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data.data);
            $state.loaded();
          }
        });
    },
    resetData() {
      this.page = 1;
      this.pictureList = [];
      this.identifier += 1;
    },
    selectDate(date) {
      this.date = date;
      this.resetData();
    },
    selectMode(selectedVal) {
      this.mode = selectedVal;
      this.resetData();
    }
  }
};
</script>

<style lang="stylus" scoped>
.rank
  font-size 16px
  position relative
</style>
