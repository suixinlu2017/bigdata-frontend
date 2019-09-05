import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '总览', icon: 'dashboard' }
    }]
  },
  {
    path: '/house',
    component: Layout,
    children: [
      {
        path: 'HouseEdit.vue',
        name: 'HouseEdit',
        component: () => import('@/views/house/index'),
        meta: { title: '大数据楼盘管理', icon: 'form' }
      }
    ]
  },
  /*
    {
      path: '/company',
      component: Layout,
      children: [
        {
          path: 'HouseEdit.vue',
          name: 'Company',
          component: () => import('@/views/company/index'),
          meta: { title: '公司管理', icon: 'form' }
        }
      ]
    },
    {
      path: '/basedata',
      component: Layout,
      children: [
        {
          path: 'index',
          name: 'basedata',
          component: () => import('@/views/basedata/index'),
          meta: { title: '楼盘基础数据', icon: 'form' }
        }
      ]
    },
    {
      path: '/house/operationRecord',
      component: Layout,
      children: [
        {
          path: 'operationRecord.vue',
          name: 'OperationRecord',
          component: () => import('@/views/house/operationRecord'),
          meta: { title: '楼盘操作记录', icon: 'form' }
        }
      ]
    },*/
  //
  // {
  //   path: '/test',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Test',
  //       component: () => import('@/views/building/index'),
  //       meta: { title: '楼栋单元', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/unit',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'unit',
  //       component: () => import('@/views/unit/index'),
  //       meta: { title: '楼层房号', icon: 'form' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
