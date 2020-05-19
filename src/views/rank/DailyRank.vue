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
    <a v-if="isAndroid" class="download" href="https://lanzous.com/ics37qb" download="pixivic">下载App</a>
    <a v-if="isiOS" class="download" href="https://apps.apple.com/cn/app/pixivic/id1508873995">下载App</a>
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
  computed: {
    isAndroid() {
      return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1;
    },
    isiOS() {
      return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
  },
  mounted() {
    this.date = this.maxDate = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD');
    this.mode = 'day';
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
          if (!res.data.data) {
            $state.complete();
          } else {
            this.pictureList = this.pictureList.concat(res.data.data);
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
  .download
    position fixed
    bottom 90px
    left 0
    right 0
    margin auto
    width 97px
    background #fc7085
    color #fff
    border-radius 25px
    padding 5px
    text-align center
    box-shadow 0 4px 8px 0 rgba(32, 32, 32, .15)
    user-select none
</style>
