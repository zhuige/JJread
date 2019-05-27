import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    booksLikeList:[]
  },
  mutations: {
    //获取locakstoreage，书架功能
    getBooksLikeList(state){
      if(!JSON.parse(localStorage.getItem('booksLike'))){
        state.booksLikeList=[]
      }else{
        state.booksLikeList=JSON.parse(localStorage.getItem('booksLike'))
      }
    },
  },
  getters: {},
  actions: {}
})
