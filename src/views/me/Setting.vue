<template>
  <div class="setting">
    <Header title="设置" />
    <v-list class="setting-lists">
      <v-list-item
        v-for="item in list"
        :key="item.val"
        @click="clickItem(item.val)"
      >
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/header/Header';

export default {
  name: 'Setting',
  components: {
    Header
  },
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      list: [
        { text: '邮箱验证', val: 'email' }
      ],
      dialog: false
    };
  },
  methods: {
    clickItem(val) {
      switch (val) {
        case 'email':
          this.$api.user.getEmailIsCheck(this.user.id)
            .then(res => {
              console.log(res);
            });
          break;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.setting
  &-lists
    margin-top 10px
</style>
