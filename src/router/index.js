import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'
import store from '@/store';

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
    component: () => import(/* webpackChunkName: "test" */ '../views/Test')
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import(/* webpackChunkName: "test1" */ '../views/sensor/SensorList')
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: { name: 'home' } },
  {
    path: '/sensor-detail',
    name: 'sensor-detail',
    component: () => import(/* webpackChunkName: "sensorDetail" */ '../views/sensor/SensorDetail')
  },
  // 实时监测页面
  {
    path: '/sensor-home',
    name: 'sensor-home',
    component: () => import(/* webpackChunkName: "sensorDetail" */ '../views/sensor/SensorHome')
  },
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
    const response = await axios.get("/user");
    if (!store.state.user) {
      store.commit('changeUser', response?.data)
    }
  } catch (error) {
    next({ name: 'login' })
    return;
  }

  next()
})

export default router
