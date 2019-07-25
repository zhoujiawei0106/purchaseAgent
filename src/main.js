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
// 引入axios
import axios from 'axios';
import qs from 'qs';
import common from "./components/common/js/common.js";

Vue.use(ElementUI);
Vue.use(Router);
Vue.component(CollapseTransition.name, CollapseTransition);
Vue.prototype.$axios= axios;
Vue.prototype.$qs = qs;
Vue.prototype.$common = common;
Vue.config.productionTip = false;

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

axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem("token");
  // let token = sessionStorage.getItem("user");
  if (token) {
    config.headers['token'] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (config) {
  if (!config.data.flag && config.data.code == 412) {
    Vue.prototype.$alert('用户登陆已失效，请重新登陆', '提示', {
      confirmButtonText: '确定',
      callback: action => {
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push({ path: '/login' });
      }
    });
  }
  return config;
}, function (error) {
  return error;
})

new Vue({
  el: '#app',
  router, // 注入到根实例中
  render: h => h(App)
});
