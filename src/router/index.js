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
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/public/login/index'),
  hidden: true
},
{
  path: '/list',
  hidden: true,
  component: Layout,
  children: [{
    path: '',
    // name: 'dashboard',
    component: () => import('@/views/public/list'),
    meta: {
      title: '需求列表',
      icon: 'demand'
    }
  }]

},
{
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
},
{
  path: '/',
  hidden: true,
  component: Layout,
  children: [{
    path: '',
    // name: 'dashboard',
    component: () => import('@/views/public/index'),
    meta: {
      title: '主页',
      icon: 'dashboard'
    }
  }]
}
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRouterMap = [{
  path: '/dashboard',
  component: Layout,
  // redirect: '/dashboard',
  meta: {
    roles: ['admin', 'user']
  },
  children: [{
    path: '',
    // name: 'dashboard',
    component: () => import('@/views/public/dashboard/index'),
    meta: {
      title: 'Dashboard',
      icon: 'dashboard'
    }
  }]
},
{
  path: '/admin/users',
  component: Layout,
  meta: {
    roles: ['admin']
  },
  children: [{
    path: '',
    name: 'usersinfo',
    component: () => import('@/views/admin/userinfo/index'),
    meta: {
      title: '用户信息',
      icon: 'peoples'
    }
  }]
},

{
  path: '/admin/points',
  component: Layout,
  meta: {
    roles: ['admin']
  },
  children: [{
    path: '',
    name: 'points',
    component: () => import('@/views/admin/point/index'),
    meta: {
      title: '服务点信息',
      icon: 'point'
    }
  }]
},

{
  path: '/admin/demands',
  component: Layout,
  meta: {
    roles: ['admin']
  },
  children: [{
    path: '',
    name: 'demands',
    component: () => import('@/views/admin/demands/index'),
    meta: {
      title: '需求信息列表',
      icon: 'demand'
    }
  }]
},
{
  path: '/user/points',
  component: Layout,
  meta: {
    title: '服务点管理',
    icon: 'point',
    roles: ['user']
  },
  children: [{
    path: '',
    name: 'userpoints',
    component: () => import('@/views/user/points/index'),
    meta: {
      title: '我的服务点',
      icon: 'point'
    }
  },
  {
    path: 'create',
    name: 'pointcreate',
    component: () => import('@/views/user/points/create'),
    meta: {
      title: '申请服务点',
      icon: 'apply'
    }
  },
  {
    path: 'edit/:id(\\d+)',
    component: () => import('@/views/user/points/edit'),
    hidden: true,
    name: 'pointedit',
    meta: {
      title: '编辑服务点',
      icon: 'documentation'
    }
  }
  ]
},
{
  path: '/user/demands',
  component: Layout,
  meta: {
    title: '需求管理',
    icon: 'demand',
    roles: ['user']
  },
  children: [{
    path: '',
    name: 'userdemands',
    component: () => import('@/views/user/demands/index'),
    meta: {
      title: '我的需求',
      icon: 'demand'
    }
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]
