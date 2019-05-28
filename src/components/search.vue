<template>
  <div class="search" @click="maybeWord=[]">
    <div class="head">
      <input type="text" placeholder="搜索" v-model="searchName" @keyup="searchMabeWord" @focus="searchMabeWord">
      <i class="mui-icon mui-icon-search"></i>
      <div class="searchList" :class="{active:maybeWord.length>0?true:false}">
        <div class="text" v-for="(item,index) in maybeWord" :key="index">{{item}}</div>
      </div>
    </div>
    <div class="hotWord">
      <mu-chip class="demo-chip" v-for="item,index in searchHotList"
               :color="color[Math.floor((Math.random()*color.length))]" :key="index">{{item.word}}
      </mu-chip>
    </div>
  </div>
</template>

<script>
  export default {
    name: "search",
    data() {
      return {
        searchName: '',
        searchHotList: [],
        maybeWord: [],
        color: ['primary', 'secondary', 'success', 'warning', 'info', 'error']
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
      this.getHotList()
    },
    methods: {
      //获取候选词
      searchMabeWord() {
        this.$http.get('/api/book/auto-complete?query=' + this.searchName).then(result => {
          if (result.statusText == 'OK') {
            this.maybeWord = result.data.keywords
          } else {
            this.$toast('获取候选词失败')
          }

        })
      },
      //获取热词
      getHotList() {
        this.$http.get('/api/book/search-hotwords').then(result => {
          if (result.statusText == 'OK') {
            this.searchHotList = result.data.searchHotWords
          } else {
            this.$toast('获取热词失败')
          }
        })
      },
      onBrowserBack() {
        if (this.$routerName.indexOf(this.$route.path) > -1) {
          window.history.pushState(null, null, document.URL);
          this.$toast({position: 'bottom', duration: 500, message: '再按一次退出'})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .search {
    padding-bottom: 5vw;
    .head {
      width: 80vw;
      height: 10vw;
      margin: auto;
      margin-top: 1.25vw;
      position: relative;
      input {
        font-size: 4.5vw;
        height: 10vw;
        padding-left: 6.25vw;
        border: none;
        border-bottom: 1px solid #999999;
        border-radius: 0;
      }
      i {
        font-size: 6vw;
        right: 5vw;
        position: absolute;
        bottom: 2.5vw;
        color: #999999;

      }
      .searchList {
        overflow: auto;
        background-color: rgba(255, 255, 255, 0.9);
        width: 0;
        max-height: 50vw;
        transition: all 0.4s;
        opacity: 0;
        position: absolute;
        top: 10vw;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 3px 14px 2px rgba(0, 0, 0, .12);
        .text {
          font-size: 4vw;
          color: #4a4a4a;
          padding: 2.5vw;
          &:active {
            background-color: rgba(147, 112, 219, 0.6);
          }
        }
      }
      .active {
        width: 100%;
        opacity: 1;
      }
    }
    .hotWord {
      width: 80vw;
      margin: auto;
      margin-top: 5vw;
      .demo-chip {
        margin: 1.25vw;
        line-height: 8vw;
        font-size: 3vw;
      }
    }

  }
</style>
