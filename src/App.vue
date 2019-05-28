<template>
  <div class="read-content padd" @touchstart="appTouchStar" @touchend="appTouchEnd">

    <!--头部-->
    <header class="mui-bar mui-bar-nav">
      <i class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back" v-if="backIcon"></i>
      <h1 class="mui-title">追哥阅读</h1>
    </header>
    <!--中间内容 、路由-->
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>

    <!--底部导航栏-->
    <nav class="mui-bar mui-bar-tab" style="box-shadow: 0 0 1px rgba(0,0,0,0.3); z-index: 20000">
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
      <span class="mui-tab-item" :class="{active:this.$route.query.bookListType=='ranking'||this.$route.path.indexOf('/ranking')>-1}"@click="routeGo('/ranking')">
        <span class="mui-icon mui-icon-flag"></span>
        <span class="mui-tab-label">排行</span>
      </span>
    </nav>
  </div>
</template>

<script>

  export default {
    name: "App",
    data() {
      return {
        transitionName:'normal',
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
              path:'/ranking'
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
        if (Math.abs(this.touchStar - this.touchEnd) > 40){
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
      $route(value) {
        if (this.$routerName.indexOf(value.path) > -1) {
          this.backIcon = false
        } else {
          this.backIcon = true
        }

        //判断路由改变index，实现滑动跳转标记
        if(value.path.indexOf('/home')>-1 || value.query.bookListType=='home') {
          this.index=1
        }else if(value.path.indexOf('/recommend')>-1 || value.query.bookListType=='recommend'){
          this.index=2
        }else if(value.path.indexOf('/classification')>-1 || value.query.bookListType=='classification'){
          this.index=3
        }else if(value.path.indexOf('/ranking')>-1 || value.query.bookListType=='ranking'){
          this.index=4
        }
      }
    }
  };
</script>

<style lang="less" scoped>

  .active {
    color: mediumpurple;
  }

  /deep/ .mui-active {
    color: mediumpurple !important;
  }

  .padd {
    padding: 44px 0px 50px 0px;
  }

  .mui-bar-nav {
    background-color: mediumpurple;
  }

  .read-content {
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

  .normal-enter {
    opacity: 0;
  }
  .normal-leave-to {
    opacity: 0;
    position: fixed;

  }
  .normal-enter-active,
  .normal-leave-active {
    transition: all 0.6s ease;
  }

</style>
