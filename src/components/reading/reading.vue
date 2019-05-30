<template>
  <div class="reading-content" @touchstart.stop="appTouchStar" @touchend.stop="appTouchEnd" @click="flag=!flag">
    <h4 id="top">{{chapterContent.title}}</h4>
    <p v-for="(item,index) in textList" :key="index">
      {{item}}
    </p>
    <!--头部-->
    <header class="mui-bar mui-bar-nav" :class="{showBar:flag}">
      <i class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="goBack"></i>
      <i class="mui-action-back mui-icon mui-icon-bars mui-pull-right" @click.stop="open=true"></i>
      <h1 class="mui-title">追哥阅读</h1>
    </header>
    <!--抽屉式导航-->
    <mu-drawer :open.sync="open" :docked="false" :right="true" style="background-color:rgb(115, 115, 115);">
      <mu-list>
        <div class="chapter" v-for="(item,index) in chapterList"
             :class="{active:isActive(item.title)}"
             :key="index" @click.stop="selectChapter(item.link)"
        >{{item.title}}
        </div>
      </mu-list>
    </mu-drawer>
  </div>
</template>

<script>
  export default {
    name: "reading",
    data() {
      return {
        open: false,
        flag: false,
        id: this.$route.query.id,
        link: '',
        chapterList: [],
        trueId: '',
        chapterContent: {},
        textList: [],
      }
    },
    methods: {
      //选择章节
      selectChapter(link){
        this.flag=false
        this.$indicator.open()
        this.link=link;
        this.getReadingContent()
        window.scrollTo(0,0)
      },
      //是否加active
      isActive(title) {
        if (this.chapterContent.title == title) {
          return true
        }
      },
      //什么事都不做，取消冒泡，谁需要谁调用
      nothing() {
      },
      goBack() {
        this.$router.go(-1)
      },
      appTouchStar() {
      },
      appTouchEnd() {
      },
      //获取正版
      getTrue() {
        this.$http.get('/api/btoc?view=summary&book=' + this.id).then(result => {
          if (result.statusText == 'OK') {
            this.trueId = result.data[0]._id
            this.getChapter()
          } else {
            this.$toast('获取正版源失败')
          }
        })
      },
      //获取章节
      getChapter() {
        this.$http.get('/api/atoc/' + this.trueId + '?view=chapters').then(result => {
          if (result.statusText == 'OK') {
            this.chapterList = result.data.chapters
            this.link = this.chapterList[0].link
            this.getReadingContent()
          } else {
            this.$toast('获取章节失败')
          }
        })
      },
      //获取章节内容
      getReadingContent() {
        this.$http.get('/chapter/chapter/' + this.link).then(result => {
          if (result.statusText == 'OK') {
            this.chapterContent = result.data.chapter
            this.textList = this.chapterContent.cpContent.split('\n')
          } else {
            this.$toast('获取章节内容失败')
          }
          this.$indicator.close()
        })
      }
    },
    created() {
      this.$indicator.open()
      this.getTrue()
    },
    mounted() {
      // if (this.$route.query.bookListType.indexOf('recommend') != -1) {
      //   this.bookListType = 'recommend'
      //   this.$route.meta.index = 2
      // } else if (this.$route.query.bookListType.indexOf('home') != -1) {
      //   this.bookListType = 'home'
      //   this.$route.meta.index = 1
      // } else if (this.$route.query.bookListType.indexOf('classification') != -1) {
      //   this.bookListType = 'classification'
      //   this.$route.meta.index = 3
      // } else if (this.$route.query.bookListType.indexOf('search') != -1) {
      //   this.bookListType = 'search'
      //   this.$route.meta.index = 4
      // } else {
      //
      // }
    },

  }
</script>

<style lang="less" scoped>
  .reading-content {
    .chapter {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      color: #4a4a4a;
      font-size: 18px;
      line-height: 50px;
    }
    .active {
      background-color: #999999;
    }
    .mui-bar-nav {
      background-color: rgb(115, 115, 115);
      transition: all 0.4s;
      height: 0;
      opacity: 0;
      h1 {
        font-size: 4.5vw;
        line-height: 11vw;
      }
      .mui-icon {
        font-size: 6.25vw;
        line-height: 5vw;
      }
    }
    .showBar {
      height: 11vw;
      opacity: 1;
    }
    min-height: 100vh;
    padding: 2.4vw;
    background-color: rgba(204, 232, 207, 1);
    p {
      color: #4a4a4a;
      font-size: 4.5vw;
      line-height: 7.5vw;
    }
    h4 {
      line-height: 11.25vw;
      margin-top: 2.5vw;
      width: 100%;
      text-align: center;
      font-size: 4.5vw;
    }
  }
</style>
