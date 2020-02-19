<template>
  <div class="rank">
    <List
      v-touch="{
        left: () => swipe('Left'),
        right: () => swipe('Right')
      }"
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
      mode: null,
      date: null,
      maxDate: null,
      pictureList: [],
      identifier: +new Date()
    };
  },
  mounted() {
    this.date = this.maxDate = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD');
    this.mode = 'day';
    const flag = JSON.parse(localStorage.getItem('pixivic_alert'));
    if (flag) {
      alert('图片域名更新，如果有使用图片加速的同学请前往论坛获取最新规则，有问题请qq群: 726504516，点击确认关闭');
    }
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
    },
    swipe(direction) {
      if (direction === 'Left') {
        if (this.date === this.maxDate) return;
        this.date = dayjs(this.date).add(1, 'day').format('YYYY-MM-DD');
      } else if (direction === 'Right') {
        this.date = dayjs(this.date).subtract(1, 'day').format('YYYY-MM-DD');
      }
      this.resetData();
      this.$store.dispatch('changeTab', true);
    }
  }
};
</script>

<style lang="stylus" scoped>
.rank
  position relative
  font-size 16px
</style>
