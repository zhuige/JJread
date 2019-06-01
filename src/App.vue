<template>
  <div class="read-content padd" :class="{nopadd:this.$route.path=='/reading'}" @touchstart="appTouchStar" @touchend="appTouchEnd">

    <!--头部-->
    <header class="mui-bar mui-bar-nav" v-if="this.$route.path!='/reading'">
      <i class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back" v-if="backIcon"></i>
      <h1 class="mui-title">追哥阅读</h1>
    </header>
    <!--中间内容 、路由-->
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>

    <!--底部导航栏-->
    <nav class="mui-bar mui-bar-tab" style="box-shadow: 0 0 1px rgba(0,0,0,0.3); z-index: 20000" v-if="this.$route.path!='/reading'">
      <span class="mui-tab-item" :class="{active:this.$route.query.bookListType=='home'||this.$route.path.indexOf('/home')>-1}"@click="routeGo('/home')">
        <span class="mui-icon mui-icon-home"></span>
        <span class="mui-tab-label">书架</span>
      </span>
      <span class="mui-tab-item" :class="{active:this.$route.query.bookListType=='recommend'||this.$route.path.indexOf('/recommend')>-1}"@click="routeGo('/recommend')">
        <span class="mui-icon mui-icon-paperplane"></span>
        <span class="mui-tab-label">推荐</span>
      </span>
      <span class="mui-tab-item"
                   :class="{active:this.$route.query.bookListType=='classification'||this.$route.path.indexOf('/classification')>-1}"@click="routeGo('/classification')">
        <span class="mui-icon mui-icon-chatboxes-filled"></span>
        <span class="mui-tab-label">分类</span>
      </span>
      <span class="mui-tab-item" :class="{active:this.$route.query.bookListType=='search'||this.$route.path.indexOf('/search')>-1}"@click="routeGo('/search')">
        <span class="mui-icon mui-icon-search"></span>
        <span class="mui-tab-label">搜索</span>
      </span>
    </nav>
  </div>
</template>

<script>

  export default {
    name: "App",
    data() {
      return {
        transitionName:'',
        backIcon: false,
        index:1,
        touchStar:0,
        touchEnd:0,
        direction:'left'
      }
    },
    created() {
      if (this.$routerName.indexOf(this.$route.path) > -1) {
        this.backIcon = false
      } else {
        this.backIcon = true
      }
    },
    methods: {

      routeGo(name){
        this.transitionName='normal'
         this.$router.push({
           path:name
         })
      },
      moveRouterTo(){
          if(this.index==1){
             this.$router.push({
               path:'/home'
             })
          }else if(this.index==2){
            this.$router.push({
              path:'/recommend'
            })
          }else if(this.index==3){
            this.$router.push({
              path:'/classification'
            })
          }else if(this.index==4){
            this.$router.push({
              path:'/search'
            })
          }

      },
      appTouchStar(e){
        this.touchStar = e.changedTouches[0].clientX
      },
      appTouchEnd(e){
        this.touchEnd = e.changedTouches[0].clientX
        //判断移动左边还是右边
        if (this.touchStar - this.touchEnd > 0) {
          this.direction = 'left'
        } else {
          this.direction = 'right'
        }
        if (Math.abs(this.touchStar - this.touchEnd) > 80){
          if (this.direction == 'left') {
            if(this.index<4){
              this.index++
              this.moveRouterTo()
            }
            this.transitionName='left'
          } else {
            if(this.index>1){
              this.index--
              this.moveRouterTo()
            }
            this.transitionName='right'
          }
        }
      },
      //返回键
      back() {
        this.$router.go(-1);
      },
    },
    watch: {
      $route(value,from) {
        if (this.$routerName.indexOf(value.path) > -1) {
          this.backIcon = false
        } else {
          this.backIcon = true
        }
        if(value.meta.index<from.meta.index){
          this.transitionName="right"
        }else{
          this.transitionName="left"
        }
        //判断路由改变index，实现滑动跳转标记
        if(value.path.indexOf('/home')>-1 || value.query.bookListType=='home') {
          this.index=1
        }else if(value.path.indexOf('/recommend')>-1 || value.query.bookListType=='recommend'){
          this.index=2
        }else if(value.path.indexOf('/classification')>-1 || value.query.bookListType=='classification'){
          this.index=3
        }else if(value.path.indexOf('/search')>-1 || value.query.bookListType=='search'){
          this.index=4
        }
      }
    }
  };
</script>

<style lang="less" scoped>
   .mui-bar-tab{
     height: 12.5vw;
     .mui-tab-item{
       height: 100%;
     }
     .mui-icon{
       font-size: 6vw;
       height: 6vw;
       width: 6vw;
     }
     .mui-tab-label{
       line-height: 5.25vw;
       width: 100%;
       height: 5.25vw;
       font-size: 2.75vw!important;
     }
   }
  .active {
    color: mediumpurple!important;
  }

  /deep/ .mui-active {
    color: mediumpurple;
  }

  .padd {
    padding: 10vw 0px 50px 0px;
  }
  .nopadd{
    padding: 0;
  }

  .mui-bar-nav {
    height: 10vw;
    background-color: mediumpurple;
    h1 {
      color: #343434;
      font-size: 4.5vw;
      line-height: 11vw;
    }
  }

  .read-content {
    min-height: 100vh;
    overflow: hidden;
  }

  .left-enter {
    opacity: 0;
    transform: translateX(100%);
  }
  .left-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    position: fixed;
  }
  .left-enter-active,
  .left-leave-active {
    transition: all 0.4s ease;
  }
  .right-enter {
    opacity: 0;
    transform: translateX(-100%);
  }
  .right-leave-to {
    opacity: 0;
    transform: translateX(100%);
    position: fixed;
  }
  .right-enter-active,
  .right-leave-active {
    transition: all 0.4s ease;
  }
</style>
