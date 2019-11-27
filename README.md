# purchaseAgent

> vue代购管理系统

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## 注意事项
``` bash
# 1、修改node_modules/xlsx-style/cpexcel.js 807行
[var cpt = require('./cpt' + 'able');]=>[var cpt = cptable;]
# 2、修改引用组件方法
在main.js中使用Vue.prototype定义全局变量，并在home.vue的created或者mounted方法中使用this.重写方法

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
