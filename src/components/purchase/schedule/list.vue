<template>
  <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.7)">
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formData" class="search-element-form">
            <el-row>
              <!--<el-col :span="8">
                <el-form-item label="行程编码: ">
                  <el-input v-model="formData.id" placeholder="行程编码"> </el-input>
                </el-form-item>
              </el-col>-->
              <!--<el-col :span="8">
                <el-form-item label="日期查询: " label-width="110px">
                  <el-date-picker v-model="timeRange" type="daterange" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                  range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" >
                  </el-date-picker>
                </el-form-item>
              </el-col>-->
              <el-col :span="8">
                <el-form-item label="行程开始日期" >
                  <el-date-picker v-model="formData.startTime" type="date" placeholder="选择行程开始日期" format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd" tabindex="1">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="行程开始日期">
                  <el-date-picker v-model="formData.endTime" type="date" placeholder="选择行程结束日期" format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"  tabindex="2">
                  </el-date-picker>
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="行程状态: ">
                  <el-select v-model="formData.status" clearable placeholder="请选择" >
                    <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="search-form-btn">
            <el-button type="primary" @click="searchBtn" icon="el-icon-search">查询</el-button>
            <el-button type="primary" @click="addBtn" icon="el-icon-circle-plus-outline">新增</el-button>
            <el-button type="primary" @click="updateBtn" icon="el-icon-edit">修改</el-button>
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
          <!--<el-table-column prop="scheduleNum" label="行程编码" align="center" sortable/>-->
          <el-table-column prop="status" label="行程状态" align="center" />
          <el-table-column prop="place" label="行程目的地" align="center" />
          <el-table-column prop="startTime" label="行程开始日期" align="center" />
          <el-table-column prop="endTime" label="行程结束日期" align="center" />
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
        //日期
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        addFlag:false,
        updateFlag: false,
        // 请求地址
        url: '/purchase/schedule/list',
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 查询条件
        formData: {
          scheduleNum: '',
          id:'',
          status: '',
          place: '',
          startTime:null,
          endTime:null,
          // 当前第几页
          page: 1,
          // 每页几条
          rows: 5,
          // 数据总数
          total: 0
        },
        loading: false,
        status:[],
        tableData: [],
        selectedRow: '',
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

        this.$common.deleteAxios(that, '/purchase/schedule/delete', {'id': that.selectedRow}, '行程结束').then(function (flag) {
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
      // 获取行程状态下拉框
      that.$common.queryAxios(that, '/purchase/schedule/scheduleStatus').then(function (resolve) {
        if (resolve.flag) {
          that.status = resolve.data;
        }
      });
    }
  }
</script>

