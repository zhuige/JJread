<template>
  <div class="reading-content">

  </div>
</template>

<script>
  export default {
    name: "reading",
    data() {
      return {
        id: this.$route.query.id,
        link: '',
        chapterList: [],
        trueId: '',
        link: '',
        chapterContent:{},
        textList:[]
      }
    },
    methods: {
      //获取正版
      getTrue() {
        this.$http.get('/api/btoc?view=summary&book=' + this.id).then(result => {
          if (result.statusText == 'OK') {
            this.trueId = result.data[0]._id
            this.getChapter()
          } else {
            this.$toast('获取正版源失败')
          }
        })
      },
      //获取章节
      getChapter() {
        this.$http.get('/api/atoc/' + this.trueId + '?view=chapters').then(result => {
          if (result.statusText == 'OK') {
            this.chapterList = result.data.chapters
            this.link=this.chapterList[0].link
            this.getReadingContent()
          } else {
            this.$toast('获取章节失败')
          }
        })
      },
      //获取章节内容
      getReadingContent() {
        this.$http.get('/chapter/' + this.link).then(result => {
          if (result.statusText == 'OK') {
            this.chapterContent=result.data.chapter
            this.textList = this.chapterContent.cpContent.split('\n')

          } else {
            this.$toast('获取章节内容失败')
          }
        })
      }
    },
    created() {
      this.getTrue()

    },
    mounted() {
      if (this.$route.query.bookListType.indexOf('recommend') != -1) {
        this.bookListType = 'recommend'
        this.$route.meta.index = 2
      } else if (this.$route.query.bookListType.indexOf('home') != -1) {
        this.bookListType = 'home'
        this.$route.meta.index = 1
      } else if (this.$route.query.bookListType.indexOf('classification') != -1) {
        this.bookListType = 'classification'
        this.$route.meta.index = 3
      } else if (this.$route.query.bookListType.indexOf('search') != -1) {
        this.bookListType = 'search'
        this.$route.meta.index = 4
      } else {

      }
    },

  }
</script>

<style lang="less" scoped>
.reading-content{
position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(1,1,1,1);
}
</style>
