<template>
  <div style="width: 200px;height: 200px;background-color: #b2dba1;">排行</div>
</template>

<script>
  export default {
    name: "ranking",
    mounted() {

      window.history.pushState(null, null, document.URL);
      // 给window添加一个popstate事件，拦截返回键，执行this.onBrowserBack事件，addEventListener需要指向一个方法
      window.addEventListener("popstate", this.onBrowserBack, false);
    },
    destroyed() {
      // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
      window.removeEventListener("popstate", this.onBrowserBack, false);
    },
    methods: {
      onBrowserBack() {
        if (this.$routerName.indexOf(this.$route.path) > -1) {
          window.history.pushState(null, null, document.URL);
          this.$toast({position: 'bottom', duration: 500, message: '再按一次退出'})
        }
      }
    }
  }
</script>

<style scoped>

</style>
