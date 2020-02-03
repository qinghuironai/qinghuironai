<template>
  <v-app-bar color="white" dense flat>
    <!-- <v-app-bar-nav-icon /> -->
    <v-btn icon>
      <router-link to="/search">
        <svg font-size="20" class="icon" aria-hidden="true">
          <use xlink:href="#picsearch" />
        </svg>
      </router-link>
    </v-btn>
    <v-spacer />
    <v-bottom-sheet v-model="showMode">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          {{ modeText }}
        </v-btn>
      </template>
      <v-sheet class="text-center" height="200px">
        <v-tabs light :centered="true" :grow="true">
          <v-tabs-slider />
          <v-tab v-for="(item, index) in tabs" :key="index">
            {{ item.text }}
          </v-tab>
          <v-tab-item v-for="(item, index) in tabs" :key="index">
            <v-card flat tile height="200">
              <v-card-text>
                <v-btn
                  v-for="val in item.children"
                  :key="val.value"
                  class="mr-3 mb-3"
                  depressed
                  small
                  primary
                  :color="val.value === modeVal ? 'primary' : ''"
                  @click="selectMode(val)"
                >{{ val.text }}</v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-sheet>
    </v-bottom-sheet>
    <v-spacer />
    <v-bottom-sheet v-model="showDate">
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <svg font-size="20" class="icon" aria-hidden="true">
            <use xlink:href="#picrili5" />
          </svg>
        </v-btn>
      </template>
      <v-sheet class="text-center">
        <v-date-picker
          v-model="date"
          full-width
          no-title
          color="#b9eee5"
          locale="zh-cn"
          :max="max"
          @input="selectDate"
        />
      </v-sheet>
    </v-bottom-sheet>
  </v-app-bar>
</template>

<script>
import { modeData } from '@/util/constants';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      modeText: '日排行',
      modeVal: 'day',
      tabs: modeData,
      menu: false,
      showMode: false,
      showDate: false,
      date: null,
      max: null
    };
  },
  mounted() {
    this.date = this.max = dayjs(new Date()).add(-3, 'days').format('YYYY-MM-DD');
  },
  methods: {
    selectMode(val) {
      this.modeText = val.text;
      this.modeVal = val.value;
      this.showMode = false;
      this.$emit('selectMode', val.value);
    },
    selectDate(val) {
      this.showDate = false;
      this.$emit('selectDate', val);
    }
  }
};
</script>

<style lang="stylus" scoped>
</style>
