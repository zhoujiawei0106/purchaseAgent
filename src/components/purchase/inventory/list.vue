<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品名称: ">
                  <el-input v-model="formData.name" placeholder="商品名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-form-btn">
            <el-button type="primary" @click="searchBtn" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="resetBtn" icon="el-icon-refresh-left">重置</el-button>
            <el-button type="primary" @click="addBtn" icon="el-icon-circle-plus-outline">增量</el-button>
            <el-button type="primary" @click="resetTimesBtn" icon="el-icon-refresh-right">库存销毁</el-button>
            <el-button type="primary" @click="exportBtn" icon="el-icon-refresh-right">导出</el-button>
          </div>
        </div>
      </el-collapse-transition>
      <collapse :is-hide-form="isHideForm" @exchangeForm="exchangeForm"></collapse>
    </div>
    <div style="padding-top: 1%;">
      <div>
        <el-table :data="tableData" style="width: 100%;" @row-dblclick="selectRow" @row-click="clickRow"
                  :row-style="tableRowClassName" >
          <el-table-column type="index" width="50" label="序号" align="center" show-overflow-tooltip/>
          <el-table-column prop="id" label="id" align="center" v-if="false" show-overflow-tooltip/>
          <el-table-column prop="name" label="商品名称" align="center" sortable show-overflow-tooltip/>
          <el-table-column prop="enName" label="英文名称" align="center" sortable show-overflow-tooltip/>
          <el-table-column prop="shopNum" label="商品数量" align="center" show-overflow-tooltip/>
          <el-table-column prop="createTime" label="入库时间" align="center" show-overflow-tooltip/>
          <el-table-column prop="updateTime" label="更新时间" align="center" show-overflow-tooltip/>
        </el-table>
      </div>
      <pagination :pagination="pagination" :formData="formData" :url="url" :tableData="tableData"
                  @exchangePagination="exchangePagination"/>
    </div>
    <div>
      <update-page :update-flag="updateFlag" :id="selectedRow" @changeFlag="changeFlag"/>
    </div>
  </div>
</template>

<script>
  import collapse from '../../common/collapse';
  import pagination from '../../common/pagination';
  import updatePage from './add';

  export default {
    data() {
      return {
        updateFlag: false,
        // 请求地址
        url: '/purchase/inventory/list',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          name: '',
          enName: '',
          shopNum:'',
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
        selectedRow: '',
      }
    },
    components: {
      pagination,
      collapse,
      updatePage,
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        if(row.shopNum < 3)
          return 'background: #fdefe3';
      },
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
      /**
       * 重置按钮
       */
      resetBtn() {
        this.formData.name = '';
      },
      addBtn() {
        // 判断是否选择了数据
        if (this.$common.isEmpty(this.selectedRow)) {
          this.$common.selectRowMsg(this);
          return false;
        }
        this.updateFlag = true;
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

        this.$common.updateAxios(that, '/purchase/inventory/reset', {'id': that.selectedRow},  '客户销毁成功')
          .then(function (flag) {
            if (flag) {
              that.$common.tableSearch(that, that.url, that.formData);
              that.selectedRow = '';
            }
            that.loading = false;
          });
      },
      exportBtn() {
        let that = this;
        return new Promise(function (resolve) {
          that.$common.queryAxios(that, '/purchase/inventory/export', that.formData, '导出报表', false).then(function (event) {
            if (event.flag) {
              let header = ['商品名称','英文名称','商品数量','入库时间','更新时间'];
              let entity = ['name','enName','shopNum','createTime','updateTime'];
              let title = '库存管理';
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
    }
  }
</script>

