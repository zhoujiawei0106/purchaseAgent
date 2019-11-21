import Vue from "vue"
import VueRouter from "vue-router"

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

// 使用懒加载路由配置
let routes = [{
  path: '/login',
  component: resolve => require(['./components/login.vue'], resolve),
  name: '',
  hidden: true
}, {
  path: '/404',
  component: resolve => require(['./components/404.vue'], resolve),
  name: '',
  hidden: true
}, {
  path: '/home',
  component: resolve => require(['./components/home.vue'], resolve),
  name: '',
  children: [
    {
      path: '/home/404',
      component: resolve => require(['./components/404.vue'], resolve),
      name: '',
      hidden: true
    }, {
      path: '/home/error',
      component: resolve => require(['./components/404.vue'], resolve),
      name: ''
    }, {
      path: '/home/usersInfo',
      component: resolve => require(['./components/system/user/list.vue'], resolve),
      name: '用户管理'
    }, {
      path: '/home/commodity',
      component: resolve => require(['./components/purchase/commodity/list.vue'], resolve),
      name: '商品管理'
    }, {
      path: '/home/customer',
      component: resolve => require(['./components/purchase/customer/list.vue'], resolve),
      name: '客户管理'
    }, {
      path: '/home/inventory',
      component: resolve => require(['./components/purchase/inventory/list.vue'], resolve),
      name: '库存管理'
    }, {
      path: '/home/order',
      component: resolve => require(['./components/purchase/order/list.vue'], resolve),
      name: '订单管理'
    }, {
      path: '/home/schedule',
      component: resolve => require(['./components/purchase/schedule/list.vue'], resolve),
      name: '行程管理'
    }, {
      path: '/home/role',
      component: resolve => require(['./components/system/role/list.vue'], resolve),
      name: '角色管理'
    }
  ]
}];

var router = new VueRouter({
  routes
})
export default router;
