import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
    beforeEnter: async (to, from, next) => {
      try {
        await axios.get("/user");
        next({ name: 'home' })
      } catch (error) {
        next()
      }
    },
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../components/lineChart.vue')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: { name: 'home' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.name == 'login') {
    next()
    return
  }

  try {
    await axios.get("/user");
  } catch (error) {
    next({ name: 'login' })
    return;
  }

  next()
})

export default router
