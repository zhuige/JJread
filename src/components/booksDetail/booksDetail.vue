<template>
  <div>
    <mu-container v-if="loading" style="position: fixed">
      <mu-flex class="demo-linear-progress">
        <mu-linear-progress></mu-linear-progress>
      </mu-flex>
    </mu-container>
    <div class="booksDetail-content">
      <div class="header" data-flex="cross:top">
        <div data-flex-box="0" class="head-left">
          <img :src="booksDetailsList.cover"
               alt="">
        </div>
        <div data-flex-box="0" class="head-right">
          <span class="span1">{{booksDetailsList.title}}</span>
          <span>作者：{{booksDetailsList.author}}</span>
          <span>字数：{{(booksDetailsList.wordCount+'').slice(0,-4)}}万</span>
          <span>读者留存率：{{booksDetailsList.retentionRatio}}%</span>
          <span>最后更新：{{booksDetailsList.updated}}</span>
        </div>
      </div>
      <div class="bt">
        <span class="b1" @click="goReading(booksDetailsList._id)">开始阅读</span>
        <span class="b2" @click="joinLike" v-if="isStar">加入书架</span>
        <span class="b2 btn-star" v-if="!isStar" @click="cancleStar">已收藏</span>
      </div>
      <div class="intro">
        <p>{{booksDetailsList.longIntro}}</p>
      </div>
      <div class="update">
        <h2>最后更新</h2>
        <h3>{{booksDetailsList.lastChapter}}</h3>
      </div>
      <div class="footer">
        <div class="title">
          <h3>相关推荐</h3>
        </div>
        <div class="content">
          <div class="center" data-flex="cross:top" @touchstart.stop="booksTouchStar" @touchend.stop="booksTouchEnd"
               :style="{'margin-left':marginLeft+'vw'}">
            <div data-flex-box="0" class="item" v-for="item in booksRecommendList" :key="item._id"
                 @click="routerGO(item._id)">
              <img :src="item.cover">
              <h4>{{item.title}}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "booksDetail",
    data() {
      return {
        loading: true,
        booksRecommendList: [],
        booksDetailsList: {},
        touchStar: '',
        touchEnd: '',
        direction: 'left',
        marginLeft: 0,
        moveIndex: 0,
        id: this.$route.query.id,
        bookListType: this.$route.query.bookListType,
        isStar: true,
        index: 1,
        bookListType: ''
      }
    },
    created() {
      this.initStar()
      this.getBooksRecommend()
    },
    mounted() {
      if (this.$route.query.bookListType.indexOf('recommend') != -1) {
        this.bookListType = 'recommend'
        this.$route.meta.index = 2
      } else if (this.$route.query.bookListType.indexOf('home') != -1) {
        this.bookListType = 'home'
        this.$route.meta.index = 1
      } else if (this.$route.query.bookListType.indexOf('classification') != -1) {
        this.bookListType = 'classification'
        this.$route.meta.index = 3
      } else if (this.$route.query.bookListType.indexOf('search') != -1) {
        this.bookListType = 'search'
        this.$route.meta.index = 4
      } else {

      }
    },
    methods: {
      goReading(id) {
        this.$router.push({
          path: '/reading',
          query: {
            bookListType: this.bookListType,
            id: id
          }
        })
      },
      //取消收藏
      cancleStar() {
        let booksLike = JSON.parse(localStorage.getItem('booksLike'))
        booksLike.forEach((item, index) => {
          if (item._id === this.id) {
            booksLike.splice(index, 1)
            localStorage.setItem('booksLike', JSON.stringify(booksLike))
            this.initStar()
          }
        })
      },
      //判断是否收藏
      initStar() {
        let booksLike = JSON.parse(localStorage.getItem('booksLike'))
        let res = booksLike.some(item => {
          if (item._id == this.id) {
            return true
          }
        })
        if (res) {
          this.isStar = false
        } else {
          this.isStar = true
        }
      },
      //加入书架，存储locakstorage
      joinLike() {
        if (this.loading == false) {
          let booksLikeObj = {
            _id: this.booksDetailsList._id,
            cover: this.booksDetailsList.cover,
            author: this.booksDetailsList.author,
            majorCate: this.booksDetailsList.majorCate,
            shortIntro: this.booksDetailsList.longIntro,
            title: this.booksDetailsList.title
          }
          if (JSON.parse(localStorage.getItem('booksLike')) == null) {
            let arr = [booksLikeObj]
            localStorage.setItem('booksLike', JSON.stringify(arr))
          } else {
            let booksLike = JSON.parse(localStorage.getItem('booksLike'))
            var res = booksLike.some(item => {
              if (item._id == booksLikeObj._id) {
                return true
              }
            })
            if (res) {
            } else {
              booksLike.push(booksLikeObj)
              localStorage.setItem('booksLike', JSON.stringify(booksLike))
              this.isStar = false
            }
          }
        } else {
          this.$toast({position: 'center', duration: 700, message: '点太快了！收藏失败'})
        }

      },
      routerGO(id) {
        this.id = id;
        this.getBooksRecommend()
      },
      getBooksRecommend() {
        //获取小说信息
        this.$http.get('/api/book/' + this.id).then(result => {
          if (result.statusText == "OK") {
            this.booksDetailsList = result.data
            this.booksDetailsList.cover = unescape(this.booksDetailsList.cover.slice(7))
            this.booksDetailsList.updated = this.booksDetailsList.updated.slice(0, 10)
            this.loading = false
          } else {
            this.$toast('获取详情失败')
          }

        })
        //获取小说推荐列表
        this.$http.get('/api/book/' + this.id + '/recommend').then(result => {
          if (result.statusText == "OK") {
            this.booksRecommendList = result.data.books
            this.booksRecommendList.forEach(value => {
              value.cover = unescape(value.cover.slice(7))
            })
          } else {
            this.$toast('获取小说推荐失败')
          }
        })
        this.initStar()
      },
      //滑动触摸
      booksTouchStar(e) {
        this.touchStar = e.changedTouches[0].clientX
      },
      booksTouchEnd(e) {
        this.touchEnd = e.changedTouches[0].clientX
        //判断移动左边还是右边
        if (this.touchStar - this.touchEnd > 0) {
          this.direction = 'left'
        } else {
          this.direction = 'right'
        }
        //判断移动是否大于40距离
        if (Math.abs(this.touchStar - this.touchEnd) > 40 && Math.abs(this.touchStar - this.touchEnd) < 150) {
          if (this.direction == 'left') {
            if (this.booksRecommendList.length - this.moveIndex > 3) {
              this.moveIndex++;
              this.marginLeft = this.moveIndex * -30.25
            }
          } else {
            if (this.moveIndex > 0) {
              this.moveIndex--;
              this.marginLeft = this.moveIndex * -30.25
            }
          }
        } else if (Math.abs(this.touchStar - this.touchEnd) > 150) {
          if (this.direction == 'left') {
            if (this.booksRecommendList.length - this.moveIndex > 5) {
              this.moveIndex += 3;
              this.marginLeft = this.moveIndex * -30.25;
            }
          } else {
            if (this.moveIndex > 2) {
              this.moveIndex -= 3;
              this.marginLeft = this.moveIndex * -30.25;
            }
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .booksDetail-content {
    /*10*/
    padding: 2.5vw;
    img {
      border-radius: 4px;
      /*105*/
      width: 25vw;
      /*150*/
      height: 36.2vw;
      box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.5);
    }
    .header {
      /*20*/
      margin-top: 5vw;
      .head-left {
        margin-left: 5vw;
      }
      .head-right {
        margin-left: 5vw;
        .span1 {
          font-weight: 600;
          font-size: 4.5vw;
        }
        span {
          height: 5vw;
          font-size: 4vw;
          margin-top: 1.25vw;
          color: #4A4A4A;
          font-weight: 500;
          display: block;
        }
        span:nth-of-type(2) {
          margin-top: 2.5vw;
        }
      }
    }
    .bt {
      margin-top: 7.5vw;
      margin-left: 3vw;
      span {
        width: 41.25vw;
        line-height: 10vw;
        display: inline-block;
        height: 10vw;
        font-size: 4vw;
        box-sizing: border-box;
        border: 1px solid rgba(155, 155, 155, 0.4);
        border-radius: 4px;
        text-align: center;
      }
      .b1 {
        background-color: mediumpurple;
        color: #FFFFFF;
        &:active {
          background-color: blueviolet;
        }
      }
      .b2 {
        margin-left: 2.5vw;
        background-color: #fff;
        color: #4A4A4A;
      }
      .btn-star {
        background-color: #F6AB2F;
      }
    }
    .intro {
      margin-top: 10vw;
      p {
        opacity: 0.9;
        /*82*/
        height: 19.8vw;
        color: #4A4A4A;
        /*10*/
        margin-top: 2.4vw;
        /*17*/
        font-size: 4.1vw;
        line-height: 7.2vw;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        word-wrap: normal;
      }
    }
    .update {
      height: 22.5vw;
      border-top: 1px solid rgba(102, 51, 153, 0.2);
      padding-top: 2.5vw;
      margin-top: 5vw;
      h2 {
        color: #4A4A4A;
        font-size: 4vw;
      }
      h3 {
        margin-top: 2.5vw;
        font-size: 3.8vw;
        color: mediumpurple;
      }
    }
    .footer {
      margin-top: 2.5vw;
      overflow: hidden;
      background-color: rgba(147, 112, 219, 0.1);
      .title {
        h3 {
          color: #4A4A4A;
          font-size: 4vw;
          padding: 2.5vw 0;
          border-bottom: 1px solid rgba(102, 51, 153, 0.2);
        }
      }
      .center {
        transition: all 0.4s;
        margin-top: 5vw;
        .item {
          padding-bottom: 1.25vw;
          margin-left: 5.25vw;
          h4 {
            line-height: 5vw;
            height: 11.8vw;
            overflow: hidden;
            width: 25vw;
            opacity: 0.8;
            padding: 1.25vw 0 2.5vw 0;
            color: #4A4A4A;
            font-size: 3.75vw;
            text-align: center;
          }
          img {
            box-shadow: -2px 2px 3px 0px rgba(0, 0, 0, 0.4);
          }
        }
      }
    }
  }
</style>
