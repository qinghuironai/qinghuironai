<template>
  <div>
    <div class="list"
         @touchstart="touchStart"
         :style="{minHeight: `${contentHeight}px`}">
      <Item v-for="(item, index) in list"
            :key="index"
            :column="item" />
    </div>
    <infinite-loading :identifier="identifier"
                      @infinite="infinite">
      <div slot="no-more"
           style="color: #b9eee5; margin: 10px;">(￣ˇ￣)俺也是有底线的</div>
    </infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Item from './Item'
import { IMG_PREFIX, color } from '@/util/constants'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    identifier: {
      required: false
    }
  },
  data () {
    return {
      leftHight: 0,
      rightHight: 0
    }
  },
  components: {
    Item,
    InfiniteLoading
  },
  computed: {
    width () {
      return document.body.clientWidth
    },
    contentHeight () {
      return Math.max(this.leftHight, this.rightHight)
    }
  },
  methods: {
    infinite ($state) {
      this.$emit('infinite', $state)
    },
    touchStart () {
      console.log(1)
    }
  },
  watch: {
    list: {
      handler (val, old) {
        if (val.length === 0) {
          this.leftHight = 0
          this.rightHight = 0
        } else {
          const list = val.filter(e => !old.includes(e))
          for (let i = 0; i < list.length; i++) {
            let tmp = list[i]
            let width = (this.width) / 2
            let per = tmp.width / width
            let height = Math.min(parseInt(tmp.height / per), 300)
            let transform
            if (this.leftHight <= this.rightHight) {
              transform = `translate3d(0, ${this.leftHight}px, 0)`
              this.leftHight += height
            } else {
              transform = `translate3d(${this.width / 2}px, ${this.rightHight}px, 0)`
              this.rightHight += height
            }
            let style = {
              transform,
              width: `${width}px`,
              height: `${height}px`
            }
            tmp['style'] = style
            tmp['src'] = `${IMG_PREFIX}${tmp.imageUrls[0].medium}`
            tmp['color'] = color[Math.floor(Math.random() * 8)]
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="stylus" scope>
@import '~@/style/global.styl'
.list
  width 100%
  display flex
  flex-direction row
  overflow hidden
  position relative
  // padding-bottom 60px
  background #ffffff
  box-sizing border-box
  .column
    width 50%
    display flex
    flex-direction column
    align-items center
</style>
