<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style>
  body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  #app {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  /** 所有查询页面el-form标签引用的样式 */
  .search-element-form {
    text-align: center;
    padding-top: 2%;
  }

  /** 所有查询页面按钮引用的样式 */
  .search-form-btn {
    padding-bottom: 0.5%;
    text-align: center;
  }

  /** 所有查询页面收缩按钮 */
  .search-item-icon {
    text-align: center;
    border-top:1px solid #ebebeb;
    border-bottom:1px solid #ebebeb;
    font-size: 18px;
    cursor: pointer;
  }
</style>
