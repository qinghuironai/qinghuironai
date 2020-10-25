<template>
  <List
    :list="list"
    :height="270"
    :identifier="identifier"
    @infinite="infinite"
  >
    <v-tabs centered grow>
      <v-tab @click="getList(1)">
        公开
      </v-tab>
      <v-tab @click="getList(0)">
        私人
      </v-tab>
    </v-tabs>
    <template v-slot:cell="props">
      <v-list-item class="item" @click="clickItem(props.data.id)">
        <v-card width="100%">
          <v-img
            :src="avatar"
            class="white--text align-end grey lighten-2"
            height="200px"
          >
            <v-card-title style="font-size: 16px; background: rgba(0,0,0,0.1)" v-text="props.data.title" />
          </v-img>
          <v-card-actions>
            <div
              style="width: 100%;"
              class="pa-1 d-flex align-center justify-space-between"
            >
              <v-chip color="primary" class="text-no-wrap text-truncate" @click.stop="edit(props.data)">编辑</v-chip>
              <span>{{ props.data.createTime | dateFormat }}</span>
            </div>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </template>
    <svg
      font-size="60"
      class="icon"
      aria-hidden="true"
      style="position: fixed; z-index: 9999; bottom: 300px; right: 15px;"
      @click="openCollect"
    >
      <use xlink:href="#pictianjia" />
    </svg>
    <CollectsList ref="collects" title="我的画集" @clickItem="clickItem" @comfirm="getList(1)" />
  </List>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '@/components/list/List';
import CollectsList from '@/components/collects-list';

export default {
  name: 'Collects',
  components: {
    List,
    CollectsList
  },
  data() {
    return {
      page: 1,
      isPublic: 1,
      identifier: +new Date(),
      list: []
    };
  },
  computed: {
    ...mapGetters(['user', 'avatar'])
  },
  methods: {
    infinite($state) {
      this.$api.collections
        .getCollections({
          page: this.page++,
          userId: this.user.id,
          isPublic: this.isPublic
        })
        .then(res => {
          const { data: { data }} = res;
          if (!data) {
            $state.complete();
          } else {
            this.list = this.list.concat(data);
            $state.loaded();
          }
        });
    },
    getList(isPublic) {
      this.page = 1;
      this.list = [];
      this.isPublic = isPublic;
      this.identifier += 1;
    },
    edit(item) {
      this.$router.push(`/edit/${item.id}`);
    },
    openCollect() {
      this.$refs.collects.show();
    },
    clickItem(id) {
      this.$router.push(`/illustration/${id}`);
    }
  }
};
</script>

<style scoped lang="stylus">
.item
  width 100%
  height 100%
  padding 10px
</style>
