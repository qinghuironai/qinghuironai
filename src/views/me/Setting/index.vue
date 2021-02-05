<template>
  <div class="setting">
    <Header title="设置" />
    <v-list class="setting-lists">
      <v-list-item @click="clickItem('email')">
        <v-list-item-content>
          <v-list-item-title>
            邮箱验证
            <span style="float: right;">{{ isCheckEmail ? '已验证' : '未验证' }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item @click="clickItem('qq')">
        <v-list-item-content>
          <v-list-item-title>
            绑定QQ
            <span style="float: right;">{{ isConnectQQ ? '已绑定' : '未绑定' }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item @click="sheet = true">
        <v-list-item-content>
          <v-list-item-title>
            瀑布流列数
            <span style="float: right;">{{ column }}</span>
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item @click="$router.push(`/avatar`)">
        <v-list-item-content>
          <v-list-item-title>
            更新头像
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#picyoujiantou" />
          </svg>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item @click="clickItem('age')">
        <v-list-item-content>
          <v-list-item-title>
            16
            <span style="float: right;">{{ isCheckAge ? '已开启' : '未开启' }}</span>
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

    <v-bottom-sheet v-model="sheet2">
      <v-sheet class="text-center">
        <v-list>
          <v-list-item
            v-for="item in columns2"
            :key="item.label"
            @click="selectColumn2(item)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ item.label }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">
          请先完成实名认证
        </v-card-title>
        <v-card-text class="text-center">
          <span>实名认证需认证兑换码（点击认证之前请确认信息准确，概不退款） <a href="https://mall.pixivic.net/product/8.html">点击获取</a></span>
        </v-card-text>
        <v-card-text class="text-center">
          <v-text-field
            v-model="name"
            label="姓名"
          />
          <v-text-field
            v-model="exchangeCode"
            label="认证码"
          />
          <v-text-field
            v-model="idCard"
            label="身份证"
          />
          <v-btn depressed color="success" @click="confirm">立即认证</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Header from '@/components/header/Header';
import { QQ_LINK } from '@/util/constants';
import Toast from '@/components/toast';
import Confirm from '@/components/confirm';
import { SET_BIND_PHONE } from '@/store/mutation-types';

export default {
  name: 'Setting',
  components: {
    Header
  },
  data() {
    return {
      sheet: false,
      sheet2: false,
      columns: ['自动', 1, 2, 3, 4],
      columns2: [
        {
          value: true,
          label: '开启'
        },
        {
          value: false,
          label: '关闭'
        }
      ],
      isCheckEmail: false,
      isConnectQQ: false,
      column: 1,
      isCheckAge: false,
      dialog: false,
      name: null,
      exchangeCode: null,
      idCard: null
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    this.$api.user.getEmailIsCheck(this.user.id)
      .then(res => {
        this.isCheckEmail = res.data.data;
      });
    this.$api.user.checkQQ(this.user.id)
      .then(res => {
        this.isConnectQQ = res.data.data;
      });

    const column = parseInt(localStorage.getItem('waterfull-column'));
    this.column = column || '自动';
    this.isCheckAge = JSON.parse(localStorage.getItem('lock_show') || null);
  },
  methods: {
    clickItem(val) {
      switch (val) {
        case 'email':
          if (!this.isCheckEmail) {
            this.$api.user.vertifyEmail(this.user.email)
              .then(res => {
                Toast({ content: res.data.message });
              });
          }
          break;
        case 'qq':
          if (!this.isConnectQQ) {
            window.location.href = QQ_LINK;
          }
          break;
        case 'age':
          if (!this.user.phone) {
            this.$store.commit(SET_BIND_PHONE, true);
          } else if (!this.user.ageForVerify) {
            this.dialog = true;
          } else {
            this.sheet2 = true;
          }
          break;
      }
    },
    selectColumn(val) {
      this.column = val;
      if (val === '自动') {
        localStorage.removeItem('waterfull-column');
      } else {
        localStorage.setItem('waterfull-column', val);
      }
      this.sheet = false;
    },
    selectColumn2(val) {
      this.isCheckAge = val.value;
      if (val.value) {
        localStorage.setItem('lock_show', val.value);
      } else {
        localStorage.removeItem('lock_show');
      }
      this.sheet2 = false;
    },
    async confirm() {
      if (!this.name || !this.exchangeCode || !this.idCard) {
        return Toast({ content: '请将信息填写完整' });
      }
      const res = await Confirm({
        title: '请确认信息无误哦，错误信息也会消耗认证码，确认无误后按确定即可认证'
      });
      if (res === 'submit') {
        this.$api.user.verifiedInfo({
          userId: this.user.id,
          name: this.name,
          exchangeCode: this.exchangeCode,
          idCard: this.idCard
      })
        .then(res => {
          if (res.status === 200) {
            this.$store.dispatch('setUser', res.data.data);
            this.dialog = false;
          }
          Toast({ content: res.data.message });
        });
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
