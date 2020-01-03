<template>
  <div class="bottom">
    <div>
      <i class="iconfont icon-fanhui"
         @click="goBack"></i>
    </div>
    <div>
      <i class="iconfont icon-liuyan"></i>
    </div>
    <div>
      <progress-circle :radius="radius"
                       :percent="percent">
        <i :class="['iconfont', 'download', complete ? 'icon-wanchengchenggong' : 'icon-shang-copy']"
           @click="download"></i>
      </progress-circle>
    </div>
    <div>
      <i class="iconfont icon-xinaixin"></i>
    </div>
  </div>
</template>

<script>
import progressCircle from '@/components/circle/Circle'
import { downloadImage, replaceImg } from '@/util'

export default {
  props: {
    detail: {
      required: true
    }
  },
  data () {
    return {
      complete: false,
      percent: 0,
      radius: 26
    }
  },
  components: {
    progressCircle
  },
  methods: {
    goBack () {
      // this.$router.back()
      this.$emit('handleClick')
    },
    async download () {
      const toast = this.$createToast({
        time: 1000,
        txt: '获取下载...',
        type: 'correct'
      })
      toast.show()
      for (const item of this.detail.imageUrls) {
        this.percent = 0
        await downloadImage(replaceImg(item.original), (progress) => {
          this.percent = progress.loaded / progress.total
        })
      }
      this.complete = true
    }
  }
}
</script>

<style lang="stylus" scope>
.bottom
  position fixed
  bottom 0
  left 0
  right 0
  background #ffffff
  height 60px
  display flex
  align-items center
  z-index 101
  >div
    flex 1
    text-align center
    font-size 28px
    .download
      font-size 16px
      position absolute
      left 39px
      top 8px
</style>
