<template>
  <div v-if="bindphone" class="phone">
    <div class="overlay" @click.prevent="close" />
    <div class="popup">
      <v-card>
        <v-card-title class="headline">
          {{ title }}
        </v-card-title>
        <v-card-text class="text-center">
          <img :src="`data:image/bmp;base64,${imageBase64}`" width="60" height="30" @click.stop="getCode">
        </v-card-text>
        <v-card-text class="text-center">
          <span>先输入图形验证码和手机获取短信验证码，然后在输入短信验证码验证</span>
        </v-card-text>
        <v-card-text class="text-center">
          <v-text-field
            v-model="value"
            label="验证码（点击图像可改）"
            maxlength="4"
            :error-messages="valueErrors"
            @input="$v.value.$touch()"
            @blur="$v.value.$touch()"
          />
          <v-text-field
            v-model="phone"
            label="手机号"
            maxlength="11"
            :error-messages="phoneErrors"
            @blur="$v.phone.$touch()"
          />
          <v-text-field
            v-model="pvalue"
            label="短信验证码"
            maxlength="6"
            :error-messages="pvalueErrors"
            @input="$v.pvalue.$touch()"
            @blur="$v.pvalue.$touch()"
          />
          <v-btn style="margin-right: 3px;" depressed color="success" @click="getPhoneCode">获取短信验证码</v-btn>
          <v-btn depressed color="success" @click="confirmPhone">立即绑定</v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { debounceAsyncValidator } from '@/util';
import Toast from '@/components/toast';
import { mapGetters } from 'vuex';
import { SET_BIND_PHONE } from '@/store/mutation-types';

export default {
  mixins: [validationMixin],
  validations: {
    value: {
      required,
      minLength: minLength(4)
    },
    pvalue: {
      required,
      minLength: minLength(6)
    },
    phone: {
      required,
      isValid(value) {
        const patrn = /^[1]([3-9])[0-9]{9}$/;
        return patrn.test(value);
      },
      isUnique: debounceAsyncValidator(function(value, debounce) {
        if (!value) return true;
        if (!this.$v.phone.required || !this.$v.phone.isValid) return true;
        return debounce()
          .then(() => this.$api.user.checkPhone(value))
          .then(res => {
            return Boolean(res.status === 200);
          });
      }, 500)
    }
  },
  props: {
    title: {
      type: String,
      default: '验证你的手机'
    }
  },
  data() {
    return {
      imageBase64: '',
      value: '',
      phone: '',
      pvalue: '',
      vid: ''
    };
  },
  computed: {
    ...mapGetters(['user', 'bindphone', 'collectDigest']),
    valueErrors() {
      const errors = [];
      if (!this.$v.value.$dirty) return errors;
      !this.$v.value.required && errors.push('请输入验证码');
      !this.$v.value.minLength && errors.push('请输入4位验证码');
      return errors;
    },
    pvalueErrors() {
      const errors = [];
      if (!this.$v.pvalue.$dirty) return errors;
      !this.$v.pvalue.required && errors.push('请输入验证码');
      !this.$v.pvalue.minLength && errors.push('请输入6位验证码');
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.required && errors.push('请输入手机号');
      !this.$v.phone.isValid && errors.push('请输入合法手机号');
      !this.$v.phone.isUnique && errors.push('该手机号已被绑定');
      return errors;
    }
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
    this.getCode();
  },
  methods: {
    getCode() {
      this.$api.user.verificationCode()
        .then(res => {
          const { data: { data }} = res;
          this.imageBase64 = data.imageBase64;
          this.vid = data.vid;
        });
    },
    getPhoneCode() {
      console.log(this.$v.phone);
      if (this.$v.value.$invalid || this.$v.phone.$invalid) {
        return Toast({ content: '请正确输入手机号和图形验证码' });
      }
      this.$api.user.getPhoneCode({
        vid: this.vid,
        value: this.value,
        phone: this.phone
      })
        .then(res => {
          Toast({ content: res.data.message });
        });
    },
    confirmPhone() {
      if (this.$v.phone.$invalid || this.$v.pvalue.$invalid) {
        return Toast({ content: '请正确输入手机号和短信验证码' });
      }
      this.$api.user.verifyPhoneCode({
        vid: this.phone,
        value: this.pvalue,
        userId: this.user.id
      })
        .then(res => {
          this.$store.dispatch('setUser', res.data.data);
          Toast({ content: res.data.message });
          this.dialog2 = false;
        });
    },
    close() {
      this.$store.commit(SET_BIND_PHONE, null);
    }
  }
};
</script>

<style lang="stylus" scoped>
.phone
  align-items center
  display flex
  height 100%
  justify-content center
  left 0
  position fixed
  top 0
  transition .2s cubic-bezier(.25,.8,.25,1),z-index 1ms
  width 100%
  outline none
  z-index 101
  .popup
    background #ffffff
    border-radius 4px
    margin 24px
    overflow-y auto
    pointer-events auto
    transition .3s cubic-bezier(.25,.8,.25,1)
    width 80%
    z-index inherit
    box-shadow 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12)
    /deep/ .v-card__text
      overflow-y auto
      padding-top 0
  .overlay
    opacity 0.46
    background-color rgb(33, 33, 33)
    border-color rgb(33, 33, 33)
    position fixed
    top 0
    left 0
    right 0
    bottom 0
</style>
