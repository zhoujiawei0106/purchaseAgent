<template lang="html">
  <el-container style="height: 100%; border: 1px solid #eee;width: 100%">
    <el-header style="text-align: right;" height="10%">
      <span style="font-size: 16px;">欢迎 {{ loginName }}</span>
      <el-dropdown>
        <i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <el-aside :width="leftSideWidth">
        <div class="no-mode-translate-wrapper">
          <transition name="el-fade-in-linear">
            <el-button icon="el-icon-d-arrow-right" v-if="isCollapse" key="off" @click="collapseMenu"
                       :style="collapseCloseBtn" size="small"></el-button>
            <el-button icon="el-icon-d-arrow-left" v-else="" key="on" @click="collapseMenu" :style="collapseOpenBtn"
                       size="small"></el-button>
          </transition>
        </div>
        <div>
          <el-menu unique-opened :collapse="isCollapse" class="el-menu-vertical">
            <el-submenu v-for="menu in menus" :key="menu.id" :index="menu.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ menu.name }}</span>
              </template>
              <el-menu-item-group>
                <router-link v-for="subMenu in menu.subMenus" :key="subMenu.id" :to="subMenu.url" tag="li">
                  <el-menu-item :index="subMenu.id">{{ subMenu.name }}</el-menu-item>
                </router-link>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>

      <!--<el-scrollbar id="scrollY" wrap-style="overflow: auto;" :style="'width:' + rightSideWidth + ';'">-->
      <el-main :width="rightSideWidth">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.id">
            {{breadcrumb.name}}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <hr v-show="breadcrumbs.length > 0"/>
        <router-view></router-view>
      </el-main>
      <!--</el-scrollbar>-->
    </el-container>
    <el-footer height="3%" width="100%" style="text-align: center; font-size: 12px">这是我的脚</el-footer>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        // 登陆用户
        loginName: '',
        // 菜单数据
        menus: [],
        // 面包屑
        breadcrumbs: [],
        // 菜单是否展开(默认是)
        isCollapse: false,
        rightSideWidth: '87%',
        leftSideWidth: '13%',
        // 菜单展开样式
        collapseOpenBtn: {
          'margin-top': '1px',
          'margin-left': '86%'
        },
        // 菜单关闭样式
        collapseCloseBtn: {
          'margin-top': '1px',
          'margin-left': '25%'
        }
      }
    },
    methods: {
      /**
       * 退出登录
       */
      logout: function () {
        this.$confirm('是否退出登陆?', '退出登陆', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'info',
        }).then(() => {
          sessionStorage.removeItem('user');
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
          this.rightSideWidth = '97%';
          this.leftSideWidth = '3%';

        } else {
          this.rightSideWidth = '87%';
          this.leftSideWidth = '13%';
        }
      },
      // /**
      //  * 点击左边菜单后生成一个新面包屑
      //  * @param event vue的dom对象
      //  */
      // clickMenu: function (event) {
      //   this.breadcrumbs.splice(0, this.breadcrumbs.length);
      //   while(true) {
      //     let menuId = event.index;
      //     let menuName = event.$el.textContent.trim().split(" ")[0];
      //     this.breadcrumbs.splice(0, 0, {
      //       id: menuId,
      //       name: menuName
      //     });
      //     event = event.parentMenu;
      //     if(common.isEmpty(event.index)) {
      //       break;
      //     }
      //   }
      // },
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
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName

      // TODO 创建了vue实例后获取菜单数据(改为从接口获取)
      // debugger;
      let menusArr = JSON.parse(localStorage.getItem('menu'));
      for (let index in menusArr ) {
        this.menus.push(menusArr[index]);
      }
      // this.menus.push({
      //   id: '1',
      //   name: '系统管理',
      //   subMenus: [
      //     {
      //       id: '1-1',
      //       name: '用户管理',
      //       url: '/home/usersInfo'
      //     }, {
      //       id: '1-2',
      //       url: '/home/error',
      //       name: '权限管理'
      //     }, {
      //       id: '1-3',
      //       name: '角色管理',
      //       url: '/home/usersInfo1'
      //     }, {
      //       id: '1-3',
      //       name: '角色管理',
      //       subMenus: [
      //         {
      //           id: '2-1',
      //           name: '客户管理',
      //           url: '/home/usersInfo1',
      //         }, {
      //           id: '2-2',
      //           name: '商品管理',
      //           url: '/home/usersInfo1'
      //         }, {
      //           id: '2-3',
      //           name: '行程管理',
      //           url: '/home/usersInfo1'
      //         },
      //       ]
      //     },
      //   ]
      // }, {
      //   id: '2',
      //   name: '代购管理',
      //   subMenus: [
      //     {
      //       id: '2-1',
      //       name: '客户管理',
      //       url: '/home/usersInfo1',
      //     }, {
      //       id: '2-2',
      //       name: '商品管理',
      //       url: '/home/usersInfo1'
      //     }, {
      //       id: '2-3',
      //       name: '行程管理',
      //       url: '/home/usersInfo1'
      //     },
      //   ]
      // });

      // vue初始化时根据路由修改面包屑在vue中的值
      let url = this.$route.path;
      this.initBreadcrumbs(this.menus, this.breadcrumbs, url);
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
    position: relative;
    height: 35px;
  }

  .no-mode-translate-wrapper button {
    position: absolute;
  }

  .no-mode-translate-fade-enter-active, .no-mode-translate-fade-leave-active {
    transition: all 0.5s;
  }

  .no-mode-translate-fade-enter, .no-mode-translate-fade-leave-active {
    opacity: 0;
  }

  .no-mode-translate-fade-enter {
    transform: translateX(31px);
  }

  .no-mode-translate-fade-leave-active {
    transform: translateX(51px);
  }

  /*#scrollY .el-scrollbar .el-scrollbar__wrap {overflow-x: hidden;}*/

  /*#scrollY .el-tree>.el-tree-node{display:inline-block;}*/
</style>
