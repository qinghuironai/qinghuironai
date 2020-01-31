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
                <p>创作</p>
              </router-link>
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
    <div class="me-lists">
      <!-- <v-card outlined width="95%" class="lists-container"> -->
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-shoucang-copy-copy-copy</v-icon>
        </v-list-item-icon>
        <v-list-item-content @click="$router.push({name: 'Collect', params: {type: 'illust'}})">
          <v-list-item-title>插画收藏</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-shoucang-copy-copy-copy</v-icon>
        </v-list-item-icon>
        <v-list-item-content @click="$router.push({name: 'Collect', params: {type: 'manga'}})">
          <v-list-item-title>漫画收藏</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-icon-copy</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>我的关注</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-divider />
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-lianjie-copy</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>关于我们</v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="#b9eee5">iconfont icon-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <!-- </v-card> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Personal',
  data() {
    return {

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
    background url('../../../assets/images/header.png') no-repeat
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
  &-lists
    width 100%
    padding 10px
    .lists-container
      margin 5px auto
</style>
