<template>
  <div class="intro">
    <div class="intro__container">
      <div class="intro__container__info">
        <img src="../assets/images/girl.gif" />
        <h2>用前の须知</h2>
        <p>以下是一些值得仔细阅览的使用说明</p>
      </div>
      <div class="intro__container__version">
        <h4>关于Pixivic</h4>
        <ul>
          <li>
            出生于2018-10-01，是一位兴趣使然的工具酱。
            <br />她天然（无广告），精致（ui统一），敏捷（前后分离&amp;纯js）。
            <br />将提供以下有限的服务：pixiv日排行的浏览与免费高级会员热门排序搜索。
            <br />她希望能在茫茫互联网留下一些存在的痕迹，翘首以盼大家能通过各大搜索引擎访问她（将有助于提升她的搜索排名），搜索关键词：Pixiv、pixiv、P站、p站
          </li>
        </ul>
        <h4>感谢</h4>
        <ul>
          <li>
            Pixivic的开发与运维离不开
            <br />
            <br />
            <a
              href="https://www.oysterqaq.com/"
              title="后端开发"
            >
              <img src="../assets/images/OysterQAQ.jpg" />
            </a>
            <a
              href="https://www.ariussss.com/"
              title="前端开发"
            >
              <img src="../assets/images/Arius.jpg" />
            </a>
            <a
              href="https://www.ygeidc.com/aff.php?aff=75"
              title="图片反向代理服务器赞助"
            >
              <img src="../assets/images/yugeyun.jpg" />
            </a>
          </li>
        </ul>
        <h4>浏览器的使用</h4>
        <ul>
          <li>诸如chrome(谷歌浏览器)，uc浏览器，qq浏览器等的主流浏览器。请勿使用百度知道App与任何应用的内置的浏览器访问本站点。</li>
        </ul>
        <h4>搜索跳转的兼容性</h4>
        <ul>
          <li>首页直接搜索跳转的兼容性不佳，若在首页跳转后的搜索结果并不是你想要的，在该页面重新键入搜索词回车即可。</li>
        </ul>
        <h4>关于日排行</h4>
        <ul>
          <li>默认最新一期为当前日期前天的排行数据，点击蓝色日历图标可进行日期的选定。</li>
        </ul>
        <h4>图片的浏览与保存</h4>
        <ul>
          <li>点击图片可查看原图，在原图上右键即可弹出保存菜单（原图上再次点击后将跳转到该插画于Pixiv的详情页）。</li>
        </ul>
        <h4>留言板的使用</h4>
        <ul>
          <li>点击纸飞机创建最顶级留言，点击回应创建回复，留言发出后被回复者将收到邮件提醒(正确填写邮箱地址作为前提)，提交留言或回复后请静待页面刷新。</li>
        </ul>
        <h4>图片版权</h4>
        <ul>
          <li>本站服务器不会存放任何图片文件，搜索模块仅是实时转发p站图片，排行图片则是托管于各大图床；本站不会依赖这些图片来用于任何盈利性行为，并已在详情页标注出插画作者以及介绍信息，点击大图可跳转该作品在pixiv的所属页面，由于精力有限不可能逐一询问画师是否愿意转载，若有侵权行为还请告知（邮箱：oysterqaq@gmail.com），出示证明后侵权部分将会被删除。</li>
        </ul>
        <h4>阅读完毕</h4>
        <ul>
          <li>
            <router-link to="/">点击此行返回主页，觉得站点好用的话请收藏噢(`・ω・´)</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'intro',
  components: {},
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.intro {
  margin: 0;
  font-family: Arial;
  font-size: 1rem;
  background-color: #ffffff;
  display: flex;
  box-sizing: border-box;
  width: 100vw;
  flex-direction: column;

  &__container {
    width: 100vw;
    margin: auto;
    font-family: 'SF Pro SC', 'SF Pro Display', 'SF Pro Icons', 'AOS Icons', 'PingFang SC', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;

    &__info {
      width: 100vw;
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
      h4, ul, li {
        color: #454d5d;
      }

      ul {
        margin-left: 10px;
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
    }

    &__info {
    }

    li img {
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      height: 45px;
      display: inline;
      margin-left: 20px;
    }
  }
}
</style>
