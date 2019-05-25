import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home'
import recommend from '../components/recommend'
import classification from '../components/classification'
import ranking from '../components/ranking'
import booksList from '../components/booksList/booksList'
import booksDetail from '../components/booksDetail/booksDetail'


Vue.use(Router)
const router = new Router({
  routes: [
    {path: '/', redirect: '/home'},
    {path: '/home', name: 'home', component: home},
    {path: '/recommend', name: 'recommend', component: recommend},
    {path: '/classification', name: 'classification', component: classification},
    {path: '/ranking', name: 'ranking', component: ranking},
    {path: '/classification/booksList', name: 'booksList', component: booksList},
    {path: '/booksDetail', name: 'booksDetail', component: booksDetail},
  ],
  linkActiveClass: 'mui-active'
})

export default router
