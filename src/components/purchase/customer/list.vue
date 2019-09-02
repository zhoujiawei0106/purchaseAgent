<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="客户名称: ">
                  <el-input v-model="formData.name" placeholder="客户名称" suffix-icon="el-icon-edit"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户昵称: ">
                  <el-input v-model="formData.nickName" placeholder="客户昵称" suffix-icon="el-icon-edit"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="客户类型: ">
                  <el-select v-model="formData.type" clearable placeholder="-请选择-">
                    <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
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
            <el-button type="primary" @click="resetTimesBtn" icon="el-icon-refresh-right">导出</el-button>
          </div>
        </div>
      </el-collapse-transition>
      <collapse :is-hide-form="isHideForm" @exchangeForm="exchangeForm"></collapse>
    </div>
    <div style="padding-top: 1%;">
      <div>
        <el-table :data="tableData" style="width: 100%;" @row-dblclick="selectRow" @row-click="clickRow"
                  border highlight-current-row stripe>
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="id" label="id" align="center" v-if="false"/>
          <el-table-column prop="name" label="客户名称(昵称)" align="center"/>
          <el-table-column prop="parentId" label="上级客户" align="center"/>
          <el-table-column prop="type" label="客户类型" align="center" sortable/>
          <el-table-column prop="status" label="客户状态" align="center"/>
          <el-table-column prop="point" label="客户积分" align="center"/>
          <el-table-column prop="tel" label="客户电话" align="center"/>
          <el-table-column prop="address" label="客户地址" align="center"/>
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>

    <div>
      <add-page :add-flag="addFlag" :customer-type="type" :customer-status="status" @changeFlag="changeFlag"/>
    </div>
    <div>
      <update-page :update-flag="updateFlag" :customer-type="type" :customer-status="status" :id="selectedRow"
                   @changeFlag="changeFlag"/>
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
        url: '/purchase/customer/list',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          name: '',
          nickName: '',
          type: '',
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
        type: [],
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
        this.formData.name = '';
        this.formData.nickName = '';
        this.formData.type = '';
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

        // 遮罩
        this.loading = true;

        this.$common.deleteAxios(that, '/system/user/delete', {'id': that.selectedRow}, '用户删除成功').then(function (flag) {
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

        this.$common.updateAxios(that, '/system/user/reset', {'id': that.selectedRow},  '用户登陆次数重置成功')
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
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;

      let that = this;
      that.$common.tableSearch(that, this.url, {});
      // 获取客户类型下拉框
      that.$common.queryAxios(that, '/purchase/customer/customerType').then(function (resolve) {
        if (resolve.flag) {
          that.type = resolve.data;
        }
      });

      // 获取客户状态下拉框
      that.$common.queryAxios(that, '/purchase/customer/customerStatus').then(function (resolve) {
        if (resolve.flag) {
          that.status = resolve.data;
        }
      });
    }
  }
</script>

