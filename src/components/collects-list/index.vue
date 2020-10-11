<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>{{ title }}</v-card-title>
        <v-divider />
        <v-card-text style="height: 300px;">
          <v-list>
            <v-list-item @click="addCollects">
              <v-list-item-avatar>
                <svg font-size="30" class="icon" aria-hidden="true">
                  <use xlink:href="#pictianjia1" />
                </svg>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>新建画集</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="item in list"
              :key="item.id"
              @click="clickItem(item.id)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: '收藏到画集'
    },
    background: {
      type: String,
      default: 'rgba(255, 255, 255, 0.95)'
    }
  },
  data() {
    return {
      dialogm1: '',
      dialog: false,
      list: []
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    this.collectionsDigest();
  },
  methods: {
    handleClick() {
      this.$router.back();
      this.$emit('handleClick');
    },
    show() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    collectionsDigest() {
      this.$api.collections
        .collectionsDigest(this.user.id)
        .then(res => {
          this.list = res.data.data || [];
        });
    },
    addCollects() {
      console.log('add');
    },
    clickItem(id) {
      this.$emit('clickItem', id);
    }
  }
};
</script>

<style lang="stylus" scoped>
.header
  position relative
  z-index 102
  .header-container
    position relative
    top 0
    padding 5px 10px
    height 50px
    width 100%
    display flex
    line-height 40px
    box-sizing border-box
    color #333
    font-size 16px
    transition top .2s
    >svg
      position absolute
      left 5px
      top 15px
      font-size 20px
      width 20px
    >h1
      font-size 18px
      font-weight 700
      margin 0 auto
</style>
