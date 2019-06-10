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
      path: '/home/error',
      component: resolve => require(['./components/404.vue'], resolve),
      name: ''
    }, {
      path: '/home/usersInfo',
      component: resolve => require(['./components/system/usersInfo.vue'], resolve),
      name: ''
    }
  ]
}];

var router = new VueRouter({
  routes
})
export default router;
