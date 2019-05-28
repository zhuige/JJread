// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './lib/hello-mui/css/mui.min.css'
import 'flex.css/dist/data-flex.css'
import 'less/dist/less.min'
import axios from 'axios'
import './appback'

Vue.prototype.$http = axios
Vue.prototype.$routerName=['/home', '/recommend', '/classification', '/search'],
Vue.use(MuseUI)
Vue.use(MintUI)


import store from './vuex/index'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
