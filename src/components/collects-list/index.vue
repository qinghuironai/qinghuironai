<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="80%">
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
    <v-dialog
      v-model="dialog2"
      max-width="90%"
    >
      <v-card>
        <v-card-title>
          <span class="headline">新建画集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="titles" label="请输入画集标题" required />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="caption" label="请输入画集简介" />
              </v-col>
              <v-switch v-model="isPublic" class="ma-2" label="公开画集" />
              <v-switch v-model="forbidComment" class="ma-2" label="允许评论" />
              <v-switch v-model="pornWarning" class="ma-2" label="R16内容" />
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog2 = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="createCollects">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <v-dialog
      v-model="dialog3"
      max-width="90%"
    >
      <v-card>
        <v-card-title>
          <span class="headline">新建画集</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-autocomplete
              v-model="model"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              chips
              clearable
              hide-details
              hide-selected
              multiple
              item-text="tagName"
              item-value="tagName"
              label="Search for a coin..."
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    Search for your favorite
                    <strong>Cryptocurrency</strong>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <template v-slot:selection="{ attr, on, item, selected }">
                <v-chip
                  v-bind="attr"
                  :input-value="selected"
                  close
                  color="blue-grey"
                  class="white--text"
                  v-on="on"
                  @click:close="remove(item)"
                >
                  <v-icon left>mdi-coin</v-icon>
                  <span v-text="item.tagName" />
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title>{{ item.tagName }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog3 = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="dialog3 = false">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-row>
</template>

<script>
import Toast from '@/components/toast';
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
      dialog2: false,
      dialog3: false,
      isLoading: false,
      titles: null,
      caption: null,
      isPublic: 0,
      forbidComment: 0,
      pornWarning: 0,
      model: null,
      search: null,
      items: [],
      list: []
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    search(val) {
      this.isLoading = true;
      this.$api.collections
        .getTags({ keyword: this.search })
        .then(res => {
          this.items = res.data.data;
        })
        .finally(() => (this.isLoading = false));
    }
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
      this.dialog2 = true;
    },
    clickItem(id) {
      this.$emit('clickItem', id);
    },
    createCollects() {
      this.$api.collections
        .createCollects({
          username: this.user.username,
          title: this.titles,
          caption: this.caption,
          isPublic: Number(this.isPublic),
          forbidComment: Number(this.forbidComment),
          pornWarning: Number(this.pornWarning)
        })
        .then(res => {
          if (res.status === 200) {
            this.dialog2 = false;
            this.collectionsDigest();
            this.$emit('comfirm');
          }
          Toast({ content: res.data.message });
        });
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
