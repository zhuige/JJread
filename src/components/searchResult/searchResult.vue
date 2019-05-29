<template>
    <div>
      <mu-container v-if="loading" style="position: fixed">
        <mu-flex class="demo-linear-progress">
          <mu-linear-progress></mu-linear-progress>
        </mu-flex>
      </mu-container>
      <div class="search-result">
        <h2>搜索&nbsp;>&nbsp;{{this.searchName}}</h2>
        <book-view :data="searchResultList"></book-view>
      </div>
    </div>
</template>

<script>
  import BookView from '../booksList/booksView'
    export default {
        name: "searchResult",
        data(){
          return{
            searchName:this.$route.query.searchName,
            searchResultList:[],
            loading:true
          }
        },
      components:{
        BookView
      },
      created(){
          this.gerSearchList()
      },
        methods:{
            gerSearchList(){
                this.$http.get('/api/book/fuzzy-search?query='+this.searchName).then(result=>{
                  if (result.statusText == 'OK') {
                    this.searchResultList = result.data.books
                    this.searchResultList.forEach(value => {
                      value.cover = unescape(value.cover.slice(7))
                    })
                    this.loading=false
                  }else{
                    this.$toast('请求失败')
                  }

                })
            }
        }
    }
</script>

<style lang="less" scoped>
  .search-result{
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
