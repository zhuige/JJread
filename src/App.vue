<template>
  <div class="read-content padd">
    <!--头部-->
    <header class="mui-bar mui-bar-nav">
      <i class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left" @click="back" v-if="backIcon"></i>
      <h1 class="mui-title">追哥阅读</h1>
    </header>
    <!--中间内容 、路由-->
    <transition>
      <router-view></router-view>
    </transition>

    <!--底部导航栏-->
    <nav class="mui-bar mui-bar-tab" style="box-shadow: 0 0 1px rgba(0,0,0,0.3); z-index: 20000">
      <router-link class="mui-tab-item" to="/home" :class="{active:this.$route.query.bookListType=='home'}">
        <span class="mui-icon mui-icon-home"></span>
        <span class="mui-tab-label">书架</span>
      </router-link>
      <router-link class="mui-tab-item" :class="{active:this.$route.query.bookListType=='recommend'}" to="/recommend">
        <span class="mui-icon mui-icon-paperplane"></span>
        <span class="mui-tab-label">推荐</span>
      </router-link>
      <router-link class="mui-tab-item" to="/classification"
                   :class="{active:this.$route.query.bookListType=='classification'}">
        <span class="mui-icon mui-icon-chatboxes-filled"></span>
        <span class="mui-tab-label">分类</span>
      </router-link>
      <router-link class="mui-tab-item" to="/ranking" :class="{active:this.$route.query.bookListType=='ranking'}">
        <span class="mui-icon mui-icon-flag"></span>
        <span class="mui-tab-label">排行</span>
      </router-link>
    </nav>
  </div>
</template>

<script>

  export default {
    name: "App",
    data() {
      return {
        backIcon: false
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

  .v-enter {
    opacity: 0;
    transform: translateX(100%);
  }

  .v-leave-to {
    opacity: 0;
    transform: translateX(-100%);
    position: absolute;
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.4s ease;
  }
</style>
