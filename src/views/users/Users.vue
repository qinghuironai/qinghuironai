<template>
  <div class="artist-container">
    <div v-if="userInfo" class="artists">

      <div class="list-header">
        <div class="avatar">
          <v-btn
            absolute
            top
            style="left: 0; top: 0; z-index: 2;"
            icon
            @click.stop="$router.back()"
          >
            <svg font-size="20" class="icon" aria-hidden="true">
              <use xlink:href="#picfanhui2" />
            </svg>
          </v-btn>
          <img
            class="avatar-top"
            :src="userInfo.id | replaceAvatar"
            width="100%"
            height="100%"
          >
          <v-avatar :size="80" style="margin-top: -50px;">
            <img :src="userInfo.id | replaceAvatar" alt>
          </v-avatar>
        </div>
        <div class="artists-info">
          <p class="name">{{ userInfo.username }}</p>
          <v-btn class="follow" text color="primary" @click="goFollower">Ta的关注</v-btn>
        </div>
      </div>

    </div>
    <Loading v-else />
  </div>
</template>

<script>
import Loading from '@/components/loading/Loading';

export default {
  name: 'Users',
  components: {
    Loading
  },
  props: {
    userId: {
      required: true,
      type: [String]
    }
  },
  data() {
    return {
      type: 'illust',
      userInfo: null
    };
  },
  mounted() {
    this.getUsersInfo();
  },
  methods: {
    getUsersInfo() {
      this.$api.user.getUsers(this.userId).then((res) => {
        const {
          data: { data }
        } = res;
        this.userInfo = data;
      });
    },
    goFollower() {
      this.$router.push({
        path: '/artistCollect',
        query: {
          userId: this.userId
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/style/color.styl';

.artist-container {
  width: 100%;
  height: 100%;

  .artists {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 3;
    overflow: hidden;
    background: #f2f3f4;
    font-size: 16px;

    .list-header {
      .avatar {
        position: relative;
        // padding-top: 50px;
        text-align: center;
        height: 25vh;
        margin: 0 -8px;
        box-sizing: border-box;

        .avatar-top {
          filter blur(10px)
          object-fit cover
        }
      }

      .artists-info {
        padding-top: 40px;
        text-align: center;

        .name {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .follow {
          text-transform: none;
        }

        .link {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;

          &-btn {
            flex: 1;
          }
        }

        .friends {
          font-size: 14px;
          margin-top: 10px;

          >span:first-child {
            margin-right: 20px;
          }

          >span {
            span {
              color: #ccc;
              margin-left: 5px;
            }
          }
        }

        .caption {
          padding: 20px;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>
