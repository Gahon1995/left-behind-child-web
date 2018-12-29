import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
  // { path: '/', component: () => import('@/views/public/index'), hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表
// maintenance 代表维保单位typeid(1) m1(主管理员) m2(子管理员) m3(普通员工)
// property 代表使用单位typeid(2) p1(主管理员) p2(子管理员) p3(普通员工)
// government 代表质检单位typeid(3) g1(主管理员) g2(子管理员) g3(普通员工)
export const asyncRouterMap = [
  {
    path: '/',
    component: Layout,
    name: 'index',
    redirect: '/dashboard',
    meta: { roles: ['admin', 'user'] },
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/admin/users',
    component: Layout,
    meta: { roles: ['admin', 'user'] },
    children: [
      {
        path: '',
        name: 'usersinfo',
        component: () => import('@/views/userinfo/index'),
        meta: { title: '用户信息', icon: 'peoples' }
      }
    ]
  },

  {
    path: '/admin/points',
    component: Layout,
    meta: { roles: ['admin'] },
    children: [
      {
        path: '',
        name: 'points',
        component: () => import('@/views/point/index'),
        meta: { title: '服务点信息', icon: 'international' }
      }
    ]
  },

  {
    path: '/admin/demands',
    component: Layout,
    meta: { roles: ['admin', 'user'] },
    children: [
      {
        path: '',
        name: 'demands',
        component: () => import('@/views/demands/index'),
        meta: { title: '需求信息列表', icon: 'documentation' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
