<template>
  <div>
    <div class="home-content">
      <h2>我的书架</h2>
      <book-view :data="booksLikeList"></book-view>
      <div class="none" v-if="!booksLikeList.length>0">
        去寻找你喜欢的书吧<br/>
        收藏起来！
      </div>
    </div>
  </div>
</template>

<script>
  import BookView from './booksList/booksView'

  export default {
    name: "home",
    data() {
      return {

      }
    },
    components: {
      BookView,

    },
    computed: {
      booksLikeList() {
        return this.$store.state.booksLikeList;
      },
    },
    methods: {
      onBrowserBack() {
        if (this.$routerName.indexOf(this.$route.path) > -1) {
          window.history.pushState(null, null, document.URL);
          this.$toast({position: 'center', duration: 500, message: '再按一次退出'})
        }
      }
    },
    created() {
     this.$store.commit('getBooksLikeList')
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
    watch: {},

  }
</script>

<style lang="less" scoped>
  .home-content {
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
    .none {
      text-align: center;
      color: #999999;
      font-size: 4.5vw;
      margin-top: 50vw;
      opacity: 0.7;
    }
  }
</style>
