import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Manage from '../views/Manage.vue'
import New from '../views/New.vue'
import Dashboard from '../views/Dashboard.vue'
import axios from "axios";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/manage',
    name: 'Manage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Manage //() => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/new',
    name: 'New',
    component: New
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    console.log(to.hash)
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
  }
})

router.beforeEach((to, from, next) => {
  const request_ping = {
    withCredentials: true
  };
  if (to.name == "Home"){
    next();
  } else {
    axios.get("http://localhost:8000/ping", request_ping).then((resp)=>{
      next()
    }, (err)=>{
      next(false)
    })
  }
})

export default router
