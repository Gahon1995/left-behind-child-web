import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/404', '/', '/list', ''] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  } else {
    if (store.getters.token) { // 判断是否有token
      if (to.path === '/login') {
        next({
          path: '/dashboard'
        })
      } else {
        if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetInfo').then(res => { // 拉取info
            const roles = res.data.roles
            store.dispatch('GenerateRoutes', {
              roles
            }).then(() => { // 生成可访问的路由表
              router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
              next({ ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        next('/') // 否则全部重定向到登录页
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
