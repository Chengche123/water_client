import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'
import store from '@/store';
import { API } from '@/App'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login'),
    beforeEnter: async (to, from, next) => {
      try {
        await axios.get(API.user);
        next({ name: 'home' })
      } catch (error) {
        next()
      }
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register/Register'),
    beforeEnter: async (to, from, next) => {
      // 和登录路由一样，如果已登录，就直接跳转到主页
      try {
        await axios.get(API.user);
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
  if (to.name == 'login' || to.name == 'register') {
    next()
    return
  }

  try {
    const response = await axios.get(API.user);
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
