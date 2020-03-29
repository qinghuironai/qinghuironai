<template>
  <div class="list">
    <div v-for="item in list" :key="item.id" v-ripple class="list-item">
      <a class="profile-img">
        <v-avatar size="40" @click="goUsers(item.replyFrom)">
          <v-img :src="item.replyFrom | replaceAvatar" />
        </v-avatar>
      </a>
      <a>
        <div class="user-name">{{ item.replyFromName }}</div>
      </a>
      <div class="comment-text f-caption-s">
        <span class="comment-text">{{ item.content }}</span>
      </div>
      <div class="status-bar">
        <div class="time">{{ item.createDate | formatDate }}</div>
        <div class="reply">
          <span @click="reply(item.id, item)">回复</span>
        </div>
      </div>
      <div class="comment-replies">
        <div v-for="val in item.subCommentList" :key="val.id" v-ripple class="list-item">
          <a class="profile-img">
            <v-avatar size="40" @click="goUsers(val.replyFrom)">
              <v-img :src="val.replyFrom | replaceAvatar" />
            </v-avatar>
          </a>
          <a>
            <div class="user-name">{{ val.replyFromName }}</div>
          </a>
          <div class="comment-text f-caption-s">
            <span class="comment-text">@{{ val.replyToName }}: {{ val.content }}</span>
          </div>
          <div class="status-bar">
            <div class="time">{{ val.createDate | formatDate }}</div>
            <div class="reply">
              <span @click="reply(item.id, val)">回复</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatDate(time) {
      const date = new Date(time);
      const M = date.getMonth() + 1;
      const D = date.getDate();
      return `${M < 10 ? '0' + M : M}-${D < 10 ? '0' + D : D}`;
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    reply(id, val) {
      this.$emit('reply', { id, val });
    },
    goUsers(id) {
      const userId = this.$store.getters.user.id;
      if (id === userId) return;
      this.$router.push(`/users/${id}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
.list
  .list-item
    position relative
    padding-left 48px
    margin 16px 0
    display block
    min-width 60%
    min-height 50px
    box-sizing border-box
    .profile-img
      position absolute
      top 0
      left 0
      width 40px
      height 40px
    a
      .user-name
        color #2c333c
        font-size 12px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        max-width 100%
        line-height 16px
        font-weight 700
        display inline-block
        vertical-align middle
    .comment-text
      padding 0 0 4px
      word-wrap break-word
    .f-caption-s
      line-height 16px
      font-size 12px
      font-weight 400
    .status-bar
      display flex
      font-weight 400
      font-size 10px
      text-align left
      line-height 14px
      margin-top 10px
      .time
        color #adadad
      .reply
        margin-left 16px
        span
          color #3d7699
          user-select none
    .comment-replies
      font-size 12px
</style>
