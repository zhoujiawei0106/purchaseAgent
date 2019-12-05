<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="登陆名: ">
                  <el-input v-model="formData.loginName" placeholder="登陆名" suffix-icon="el-icon-edit"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户名: ">
                  <el-input v-model="formData.userName" placeholder="用户名" suffix-icon="el-icon-edit"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户状态: ">
                  <el-select v-model="formData.status" clearable placeholder="-请选择-">
                    <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-form-btn">
            <el-button type="primary" @click="searchBtn" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="resetBtn" icon="el-icon-refresh-left">重置</el-button>
            <el-button type="primary" @click="addBtn" icon="el-icon-circle-plus-outline">新增</el-button>
            <el-button type="primary" @click="updateBtn" icon="el-icon-edit">修改</el-button>
            <el-button type="primary" @click="deleteBtn" icon="el-icon-delete-solid">删除</el-button>
            <el-button type="primary" @click="roleBtn" icon="el-icon-user">角色分配</el-button>
            <el-button type="primary" @click="resetPwdBtn" icon="el-icon-refresh-right">重置密码</el-button>
            <el-button type="primary" @click="resetTimesBtn" icon="el-icon-refresh-right">重置登陆次数</el-button>
          </div>
        </div>
      </el-collapse-transition>
      <collapse :is-hide-form="isHideForm" @exchangeForm="exchangeForm"></collapse>
    </div>
    <div style="padding-top: 1%;">
      <div>
        <el-table :data="tableData" style="width: 100%;" @row-dblclick="selectRow" @row-click="clickRow"
                  border highlight-current-row stripe>
          <el-table-column type="index" width="50" label="序号" align="center" show-overflow-tooltip/>
          <el-table-column prop="id" label="id" align="center" v-if="false" show-overflow-tooltip/>
          <el-table-column prop="loginName" label="登陆名" align="center" sortable show-overflow-tooltip/>
          <el-table-column prop="userName" label="用户名" align="center" show-overflow-tooltip/>
          <el-table-column prop="tel" label="手机" align="center" show-overflow-tooltip/>
          <el-table-column prop="ip" label="ip" align="center" show-overflow-tooltip/>
          <el-table-column prop="status" label="有效状态" align="center" show-overflow-tooltip/>
          <el-table-column prop="loginFailTimes" label="登陆失败次数" align="center" show-overflow-tooltip/>
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>

    <div>
      <add-page :add-flag="addFlag" :user-status="status" @changeFlag="changeFlag"/>
    </div>
    <div>
      <update-page :update-flag="updateFlag" :user-id="selectedRow" :user-status="status" @changeFlag="changeFlag"/>
    </div>
  </div>
</template>

<script>
  import collapse from '../../common/collapse';
  import pagination from '../../common/pagination';
  import addPage from './add';
  import updatePage from './update';

  export default {
    data() {
      return {
        addFlag: false,
        updateFlag: false,
        // 请求地址
        url: '/system/user/getUsers',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          loginName: '',
          userName: '',
          status: '',
          // 当前第几页
          page: 1,
          // 每页几条
          rows: 10,
          // 数据总数
          total: 0
        },
        loading: false,
        tableData: [],
        selectedRow: '',
        status: []
      }
    },
    components: {
      pagination,
      collapse,
      addPage,
      updatePage
    },
    methods: {
      changeFlag(param) {
        this.addFlag = param[0];
        this.updateFlag = param[0];
        // 为true时重新加载列表数据
        if (param[1]) {
          this.$common.tableSearch(this, this.url, this.formData);
        }
      },
      /**
       * 翻页/跳转页
       */
      exchangePagination(param) {
        this.pagination = param.pagination;
        this.formData = param.formData;
        this.tableData = param.tableData;
      },
      /**
       * 显示隐藏查询表单
       */
      exchangeForm(param) {
        this.isHideForm = param;
      },
      /**
       * 查询按钮
       */
      searchBtn() {
        let that = this;
        this.formData.page = 1;
        that.$common.tableSearch(that, this.url, this.formData);
      },
      /**
       * 重置按钮
       */
      resetBtn() {
        this.formData.loginName = '';
        this.formData.userName = '';
        this.formData.status = '';
      },
      /**
       * 单击数据行
       * @param row
       * @param event
       * @param column
       */
      clickRow(row, event, column) {
        this.selectedRow = row.id;
      },
      /**
       * 双击数据行
       * @param row
       * @param event
       */
      selectRow(row, event) {
        this.selectedRow = row.id;
        this.updateBtn();
      },
      addBtn() {
        this.addFlag = true;
      },
      updateBtn() {
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }
        this.updateFlag = true;
      },
      deleteBtn() {
        let that = this;
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }

        this.$confirm('是否确认删除数据？<br/><b>数据删除后无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
          // 遮罩
          this.loading = true;
          this.$common.deleteAxios(that, '/system/user/delete', {'id': that.selectedRow}, '用户删除成功').then(function (flag) {
            if (flag) {
              that.$common.tableSearch(that, that.url, that.formData);
              that.selectedRow = '';
            }
            that.loading = false;
          });
        })
      },
      roleBtn() {
        let that = this;
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }

        // // 遮罩
        // this.loading = true;
        //
        // this.$common.updateAxios(that, '/system/user/reset', {'id': that.selectedRow},  '用户登陆次数重置成功')
        //   .then(function (flag) {
        //     if (flag) {
        //       that.$common.tableSearch(that, that.url, that.formData);
        //       that.selectedRow = '';
        //     }
        //     that.loading = false;
        // });
      },
      resetPwdBtn() {
        let that = this;
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }

        // 遮罩
        this.loading = true;

        this.$common.updateAxios(that, '/system/user/resetPwd', {'id': that.selectedRow},  '用户登陆次数重置成功')
          .then(function (flag) {
            if (flag) {
              that.$common.tableSearch(that, that.url, that.formData);
              that.selectedRow = '';
            }
            that.loading = false;
        });
      },
      resetTimesBtn() {
        let that = this;
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }

        // 遮罩
        this.loading = true;

        this.$common.updateAxios(that, '/system/user/resetTimes', {'id': that.selectedRow},  '用户登陆次数重置成功')
          .then(function (flag) {
            if (flag) {
              that.$common.tableSearch(that, that.url, that.formData);
              that.selectedRow = '';
            }
            that.loading = false;
        });
      }
    },
    created: function() {
      let that = this;
      that.$common.tableSearch(that, this.url, {});

      // 获取客户状态下拉框
      that.$common.queryAxios(that, '/common/customerStatus').then(function (resolve) {
        if (resolve.flag) {
          that.status = resolve.data;
        }
      });
    }
  }
</script>
