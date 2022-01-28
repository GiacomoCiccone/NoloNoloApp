import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
//import store from './store';
//import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/main.css'

//axios.defaults.withCredentials = true
//axios.defaults.baseURL = 'http://localhost:8080/api/auth';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
