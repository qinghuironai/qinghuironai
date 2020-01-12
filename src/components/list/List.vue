<template>
  <div class="list">
    <div :style="{minHeight: `${contentHeight}px`}">
      <Item v-for="(item, index) in data"
            :key="index"
            :column="item" />
    </div>
  </div>
</template>

<script>
import Item from './Item'
import { IMG_PREFIX } from '@/util/constants'

export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    scrollY: {
      type: Number
    }
  },
  components: {
    Item
  },
  computed: {
    contentHeight () {
      return Math.max(this.leftHight, this.rightHight)
    },
    width () {
      return document.body.clientWidth
    },
    height () {
      return document.body.clientHeight
    },
    data () {
      return this.list.filter(item => item.top > this.scrollY - 2 * this.height && item.top < this.scrollY + 2 * this.height)
    }
  },
  data () {
    return {
      leftHight: 0,
      rightHight: 0
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
            let per = tmp.width / (this.width / 2)
            let height = Math.min(parseInt(tmp.height / per) + 100, 350)
            let style, transform
            if (this.leftHight <= this.rightHight) {
              transform = `translate3d(0, ${this.leftHight}px, 0)`
              this.leftHight += height
              tmp.top = this.leftHight
            } else {
              transform = `translate3d(${this.width / 2}px, ${this.rightHight}px, 0)`
              this.rightHight += height
              tmp.top = this.rightHight
            }
            style = {
              transform,
              width: `${this.width / 2}px`,
              height: `${height}px`
            }
            tmp['style'] = style
            tmp['src'] = `${IMG_PREFIX}${tmp.imageUrls[0].medium}`
            tmp['avatarSrc'] = `${IMG_PREFIX}${tmp.artistPreView.avatar}`
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
.list
  position relative
</style>
