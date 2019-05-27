<template>
  <div>
    <div class="center" data-flex="cross:top" v-for="item in data" :key="item._id" @click="routerGo(item._id)">
      <div data-flex-box="0"><img
        :src="item.cover"
        alt=""></div>
      <div data-flex-box="0" class="right">
        <h3>{{item.title}}</h3>
        <p>{{item.shortIntro}}</p>
        <div class="dv">
          <span class="span1">{{item.author}}</span>
          <span class="span2">{{item.majorCate}}</span>
        </div>
      </div>
      <div class="star" v-if="isStar(item)">
        ★
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "booksList",
    props: ['data'],
    data() {
      return {
        bookListType: '',
      }
    },
    created() {
      if (this.$route.path.indexOf('/recommend') != -1) {
        this.bookListType = 'recommend'
      } else if (this.$route.path.indexOf('/home') != -1) {
        this.bookListType = 'home'
      } else if (this.$route.path.indexOf('/classification') != -1) {
        this.bookListType = 'classification'
      } else if (this.$route.path.indexOf('/ranking') != -1) {
        this.bookListType = 'ranking'
      } else {

      }
    },
    methods: {
      isStar(item) {
        let booksLike = JSON.parse(localStorage.getItem('booksLike'))
       let res =  booksLike.some(value => {
          if (value._id == item._id) {
            return true
          }
        })
        if(res){
          return true
        }
      },
      routerGo(id) {
        this.$router.push({
          path: '/booksDetail',
          query: {
            id: id,
            bookListType: this.bookListType
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .center {
    position: relative;
    /*10*/
    margin-top: 2.4vw;
    .star {
      position: absolute;
      color: #e9ff38;
      right: 2.5vw;
      /*5*/
      top: 1.25vw;
      /*30*/
      font-size: 6vw;

    }
    img {
      /*105*/
      width: 25.4vw;
      /*150*/
      height: 36.2vw;
      box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.5);
    }
    .right {
      /*275*/
      width: 66.4vw;
      /*15*/
      margin-left: 3.5vw;
      h3 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 60vw;
        /*20*/
        line-height: 4.8vw;
        font-size: 4.8vw;
        color: #4A4A4A;
        opacity: 0.7;
        margin-top: 1.2vw;
      }
      p {
        /*82*/
        height: 19.8vw;
        color: #999999;
        /*10*/
        margin-top: 2.4vw;
        /*16*/
        font-size: 3.9vw;
        line-height: 5.2vw;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        word-wrap: normal;
      }
      .dv {
        span {
          color: #FFFFFF;
          /*12*/
          font-size: 2.9vw;
          /*3*/
          padding: 0.7vw 2.4vw;
          border-radius: 6px;
          font-weight: 600;
        }
        .span1 {
          float: left;
          background-color: #28a745;
        }
        .span2 {
          float: right;
          background-color: darkorange;
        }
      }
    }
  }
</style>
