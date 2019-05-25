<template>
  <div>
    <mu-container v-if="recommendList.boy.length<=0">
      <mu-flex class="demo-linear-progress">
        <mu-linear-progress></mu-linear-progress>
      </mu-flex>
    </mu-container>
    <div class="recomment-content">
      <h2 v-if="recommendList.boy.length>0">男生推荐</h2>
      <books-view :data="recommendList.boy"></books-view>
      <h2 style="margin-top: 10px;" v-if="recommendList.girl.length>0">女生推荐</h2>
      <books-view :data="recommendList.girl"></books-view>
    </div>
  </div>
</template>

<script>
  import BooksView from './booksList/booksView'

  export default {
    name: "recommend",
    components: {
      BooksView
    },
    data() {
      return {
        recommendList: {
          boy: [],
          girl: []
        }
      }
    },
    mounted() {

      window.history.pushState(null, null, document.URL);
      // 给window添加一个popstate事件，拦截返回键，执行this.onBrowserBack事件，addEventListener需要指向一个方法
      window.addEventListener("popstate", this.onBrowserBack, false);
    },
    destroyed() {
      // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    created() {
      this.getRecommendList()
    },
    methods: {
      onBrowserBack(){
        if(this.$routerName.indexOf(this.$route.path) > -1){
          window.history.pushState(null, null, document.URL);
        }
      },
      getRecommendList() {
        //男
        this.$http.get('/api/book/by-categories?gender=male&type=new&major=都市&minor=&start=0&limit=20').then(result => {
          if (result.statusText == 'OK') {
            this.recommendList.boy = result.data.books
            this.recommendList.boy.forEach(value => {
              value.cover = unescape(value.cover.slice(7))
            })
          } else {
            this.$toast('获取数据失败')
          }

        })
        //女
        this.$http.get('/api/book/by-categories?gender=female&type=new&major=现代言情&minor=&start=0&limit=20').then(result => {
          if (result.statusText == 'OK') {
            this.recommendList.girl = result.data.books
            this.recommendList.girl.forEach(value => {
              value.cover = unescape(value.cover.slice(7))
            })
          } else {
            this.$toast('获取数据失败')
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .recomment-content {
    /*10px*/
    padding: 2.4vw;
    h2 {
      /*5px*/
      padding: 1.2vw 0;
      margin-top: 0;
      /*18*/
      font-size: 4.3vw;
      color: mediumpurple;
      border-bottom: 1px solid rgba(102, 51, 153, 0.5);
    }
  }
</style>
