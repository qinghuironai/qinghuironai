<template>
  <div ref="list"
       class="list">
    <VirtualCollection :cellSizeAndPositionGetter="cellSizeAndPositionGetter"
                       :collection="newList"
                       :height="height"
                       :width="width"
                       :identifier="identifier"
                       @infinite="infinite">
      <div slot="cell"
           slot-scope="props"
           style="height: 100%; display: flex; justifyContent: center;">
        <Item :column="props.data" />
      </div>

    </VirtualCollection>
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
    },
    identifier: {
      default: +new Date()
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
      return document.body.clientHeight * 2
    },
    data () {
      return this.list.filter(item => item.top > this.scrollY - 2 * this.height && item.top < this.scrollY + 2 * this.height)
    },
    newList () {
      return this.list
    }
  },
  data () {
    return {
      leftHight: 0,
      rightHight: 0,
      scrollY: 0,
      refreshing: false,
      loading: false
    }
  },
  mounted () {
    // window.addEventListener('scroll', this.onScroll, true)
  },
  methods: {
    infiniteHandler ($state) {
      this.$emit('infinite', $state)
    },
    onScroll (pos) {
      // console.log(this.$refs.scroll)
      this.scrollY = document.documentElement.scrollTop
    },
    infinite ($state) {
      console.log('Jiazai')
      this.$emit('infinite', $state)
    },
    refresh () {

    },
    cellSizeAndPositionGetter (item, index) {
      // console.log(item)
      return {
        width: (document.body.clientWidth || document.documentElement.clientWidth) / 2,
        height: item.style.height - 10,
        x: item.x,
        y: item.top
      }
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
            let height = Math.min(parseInt(tmp.height / per), 300)
            let style, transform
            if (this.leftHight <= this.rightHight) {
              transform = `translate3d(0, ${this.leftHight}px, 0)`
              tmp.top = this.leftHight
              tmp.x = 0
              this.leftHight += height
            } else {
              transform = `translate3d(${this.width / 2}px, ${this.rightHight}px, 0)`
              tmp.top = this.rightHight
              tmp.x = this.width / 2
              this.rightHight += height
            }
            style = {
              transform,
              width: `${this.width / 2}px`,
              height: `${height}`
            }
            tmp['style'] = style
            tmp['src'] = `${IMG_PREFIX}${tmp.imageUrls[0].medium}`
            tmp['avatarSrc'] = `${IMG_PREFIX}${tmp.artistPreView.avatar}`
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
.list
  position relative
</style>
