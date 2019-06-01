<template>
  <div class="reading-content" @touchstart.stop="appTouchStar" @touchend.stop="appTouchEnd" @click="flag=!flag"
       :style="{'background-color':backgroundColor}">
    <h4 :style="{'font-size':titleSize+'vw'}">{{chapterContent.title}}</h4>
    <p v-for="(item,index) in textList" :key="index" :style="{'font-size':fontSize+'vw'}">
      {{item.replace(/^\s*/,"")}}
    </p>
    <!--头部-->
    <header class="mui-bar mui-bar-nav" :class="{showBar:flag}">
      <i class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click.stop="goBack"></i>
      <i class="mui-action-back mui-icon mui-icon-bars mui-pull-right" @click.stop="menuClick"></i>
      <h1 class="mui-title">追哥阅读</h1>
    </header>
    <!--抽屉式导航-->
    <mu-drawer id="muList" :open.sync="open" :docked="false" :right="true" style="background-color:rgb(115, 115, 115);">
      <mu-list>
        <div class="chapter" v-for="(item,index) in chapterList"
             :class="{active:current==index}"
             :key="index" @click.stop="selectChapter(item.link);active(index)"
        >{{item.title}}
        </div>
      </mu-list>
    </mu-drawer>

    <!--设置框-->
    <div class="footer" :class="{footerShow:flag}">
      <mu-slider class="demo-slider" color="secondary" v-model="opacity" :max="70" :display-value="false"></mu-slider>
      <div class="select-bgc" data-flex="cross:top">
        <div data-flex-box="0" class="size" @click.stop="reduceFontSize">Aa-</div>
        <div data-flex-box="0" class="bgc"
             v-for="(item,index) in bgcList"
             :class="{active:isBgc(item)}"
             :style="{'background-color':item}"
             @click.stop="backgroundColor=item"
        ></div>
        <div data-flex-box="0" class="size" @click.stop="addFontSize">Aa+</div>
      </div>
      <div class="foot" data-flex="cross:top">
        <div data-flex-box="1" class="bt" @click.stop="reduceChapter()">上一章</div>
        <div data-flex-box="1" class="bt ml" @click.stop="addChapter()">下一章</div>
      </div>
    </div>
    <!--遮挡层,亮度-->
    <div class="setOpa" :style="{'opacity':0.7-(opacity/100)}"></div>
  </div>
</template>

<script>
  export default {
    name: "reading",
    data() {
      return {
        titleSize: 5,
        fontSize: 4.5,
        current: 0,
        bgcList: [
          '#E9E6D0', '#cce8cf', '#E9FAFF', '#E9EBFE', '#FDE6E0'
        ],
        backgroundColor: '#E9E6D0',
        opacity: 55,
        open: false,
        flag: false,
        id: this.$route.query.id,
        link: '',
        chapterList: [],
        trueId: '',
        chapterContent: {},
        textList: [],
        //视口（浏览器的宽度）
        windowWidth:'',
        chapterScroll:0,
        windowScroll:0
      }
    },
    methods: {
      changeChapterTop(){
        if(this.current>=6){
          this.chapterScroll = (this.current-6) * 0.125*this.windowWidth
        }else{
          this.chapterScroll = 0
        }
      },
      menuClick(){
        this.open=true
      document.getElementById('muList').scrollTo(0,this.chapterScroll)
      },
      //上一章
      reduceChapter() {
        if (this.current <= 0) {
          this.$toast({position: 'center', duration: 700, message: '没有上一章了'})
        } else {
          this.current -= 1
          this.link = this.chapterList[this.current].link
          this.getReadingContent()
          this.changeChapterTop()
        }
      },
      //下一章
      addChapter() {
        if (this.current >= this.chapterList.length - 1) {
          this.$toast({position: 'center', duration: 700, message: '没有下一章了'})
        } else {
          this.current += 1
          this.link = this.chapterList[this.current].link
          this.getReadingContent()
          this.changeChapterTop()
        }
      },

      // 字体增大
      addFontSize() {
        if (this.fontSize >= 6) {
          this.$toast({position: 'center', duration: 700, message: '不能再大了哦'})
        } else {
          this.titleSize += 0.2
          this.fontSize += 0.2
        }
      },
      //字体减小
      reduceFontSize() {
        if (this.fontSize <= 3.5) {
          this.$toast({position: 'center', duration: 700, message: '不能再小了哦'})
        } else {
          this.titleSize -= 0.2
          this.fontSize -= 0.2
        }
      },
      isBgc(item) {
        if (this.backgroundColor == item) {
          return true
        }
      },
      //选择章节
      selectChapter(link) {
        this.link = link;
        this.getReadingContent()
        window.scrollTo(0, 0)
      },
      //是否加active
      active(index) {
        this.current = index
      },
      //什么事都不做，取消冒泡，如果没有点击事件加这个上去
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
        this.$indicator.open()
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
      this.windowWidth=window.innerWidth
      let scop = this
      window.addEventListener('scroll',function (e) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        //把屏幕滚动高度转化成vw,适配任何移动端屏幕，存在本地localstorage
        scop.windowScroll=scrollTop/scop.windowWidth*100
      })
    },
    //页面销毁之前   存数据到本地
    beforeDestroy(){
       let readingLocationObj={
         id:this.id,
         link:this.link,
         chapterScroll:this.chapterScroll/this.windowWidth*100,
         current:this.current
       }
       let readingOptionObj={
          backgroundColor:this.backgroundColor,
         opacity:this.opacity,
         fontSize:this.fontSize,
         titleSize:this.titleSize
       }
        let readingLocation = localStorage.getItem('readingLocation')
        let readingOption=localStorage.getItem('readingOption')
      if(!readingLocation){

      }else{

      }
      if(!readingOption){

      }else{

      }
    },
    //页面销毁
    destroyed () {
      window.removeEventListener('scroll')
    },

  }
</script>

<style lang="less" scoped>
  .reading-content {
    transition: all 0.4s;
    .mu-paper {
      width: 50vw;
    }
    .chapter {
      padding-left: 2.5vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      color: #3d3d3d;
      font-size: 3.5vw;
      line-height: 12.5vw;
    }
    .active {
      background-color: #999999;
    }
    .mui-bar-nav {
      box-shadow: none;
      z-index: 3001;
      background-color: rgb(115, 115, 115);
      transition: all 0.4s;
      height: 0;
      opacity: 0;
      h1 {
        color: #343434;
        font-size: 4.5vw;
        line-height: 10vw;
      }
      .mui-icon {
        padding-top: 2.5vw;
        padding-right: 2.5vw;
        font-size: 6.25vw;
        line-height: 5vw;
        color: #4a4a4a;
      }
    }
    .showBar {
      height: 10vw;
      opacity: 1;
    }
    min-height: 100vh;
    padding: 2.4vw;
    p {
      text-indent:2em;
      color: #755927;
      line-height: 7.5vw;
    }
    h4 {
      color: #4a4a4a;
      line-height: 11.25vw;
      margin-top: 6vw;
      width: 100%;
      text-align: center;
      font-size: 5vw;
    }
    .footer {
      z-index: 3001;
      opacity: 0;
      transition: all 0.4s;
      background-color: rgb(115, 115, 115);
      height: 0;
      position: fixed;
      width: 100vw;
      bottom: 0;
      left: 0;
      .demo-slider {
        margin: auto;
        margin-top: 5vw;
        width: 65vw;
        background: transparent !important;
      }
      .select-bgc {
        width: 90vw;
        margin: 0 auto;
        margin-top: 5vw;
        .bgc {
          transition: all 0.4s;
          margin-left: 4vw;
          width: 10vw;
          height: 10vw;
          border-radius: 50%;
          box-sizing: border-box;
        }
        .bgc:nth-child(2) {
          margin-left: 3vw;
        }
        .size {
          margin-left: 3vw;
          font-size: 5vw;
          line-height: 10vw;
          color: mediumpurple;
        }
        .size:nth-child(1) {
          margin-left: 0;
        }
        .active {
          border-radius: 3vw;
        }
      }
      .foot {
        margin: auto;
        margin-top: 7vw;
        width: 65vw;
        .bt {
          font-size: 4.5vw;
          color: #4a4a4a;
          background-color: mediumpurple;
          text-align: center;
          border-radius: 6px;
          line-height: 10vw;
        }
        .ml {
          margin-left: 2.5vw;
        }
      }
    }
    .footerShow {
      height: 50vw;
      opacity: 1;
    }
    .setOpa {
      background-color: #000000;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
    }
  }
</style>
