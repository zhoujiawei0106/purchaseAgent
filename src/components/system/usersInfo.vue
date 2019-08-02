<template>
  <div>
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
            <el-button type="primary" @click="searchBtn">查询</el-button>
            <el-button type="primary" @click="resetBtn">重置</el-button>
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
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]" v-show="pagination"
                       :current-page="formData.currentPage" :total="formData.total" :page-size="formData.pageSize"
                       @size-change="sizeChange" @current-change="currentChange" @prev-click="prevClick"
                       @next-click="nextClick" background/>
      </div>
    </div>
  </div>
</template>

<script>
  import collapse from '../../components/common/collapse';
  export default {
    data() {
      return {
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          loginName: '',
          userName: '',
          // 当前第几页
          currentPage: 0,
          // 每页几条
          pageSize: 0,
          // 数据总数
          total: 0
        },
        tableData: []
      }
    },
    components: {
      collapse,
    },
    methods: {
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
        console.log('submit!');
        let that = this;
        that.$common.tableSearch(that, '/system/getUsers', this.formData);
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
      /**
       * 修改当前页显示条数
       * @param value
       */
      sizeChange(value) {
        this.formData.pageSize = value;
      },
      /**
       * 自己选择页数
       * @param value
       */
      currentChange(value) {
        this.formData.currentPage = value
      },
      /**
       * 上一页
       * @param value
       */
      prevClick(value) {
        this.formData.currentPage = value
      },
      /**
       * 下一页
       * @param value
       */
      nextClick(value) {
        this.formData.currentPage = value
      },
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName

      let that = this;
      that.$common.tableSearch(that, '/system/getUsers', {});
    }
  }
</script>

<style scoped>
  .pagination{
    text-align: center; /*让div内部文字居中*/
    padding-top: 1%;
  }
</style>
