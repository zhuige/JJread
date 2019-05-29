<template>
  <div style="overflow: hidden">
    <mu-container v-if="bookList.length<=0" style="position: fixed">
      <mu-flex class="demo-linear-progress">
        <mu-linear-progress></mu-linear-progress>
      </mu-flex>
    </mu-container>
    <div class="booksList-content">
      <h2>{{this.className}}&nbsp;>&nbsp;{{this.name}}</h2>
      <book-view :data="bookList"></book-view>
    </div>
  </div>
</template>

<script>
  import BookView from './booksView'

  export default {
    name: "booksList",
    components: {
      BookView
    },
    data() {
      return {

        obj:{
          'male':'男生',
          'female':'女生',
          'picture':'精品',
          'press':'出版'
        },
        className:'',
        classType: this.$route.query.classType,
        name: this.$route.query.name,
        bookList: []
      }
    },
    created() {
      this.getBooksList()
      if(this.obj[this.$route.query.classType]){
         this.className=this.obj[this.$route.query.classType]
      }else{

      }
    },
    methods: {
      getBooksList() {
        this.$http.get('/api/book/by-categories?gender=' + this.classType + '&type=hot&major=' + this.name + '&minor=&start=0&limit=60').then(result => {
          if (result.statusText == 'OK') {
            this.bookList = result.data.books
            this.bookList.forEach(value => {
              value.cover = unescape(value.cover.slice(7))
            })
          } else {
            this.$toast('获取数据失败')
          }

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .booksList-content {
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
