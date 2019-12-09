<template lang="html">
  <el-container style="height: 100%; border: 1px solid #eee;width: 100%">
    <el-header style="text-align: right;" height="10%">
      <span style="font-size: 16px;">欢迎 {{ userName }}</span>
      <el-dropdown>
        <i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container style="height: 87%;">
      <el-aside :width="leftSideWidth">
        <div class="no-mode-translate-wrapper">
          <el-button icon="el-icon-d-arrow-right" v-if="isCollapse" key="off" @click="collapseMenu"
                     :style="collapseCloseBtn" size="small"></el-button>
          <el-button icon="el-icon-d-arrow-left" v-else="" key="on" @click="collapseMenu" :style="collapseOpenBtn"
                     size="small"></el-button>
        </div>
        <div>
          <!-- 最多只支持3层目录 -->
          <el-menu unique-opened :collapse="isCollapse" class="el-menu-vertical">
            <el-submenu v-for="menu in menus" :key="menu.id" :index="menu.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ menu.name }}</span>
              </template>
              <el-menu-item-group v-for="subMenu in menu.subMenus" :key="subMenu.id" :index="subMenu.id">
                <router-link v-if="subMenu.subMenus.length == 0" :key="subMenu.id" :to="subMenu.url" tag="li">
                  <el-menu-item :index="subMenu.id">{{ subMenu.name }}</el-menu-item>
                </router-link>
                <el-submenu v-if="subMenu.subMenus.length > 0" :index="subMenu.id">
                  <template slot="title">{{ subMenu.name }}</template>
                  <el-menu-item v-for="next in subMenu.subMenus" :key="next.id" :index="next.id">{{ next.name }}</el-menu-item>
                </el-submenu>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>

      <el-main :width="rightSideWidth">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.id">
            {{breadcrumb.name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <hr v-show="breadcrumbs.length > 0"/>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer height="3%" width="100%" style="text-align: center; font-size: 12px">如有问题,请咨询.
      <strong>微信:xxx 电话:021-12345678</strong></el-footer>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        // 登陆用户
        userName: '',
        // 菜单数据
        menus: [],
        // 面包屑
        breadcrumbs: [],
        // 菜单是否展开(默认是)
        isCollapse: false,
        rightSideWidth: '85%',
        leftSideWidth: '15%',
        // 菜单展开样式
        collapseOpenBtn: {
          'margin-top': '1px',
          'margin-left': '0.5%'
        },
        // 菜单关闭样式
        collapseCloseBtn: {
          'margin-top': '1px',
          'margin-left': '0.5%'
        }
      }
    },
    methods: {
      /**
       * 退出登录
       */
      logout: function () {
        this.$confirm('是否确定退出登陆?', '退出登陆', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'info',
          center: true
        }).then(() => {
          sessionStorage.removeItem('user');
          localStorage.removeItem('token');
          this.$router.push('/login');
        }).catch(() => {

        });
      },
      /**
       * 修改菜单收缩
       */
      collapseMenu: function () {
        this.isCollapse = !this.isCollapse;
        if (this.isCollapse) {
          this.rightSideWidth = '95%';
          this.leftSideWidth = '5%';

        } else {
          this.rightSideWidth = '87%';
          this.leftSideWidth = '13%';
        }
      },
      /**
       * 根据不同常见(直接访问路径，点击菜单)修改面包屑组件在vue中的值
       * @param menus 菜单数据数组
       * @param breadcrumbs 面包屑数组
       * @param url 当前/跳转的url
       */
      initBreadcrumbs: function (menus, breadcrumbs, url) {
        // 情况面包屑在vue中的值
        this.breadcrumbs.splice(0, this.breadcrumbs.length);

        this.menus.find(function (value, index, arr) {
          if (value.subMenus.length > 0) {
            value.subMenus.find(function (subVal, subIndex, subArr) {
              // 如果子菜单中的url和路由相同，修改面包屑在vue中的值(暂时菜单中只会有父子2层菜单)
              if (subVal.url == url) {
                breadcrumbs.splice(0, 0, {
                  id: subVal.id,
                  name: subVal.name
                });
                breadcrumbs.splice(0, 0, {
                  id: value.id,
                  name: value.name
                });
                return;
              }
            });
          }
        });
      }
    },
    watch: {
      // 观察路由，路由改变时修改面包屑
      $route(to, from){
        this.initBreadcrumbs(this.menus, this.breadcrumbs, to.path);
      }
    },
    created: function () {
      let that = this;
      this.userName = JSON.parse(sessionStorage.getItem('user')).userName;

      // vue中的菜单
      let menus = this.menus;
      this.$axios.get(this.$common.contentPath + '/userMenu/' + this.$common.changeString(
        JSON.parse(sessionStorage.getItem('user')).loginName)).then(function (data) {
        if (data.data.flag) {
          for (let index in data.data.data) {
            menus.push(data.data.data[index]);
          }
        } else {
          that.$common.errorAlert(that, data.data);
          console.log(data.data.msg);
        }
      }).catch(function (e) {
        console.log(e)
      });

      // vue初始化时根据路由修改面包屑在vue中的值
      let url = this.$route.path;
      if (url != '/home') {
        // 页面刷新时执行home的路由
        that.$router.push({ path: '/home' });
      } else {
        this.initBreadcrumbs(this.menus, this.breadcrumbs, url);
      }

      // 重写引用组件的方法
      that.$TreeTransfer.methods.filterNodeFrom = function (e, r) {
        return !e || -1 !== r[this.defaultProps.label].indexOf(e) || -1 !== r[this.defaultProps.type].indexOf(e);
      }
      that.$TreeTransfer.methods.filterNodeTo = function (e, r) {
        return !e || -1 !== r[this.defaultProps.label].indexOf(e) || -1 !== r[this.defaultProps.type].indexOf(e);
      }
    }
  }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  li {
    list-style: none;
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 99.5%;
    margin-top: 1%;
  }

  .no-mode-translate-wrapper {
    /*position: relative;*/
    height: 35px;
  }

  .no-mode-translate-wrapper button {
    position: absolute;
  }
</style>
