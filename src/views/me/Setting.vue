<template>
  <div class="setting">
    <Header title="设置" />
    <v-list class="setting-lists">
      <v-list-item
        v-for="item in lists"
        :key="item.val"
        @click="clickItem(item.val)"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
            <span v-if="item.show" style="float: right;">{{ item.show }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center">
        <v-list>
          <v-list-item
            v-for="item in columns"
            :key="item"
            @click="selectColumn(item)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/header/Header';
import { QQ_LINK } from '@/util/constants';

export default {
  name: 'Setting',
  components: {
    Header
  },
  data() {
    return {
      dialog: false,
      sheet: false,
      columns: ['自动', 1, 2, 3, 4],
      lists: {
        email: { text: '邮箱验证', val: 'email', show: '未验证' },
        qq: { text: '绑定QQ', val: 'qq', show: '未绑定' },
        waterfull: { text: '瀑布流列数', val: 'waterfull', show: '自动' },
        avatar: { text: '更新头像', val: 'avatar' }
      }
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    this.$api.user.getEmailIsCheck(this.user.id)
      .then(res => {
        if (!res.data.data) {
          this.lists.email.show = '未验证';
        } else {
          this.lists.email.show = '已验证';
        }
      });
    this.$api.user.checkQQ(this.user.id)
      .then(res => {
        if (!res.data.data) {
          this.lists.qq.show = '未绑定';
        } else {
          this.lists.qq.show = '已绑定';
        }
      });

    const column = parseInt(localStorage.getItem('waterfull-column'));
    if (column) {
      this.lists.waterfull.show = column;
    } else {
      this.lists.waterfull.show = '自动';
    }
  },
  methods: {
    clickItem(val) {
      switch (val) {
        case 'email':
          if (this.lists.email.show === '未验证') {
            this.$api.user.vertifyEmail(this.user.email)
              .then(res => {
                alert(res.data.message);
              });
          }
          break;
        case 'waterfull':
          this.sheet = true;
          break;
        case 'avatar':
          this.$router.push(`/${val}`);
          break;
        case 'qq':
          if (this.lists.qq.show === '未绑定') {
            window.location.href = QQ_LINK;
          }
          break;
      }
    },
    selectColumn(val) {
      this.lists.waterfull.show = val;
      if (val === '自动') {
        localStorage.removeItem('waterfull-column');
      } else {
        localStorage.setItem('waterfull-column', val);
      }
      this.sheet = false;
    }
  }
};
</script>

<style lang="stylus" scoped>
.setting
  &-lists
    margin-top 10px
</style>
