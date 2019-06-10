import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router';
import App from './App.vue';
import 'font-awesome/css/font-awesome.min.css';
// 引入路由
import router from "./router.js";
// fade/zoom 等
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

Vue.use(ElementUI);
Vue.use(Router);
Vue.component(CollapseTransition.name, CollapseTransition)

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({
      path: '/login'
    });
  } else if(to.matched.length > 0) {
    next();
  } else if(to.path == '/') {
    next('/home')
  } else {
    next('/404')
  }
});

new Vue({
  el: '#app',
  router, // 注入到根实例中
  render: h => h(App)
});
