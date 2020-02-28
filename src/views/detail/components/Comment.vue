<template>
  <transition enter-active-class="animated slideInUp">
    <div v-if="showComment" class="comments">
      <div class="comments-popup">
        <div class="popup-title-container">
          <div class="popup-title">
            评论
            <div class="popup-close" @click="close">
              <svg font-size="24" class="icon" aria-hidden="true">
                <use xlink:href="#picguanbi7" />
              </svg>
            </div>
          </div>
        </div>
        <div class="popup-content">
          <Scroll>
            <div class="popup-content-inside">
              <List :list="commentList" @reply="reply" />
            </div>
          </Scroll>
        </div>
        <div class="popup-input">
          <div class="input-emoji">
            <svg font-size="30" class="icon" aria-hidden="true">
              <use xlink:href="#picbiaoqing" />
            </svg>
          </div>
          <div class="input-container">
            <form>
              <textarea
                ref="input"
                v-model="value"
                maxlength="140"
                :placeholder="placeholder"
                @input="handleInput"
              />
            </form>
            <div class="input-send" @click="submitComment">
              <svg font-size="30" class="icon" aria-hidden="true">
                <use xlink:href="#picfasong" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from '@/components/scroll/Scroll';
import { mapGetters } from 'vuex';
import Alert from '@/components/alert';
import List from './List';
const INPUT_HEIGHT = 40;

export default {
  components: {
    Scroll,
    List
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showComment: false,
      value: '',
      commentList: [],
      placeholder: '添加评论...',
      replyParam: {}
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    show() {
      this.showComment = true;
      this.getCommentsList();
    },
    close() {
      this.showComment = false;
    },
    submitComment() {
      if (!this.value) {
        return Alert({
          content: '请输入评论内容~'
        });
      }
      let data = {
        commentAppType: 'illusts',
        commentAppId: this.pid,
        parentId: 0, // 父级评论id,顶级就是0
        replyTo: 0, // 回复者，没有就是0
        replyFromName: this.user.username, // 评论者用户名
        replyToName: '', // 回复者用户名
        content: this.value// 内容
      };
      data = Object.assign(data, this.replyParam);
      this.$api.comment.makeComments(data)
        .then(res => {
          if (res.status === 200) {
            const params = { ...data, createDate: new Date(), replyFrom: this.user.id };
            if (params.parentId === 0) {
              this.commentList.push(params);
            } else {
              const item = this.commentList.find(item => item.id === params.parentId);
              if (item.subCommentList) {
                item.subCommentList.push(params);
              } else {
                item.subCommentList = [params];
              }
            }
            this.value = '';
            this.placeholder = '';
            this.replyParam = {};
            this.$emit('reply', this.commentList);
          }
        });
    },
    handleInput() {
      const input = this.$refs.input;
      input.style.height = input.scrollTop + INPUT_HEIGHT + 'px';
    },
    reply({ id, val }) {
      console.log(id, val);
      this.replyParam = {
        parentId: id,
        replyTo: val.replyFrom,
        replyToName: val.replyFromName
      };
      this.placeholder = '回复: ' + val.replyFromName;
      this.$refs.input.focus();
    },
    getCommentsList() {
      this.$api.comment.getComments({
        commentAppType: 'illusts',
        commentAppId: this.pid
      })
        .then(res => {
          if (res.status === 200) {
            this.commentList = res.data.data || [];
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.comments
  position fixed
  top 0
  right 0
  left 0
  width 100%
  height 100%
  overflow hidden
  background-color #fff
  z-index 1000
  &-popup
    position absolute
    top 0
    bottom 0
    left 0
    width 100%
    background-color #fff
    .popup-title-container
      height 48px
      color rgb(31, 31, 31)
      .popup-title
        line-height 24px
        text-align center
        font-size 16px
        font-weight 700
        position relative
        z-index 1
        padding 12px 0
        color rgb(31, 31, 31)
        .popup-close
          position fixed
          width 46px
          top 0
          right 0
          padding 12px 0
    .popup-content
      position fixed
      top 48px
      right 0
      bottom 0
      left 0
      padding 16px 16px 80px
      box-sizing border-box
      &-inside
        width 100%
    .popup-input
      width 100%
      height 80px
      position fixed
      bottom 0
      left 0
      padding 0 16px
      box-sizing border-box
      display flex
      align-items center
      background #fff
      z-index 102
      .input-emoji
        flex-basis 30px
        margin-right 5px
      .input-container
        flex 1
        display flex
        align-items center
        width 100%
        box-sizing border-box
        form
          flex 1
          textarea
            width 100%
            background none
            outline none
            border none
            box-sizing border-box
            max-height 80px
            line-height 24px
            min-height 40px
            height 40px
            padding 8px
            text-align left
            font-weight 400
            color #666
        .input-send
          flex-basis 30px
</style>
