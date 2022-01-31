import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '*',
    name: 'Error',
    component: () => import('../components/NotFoundScreen.vue')
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../components/Dashboard.vue')
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: "/dashboard/",
  routes
})

export default router
