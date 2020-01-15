<template>
  <div class="list">
    <div v-for="(item, index) in [leftList, rightList]"
         :key="index"
         class="column">
      <Item v-for="column in item"
            :key="column.id"
            :column="column" />
    </div>
  </div>
</template>

<script>
import Item from './Item'
import { IMG_PREFIX, color } from '@/util/constants'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      leftList: [],
      rightList: [],
      leftHight: 0,
      rightHight: 0
    }
  },
  components: {
    Item
  },
  computed: {
    width () {
      return document.body.clientWidth
    }
  },
  watch: {
    list: {
      handler (val, old) {
        if (val.length === 0) {
          this.leftHight = 0
          this.leftList = []
          this.rightHight = 0
          this.rightList = []
        } else {
          const list = val.filter(e => !old.includes(e))
          for (let i = list.length - 1; i >= 0; i--) {
            let tmp = list[i]
            let per = tmp.width / (this.width / 2)
            let height = Math.min(parseInt(tmp.height / per), 300)
            let style = {
              height: `${height}px`,
              backgroundColor: color[Math.floor(Math.random() * 8)]
            }
            tmp = { ...tmp, style, src: `${IMG_PREFIX}${tmp.imageUrls[0].medium}`
            }
            if (this.leftHight <= this.rightHight) {
              this.leftHight += height
              this.leftList.push(tmp)
            } else {
              this.rightHight += height
              this.rightList.push(tmp)
            }
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
  height auto
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
