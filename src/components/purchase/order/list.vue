<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" :rules="rules" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="订单编号: ">
                  <el-input v-model="formData.orderNum" placeholder="订单编号"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="订单状态: ">
                  <el-input v-model="formData.orderStatus" placeholder="订单状态"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-form-btn">
            <el-button type="primary" @click="searchBtn" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="updateBtn" icon="el-icon-edit">修改</el-button>
            <el-button type="primary" @click="deleteBtn" icon="el-icon-delete-solid">删除</el-button>
            <el-button type="primary" @click="exportBtn" icon="el-icon-refresh-right">导出</el-button>
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
          <el-table-column prop="id" label="订单编号" align="center" sortable/>
          <el-table-column prop="orderStatus" label="订单状态" align="center" />
          <el-table-column prop="totalPrice" label="订单总价" align="center" />
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>
    <div>
      <add-page :add-flag="addFlag" :commodity-type="type" :commodity-status="status" @changeFlag="changeFlag"/>
    </div>
    <div>
      <update-page :update-flag="updateFlag" :commodity-type="type" :commodity-status="status" :id="selectedRow" @changeFlag="changeFlag"/>
    </div>
  </div>
</template>

<script>
  import collapse from '../../common/collapse';
  import pagination from '../../common/pagination';
  import updatePage from './update';

  export default {
    data() {
      return {
        updateFlag: false,
        // 请求地址
        url: '/purchase/order/list',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          orderNum: '',
          orderStatus: '',
          totalPrice: '',
          // 当前第几页
          page: 1,
          // 每页几条
          rows: 5,
          // 数据总数
          total: 0
        },
        loading: false,
        tableData: [],
        selectedRow: '',
      }
    },
    components: {
      pagination,
      collapse,
      updatePage
    },
    methods: {
      changeFlag(param) {
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
        this.$common.tableSearch(this, this.url, this.formData);
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

        this.$common.deleteAxios(that, '/purchase/order/delete', {'id': that.selectedRow}, '商品删除成功').then(function (flag) {
          if (flag) {
            that.$common.tableSearch(that, that.url, that.formData);
            that.selectedRow = '';
          }
          that.loading = false;
        });
      },
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
      let that = this;
      that.$common.tableSearch(that, this.url, {});
    }
  }
</script>

