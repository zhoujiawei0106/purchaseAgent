<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="用户名: ">
                  <el-input v-model="formData.loginName" placeholder="用户名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用户名称: ">
                  <el-input v-model="formData.userName" placeholder="用户名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-form-btn">
            <el-button type="primary" @click="searchBtn" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="resetBtn" icon="el-icon-refresh-left">重置</el-button>
            <el-button type="primary" @click="addBtn" icon="el-icon-circle-plus-outline">新增</el-button>
            <el-button type="primary" @click="modifyBtn" icon="el-icon-edit">修改</el-button>
            <el-button type="primary" @click="deleteBtn" icon="el-icon-delete-solid">删除</el-button>
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
          <el-table-column prop="loginName" label="用户名" align="center" sortable/>
          <el-table-column prop="userName" label="用户名称" align="center"/>
          <el-table-column prop="ip" label="ip" align="center"/>
          <el-table-column prop="loginFailTimes" label="无效登陆次数" align="center"/>
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>

    <div>
      <add-page :add-flag="addFlag" @changeFlag="changeFlag"/>
    </div>
  </div>
</template>

<script>
  import collapse from '../../common/collapse';
  import pagination from '../../common/pagination';
  import addPage from './add';
  export default {
    data() {
      return {
        addFlag: false,
        // 请求地址
        url: '/system/getUsers',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          loginName: '',
          userName: '',
          // 当前第几页
          page: 1,
          // 每页几条
          rows: 10,
          // 数据总数
          total: 0
        },
        loading: false,
        tableData: []
      }
    },
    components: {
      pagination,
      collapse,
      addPage
    },
    methods: {
      changeFlag(param) {
        this.addFlag = param;
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
      },
      /**
       * 单击数据行
       * @param row
       * @param event
       * @param column
       */
      clickRow(row, event, column) {
        let rowId = row.id;
        console.log(rowId);
      },
      /**
       * 双击数据行
       * @param row
       * @param event
       */
      selectRow(row, event) {
        let rowId = row.id;
        console.log(rowId);
      },
      addBtn() {
        this.addFlag = true;
        // this.$router.push({ path: '/home' });
      },
      modifyBtn() {

      },
      deleteBtn() {

      }
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;

      let that = this;
      that.$common.tableSearch(that, this.url, {});
    }
  }
</script>
