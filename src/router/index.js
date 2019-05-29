import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home'
import recommend from '../components/recommend'
import classification from '../components/classification'
import search from '../components/search'
import booksList from '../components/booksList/booksList'
import booksDetail from '../components/booksDetail/booksDetail'
import searchResult from '../components/searchResult/searchResult'


Vue.use(Router)
const router = new Router({
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/home', name: 'home', component: home,meta:{index:1}},
    {path: '/recommend', name: 'recommend', component: recommend,meta:{index:2}},
    {path: '/classification', name: 'classification', component: classification,meta:{index:3}},
    {path: '/search', name: 'search', component: search,meta:{index:4}},
    {path: '/classification/booksList', name: 'booksList', component: booksList,meta:{index:3}},
    {path: '/booksDetail', name: 'booksDetail', component: booksDetail},
    {path: '/search/searchResult', name: 'searchResult', component: searchResult,meta:{index:4}},
  ],
  linkActiveClass: 'mui-active'
})

export default router
