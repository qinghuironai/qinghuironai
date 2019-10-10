<template>
  <div class="donate">
    <div class="donate__container">
      <div class="donate__container__info">
        <img src="../assets/images/girl.gif" />
        <h2>用前の须知</h2>
        <p>以下是一些值得仔细阅览的使用说明</p>
      </div>
      <div class="donate__container__version">
        <h4>捐助渠道</h4>
        <ul>
          <li>维护不易，且行且珍惜，捐助的朋友们烦请留下昵称（支付宝 &amp; 微信）</li>
          <img
            class="donate__container__version__alipay"
            src="../assets/images/alipay.jpg"
          />
          <img
            class="donate__container__version__alipay"
            src="../assets/images/wechat.jpg"
          />
        </ul>
        <h4>贡献者List</h4>
        <table class="donate__container__version__table">
          <tbody>
            <tr>
              <th>ID</th>
              <th>金额</th>
              <th>附言</th>
              <th>捐赠时间</th>
            </tr>

            <tr
              :key="index"
              v-for="(item, index) in tableData"
            >
              <th>{{ item.id }}</th>
              <th>{{ item.sum }}</th>
              <th>{{ item.postscript }}</th>
              <th>{{ item.time }}</th>
            </tr>
          </tbody>
        </table>
        <div
          class="donate__more"
          infinite-scroll-disabled="isBottom"
          infinite-scroll-distance="10"
          v-infinite-scroll="loadMore"
        >
          <!-- <div v-if="isBottom" class="donate__more--bottom">
            (￣ˇ￣)俺也是有底线的
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import donateData from '../static/resources/donate.json'
export default {
  name: 'Donate',
  components: {},
  data () {
    return {
      isBottom: false,
      data: [],
      tableData: [],
      count: 0,
      isrealBottom: false
    }
  },
  methods: {
    loadMore: function () {
      this.isBottom = true

      console.log(this.count)

      setTimeout(() => {
        if (this.count <= this.data.length) {
          for (var i = 0, j = 10; i < j; i++) {
            if (this.count === this.data.length) {
              this.isrealBottom = true
              break
            }
            this.tableData.push(this.data[this.count])
            this.count++
            console.log(this.data)
          }
        }
        this.isBottom = false
      }, 1000)
    }
  },
  mounted () {
    this.data = donateData
  }
}
</script>

<style lang="stylus" scoped>
.donate {
  margin: 0;
  font-family: Arial;
  font-size: 1rem;
  width: 100%;
  background-color: #ffffff;
  min-height: 100%;

  &__container {
    width: 100vw;
    margin: auto;
    font-family: 'SF Pro SC', 'SF Pro Display', 'SF Pro Icons', 'AOS Icons', 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

    &__info {
      padding: 15px calc(50vw - 350px);
      background-color: #f8f9fa;
      box-sizing: border-box;
      color: #454d5d;

      img {
        width: 150px;
        right: 200px;
      }

      h2 {
        margin: 0;
        font-size: 2.4rem;
        position: relative;
        color: #454d5d;
      }

      p {
        color: #acb3c2;
        display: block;
        font-size: 1rem;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
      }

      a {
        &:hover {
          text-decoration: none;
          color: #454d5d;
        }

        &:active {
          text-decoration: none;
          color: #454d5d;
        }

        &::after {
          content: '>';
          margin-left: 5px;
          display: inline-block;
          font-family: cursive;
          font-weight: 800;
        }
      }

      img {
        width: 150px;
        right: 200px;
      }
    }

    &__version {
      width: 100vw;
      margin: -10px;

      h4, ul, li {
        color: #454d5d;
        width: 80vw;
      }

      &__alipay {
        display: inline;
        margin-right: 10px;
        width: 150px;
        border-radius: 10px;
      }

      ul {
        padding-right: -20px;
        margin-left: 10px;
        width: 90vw;
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
      }

      h4 {
        font-size: 1.2rem;
        position: relative;
        display: block;
        margin-block-start: 1.33em;
        margin-block-end: 1.33em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;

        &::before {
          content: '';
          width: 14px;
          height: 14px;
          background: #b9eee5;
          display: inline-block;
          vertical-align: middle;
          margin-top: -4px;
          margin-right: 11px;
          border-radius: 100%;
          border: 3px solid #fff;
          box-shadow: 0 0 5px #b0b0b0;
        }

        &::after {
          content: '';
          width: 2px;
          background: #b9eee5;
          position: absolute;
          left: 9px;
          top: 6px;
        }
      }

      &__table {
        padding-left: 10%;
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;

        tr {
          display: table-row;
          vertical-align: inherit;
          border-color: inherit;
        }

        th {
          text-align: left;
        }

        th, td {
          padding: 8px;
          line-height: 1.42857143;
          vertical-align: top;
          border-top: 2px solid #b9eee5;
          color: #454d5d;
        }

        tbody {
          display: table-row-group;
          vertical-align: middle;
          border-color: inherit;
        }
      }
    }
  }

  &__more {
    &--bottom {
      font-size: 1rem;
      text-align: center;
      padding: 0.6rem;
      color: #33a3dc;
    }
  }
}
</style>
