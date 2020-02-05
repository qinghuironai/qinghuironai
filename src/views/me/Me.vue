<template>
  <div class="me">
    <div class="me-header">
      <v-card
        class="header-box"
        width="95%"
        outlined
      >
        <div class="link">
          <v-avatar class="user-avatar" size="80">
            <v-img :src="user.avatar" alt="Avatar" />
          </v-avatar>
          <div class="user-info">
            <p class="font-weight-bold text-no-wrap text-truncate">{{ user.username }}</p>
            <div class="info-tabs">
              <router-link to="" class="tab">
                <span>0</span>
                <p>消息</p>
              </router-link>
              <router-link to="" class="tab">
                <span>0</span>
                <p>关注</p>
              </router-link>
              <router-link to="" class="tab">
                <span>0</span>
                <p>粉丝</p>
              </router-link>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    <v-list class="me-lists">
      <v-list-item
        v-for="item in list"
        :key="item.val"
        @click="$router.push(item.val)"
      >
        <v-list-item-icon>
          <svg font-size="20" class="icon" aria-hidden="true">
            <use :xlink:href="item.icon" />
          </svg>
        </v-list-item-icon>
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
export default {
  name: 'Me',
  data() {
    return {
      list: [
        { icon: '#picshoucang-copy-copy-copy', text: '我的收藏', val: '/collect' },
        { icon: '#picicon-copy', text: '我的关注', val: '/artistCollect' },
        { icon: '#piclianjie-copy', text: '关于我们', val: '' }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
};
</script>

<style scoped lang="stylus">
.me
  width 100%
  height 100%
  position relative
  background-color #fff
  &-header
    overflow hidden
    background url('../../assets/images/header.png') no-repeat
    background-size 100%
    // 937 283
    .header-box
      margin 60px auto 10px
      border-radius 20px
      .link
        position relative
        height 100%
        .user-avatar
          position absolute
          top -30px
          left 30px
        .user-info
          padding-top 20px
          text-align center
          >p
            margin-left 120px
            text-align left
          .info-tabs
            display flex
            .tab
              flex 1
              p
                color #5e5e5e
</style>

