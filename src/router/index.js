import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import home from '../views/home'
import homeContent from '../views/homeContent'
import carousel from '../views/carousel'
import {
  Message
} from 'element-ui'
import check from '../../utils/check.js'
const Route = Router
Vue.use(Router)

const router = new Route({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/carousel',
    children: [{
      path: '/carousel',
      name: 'carousel',
      component: carousel
    }, {
      path: '/homeContent',
      name: 'homeContent',
      component: homeContent
    }]
  }]
})

router.beforeEach(async (to, from, next) => {
  const loginOverdue = JSON.parse(localStorage.getItem('loginOverdue'))
  // const autoLogin = JSON.parse(localStorage.getItem('autoLogin'))
  if (loginOverdue) {
    localStorage.removeItem('loginOverdue')
    next('/login')
    return
  }
  /* 检测是否拥有访问当前页面的权限 */
  const checkResult = await check.checkRouter(to)
  if (checkResult) {
    next()
  } else {
    Message({
      type: 'error',
      message: '对不起，您暂无权限访问当前页面'
    })
  }
})

export default router
