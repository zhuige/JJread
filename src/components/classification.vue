<template>
  <div>
    <mu-container v-if="classList.male.length<=0">
      <mu-flex class="demo-linear-progress">
        <mu-linear-progress></mu-linear-progress>
      </mu-flex>
    </mu-container>
    <div class="class-content">
      <h2 class="class-name" v-if="classList.male.length>0">男生</h2>
      <div class="center" data-flex="cross:top">
        <div data-flex-box="0" class="item" v-for="(item,index) in classList.male" :key="index"
             @click="routerGo({classType:'male',name:item.name})">
          <div data-flex="cross:top">
            <div data-flex-box="0"><img :src="item.bookCover[0]" alt=""></div>
            <div data-flex-box="0" class="right">
              <h3>{{item.name}}</h3>
              <h4>{{item.bookCount}}&nbsp;本</h4>
            </div>
          </div>
        </div>
      </div>
      <h2 class="class-name" v-if="classList.female.length>0">女生</h2>
      <div class="center" data-flex="cross:top">
        <div data-flex-box="0" class="item" v-for="(item,index) in classList.female" :key="index"
             @click="routerGo({classType:'female',name:item.name})">
          <div data-flex="cross:top">
            <div data-flex-box="0"><img :src="item.bookCover[0]" alt=""></div>
            <div data-flex-box="0" class="right">
              <h3>{{item.name}}</h3>
              <h4>{{item.bookCount}}&nbsp;本</h4>
            </div>
          </div>
        </div>
      </div>
      <h2 class="class-name" v-if="classList.picture.length>0">精品</h2>
      <div class="center" data-flex="cross:top">
        <div data-flex-box="0" class="item" v-for="(item,index) in classList.picture" :key="index"
             @click="routerGo({classType:'picture',name:item.name})">
          <div data-flex="cross:top">
            <div data-flex-box="0"><img :src="item.bookCover[0]" alt=""></div>
            <div data-flex-box="0" class="right">
              <h3>{{item.name}}</h3>
              <h4>{{item.bookCount}}&nbsp;本</h4>
            </div>
          </div>
        </div>
      </div>
      <h2 class="class-name" v-if="classList.press.length>0">出版</h2>
      <div class="center" data-flex="cross:top">
        <div data-flex-box="0" class="item" v-for="(item,index) in classList.press" :key="index"
             @click="routerGo({classType:'press',name:item.name})">
          <div data-flex="cross:top">
            <div data-flex-box="0"><img :src="item.bookCover[0]" alt=""></div>
            <div data-flex-box="0" class="right">
              <h3>{{item.name}}</h3>
              <h4>{{item.bookCount}}&nbsp;本</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "class",
    data() {
      return {
        classList: {
          female: [],
          male: [],
          picture: [],
          press: []
        }
      }
    },
    created() {
      this.getClassList()
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
    methods: {
      onBrowserBack() {
        if (this.$routerName.indexOf(this.$route.path) > -1) {
          window.history.pushState(null, null, document.URL);
          this.$toast({position: 'center', duration: 500, message: '再按一次退出'})
        }
      },
      getClassList() {
        this.$http.get('/api/cats/lv2/statistics').then(result => {
          if (result.statusText == 'OK') {
            this.classList.female = result.data.female
            this.classList.male = result.data.male
            this.classList.picture = result.data.picture
            this.classList.press = result.data.press
            for (let ii in this.classList) {
              this.classList[ii].forEach(value => {
                value.bookCover[0] = unescape(value.bookCover[0].slice(7))
              })
            }
          } else {
            this.$toast('获取数据失败')
          }
        })
      },
      routerGo(obj) {
        this.$router.push({
          path: '/classification/booksList',
          query: {
            name: obj.name,
            classType: obj.classType
          }
        })
      }
    },


  }
</script>

<style lang='less' scoped>

  .class-content {
    .class-name {
      color: rebeccapurple;
      margin-left: 2.4155vw;
      width: 100%;
      font-size: 6vw;
      margin-top: 2.4155vw;
    }
    .center {
      flex-wrap: wrap;
      .item {
        margin: 2.4155vw;
        width: 45vw;
        height: 24.2vw;
        border: 1px solid rgba(155, 155, 155, 0.2);
        border-radius: 4px;
      }
      img {
        height: 24vw;
        width: 18.1vw;
        display: inline-block;
      }
      .right {
        height: 24.2vw;
        padding: 4.8vw 0 0 4.8vw;
        h3 {
          width: 20vw;
          font-size: 4.8vw;
          color: #4A4A4A;
        }
        h4 {
          margin-top: 2.2vw;
          font-size: 2.9vw;
          color: #999999;
          font-weight: 400;
        }
      }
    }
  }
</style>
