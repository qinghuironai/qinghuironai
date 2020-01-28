<template>
  <div class="Me">
    <div class="Me-blank">敬请期待</div>
  </div>
</template>

<script>
export default {
  name: 'Me',
  components: {},
  data() {
    return {

    };
  },
  computed: {},
  watch: {},
  mounted() { },
  methods: {}
};
</script>

<style scoped lang="stylus">
.Me {
  display: flex;
  justify-content: center;
  height: 100vh;

  &-blank {
    align-self: center;
  }
}
</style>
