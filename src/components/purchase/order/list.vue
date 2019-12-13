<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <!--<el-col :span="8">
                <el-form-item label="订单编号: ">
                  <el-input v-model="formData.orderNum" placeholder="订单编号"> </el-input>
                </el-form-item>
              </el-col>-->
              <el-col :span="8">
                <el-form-item label="订单状态: ">
                    <el-select v-model="formData.orderStatus" clearable placeholder="请选择" >
                      <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value"/>
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
            <el-button type="primary" @click="exportBtn" icon="el-icon-refresh-right">导出</el-button>
            <!--<el-button type="primary" @click="deleteBtn" icon="el-icon-delete-solid">撤销</el-button>-->
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
          <el-table-column prop="orderNum" label="订单编号" align="center" sortable show-overflow-tooltip/>
          <el-table-column prop="trackId" label="快递单号" align="center" show-overflow-tooltip/>
          <el-table-column prop="name" label="客户名称" align="center" show-overflow-tooltip/>
          <el-table-column prop="orderStatus" label="订单状态" align="center" show-overflow-tooltip/>
          <el-table-column prop="totalPrice" label="订单结算" align="center" show-overflow-tooltip/>
         <!-- <el-table-column prop="createTime" label="订单创建时间" align="center" />
          <el-table-column prop="updateTime" label="订单更新时间" align="center" />-->
         <!-- <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" style="color: blue">明细</el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>
    <div>
      <add-page :add-flag="addFlag" @changeFlag="changeFlag"/>
    </div>
    <div>
      <update-page :update-flag="updateFlag" :id="selectedRow" @changeFlag="changeFlag"/>
    </div>
    <div>
      <detail-page :detail-flag="detailFlag" :id="rowId" @changeFlag="changeFlag"/>
    </div>
  </div>
</template>

<script>
  import collapse from '../../common/collapse';
  import pagination from '../../common/pagination';
  import addPage from './add';
  import updatePage from './update';
  import detailPage from './detail';

  export default {
    data() {
      return {
        addFlag:false,
        updateFlag: false,
        detailFlag:false,
        // 请求地址
        url: '/purchase/order/list',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        rowId:'',
        selectedRowStatus:'',
        // 查询条件
        formData: {
          orderNum: '',
          orderStatus: '',
          totalPrice: '',
          createTime:'',
          updateTime:'',
          // 当前第几页
          page: 1,
          // 每页几条
          rows: 5,
          // 数据总数
          total: 0
        },
        loading: false,
        tableData: [],
        orderStatus:[],
        selectedRow: '',
      }
    },
    components: {
      pagination,
      collapse,
      addPage,
      updatePage,
      detailPage
    },
    methods:
      {
        /*handleEdit(index, row) {
        let that = this;
        that.rowId = row.id;
          // 判断是否选择了数据
          if (this.$common.isEmpty(row.id)) {
            this.$common.selectRowMsg(this);
            return false;
          }
          this.detailFlag = true;
      },*/
      changeFlag(param) {
        this.addFlag = param[0];
        this.updateFlag = param[0];
        this.detailFlag = param[0];
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
        this.selectedRowStatus = row.orderStatus;
      },
      /**
       * 双击数据行
       * @param row
       * @param event
       */
      selectRow(row, event) {
        this.selectedRow = row.id;
        this.selectedRowStatus = row.orderStatus;
      },
      addBtn() {
      this.addFlag = true;
    },
      updateBtn() {
        // 判断是否选择了数据
        if(this.selectedRowStatus == '已支付'){
          this.$message({
            message: '已经支付订单信息无法修改',
            type: 'warning'
          });
          return false;
        }
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }
        this.updateFlag = true;
      },
        /**
         * 重置按钮
         */
        resetBtn() {
          this.formData.orderStatus = '';
        },
      exportBtn() {
        let that = this;
        return new Promise(function (resolve) {
          that.$common.queryAxios(that, '/purchase/order/export', that.formData, '', false).then(function (event) {
            if (event.flag) {
              let header = ['订单编号','快递单号','客户名称（昵称）','订单状态','订单结算'];
              let entity = ['orderNum','trackId','name','orderStatus','totalPrice'];
              let title = '订单管理';
              that.$common.exportExcel(that, title, header, entity, event.data);
            }
          });
        });
      }
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
      let that = this;
      that.$common.tableSearch(that, this.url, {});
      // 获取订单状态下拉框
      that.$common.queryAxios(that, '/purchase/order/orderStatus').then(function (resolve) {
        if (resolve.flag) {
          that.orderStatus = resolve.data;
        }
      });
    }
  }
</script>

