<template>
  <div>
    <div>
      <el-collapse-transition>
        <div v-show="!isHideForm">
          <el-form :inline="true" :model="formInline" class="search-element-form">
            <el-row>
              <el-col :span="8">
                <el-form-item label="用户: ">
                  <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审批人: ">
                  <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="活动区域: ">
                  <el-select v-model="formInline.region" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-form-item class="search-element-form-btn">
                <el-button type="primary" @click="searchBtn">查询</el-button>
                <el-button type="primary" @click="resetBtn">重置</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-collapse-transition>
      <div class="search-item-icon" @mouseover="overIcon" @mouseout="outIcon" @click="hideForm">
        <el-collapse-transition>
          <div v-show="hideFlag && !spanFlag" :style="iconOverStyle">
            <i class="el-icon-caret-top"></i>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="hideFlag && spanFlag" :style="iconOutStyle">
            <i class="el-icon-caret-top"></i>
            <span>隐藏查询条件</span>
          </div>
        </el-collapse-transition>

        <el-collapse-transition>
          <div v-show="showFlag && !spanFlag" :style="iconOverStyle">
            <i class="el-icon-caret-bottom"></i>
          </div>
        </el-collapse-transition>
        <el-collapse-transition>
          <div v-show="showFlag && spanFlag" :style="iconOutStyle">
            <i class="el-icon-caret-bottom"></i>
            <span>显示查询条件</span>
          </div>
        </el-collapse-transition>
      </div>
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
          <el-table-column prop="loginFailTimes" label="登陆次数" align="center"/>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :current-page="currentPage" :total="total"
                       :page-sizes="[5, 10, 20, 50]" :page-size="pageSize" @size-change="sizeChange" @current-change="currentChange"
                       @prev-click="prevClick" @next-click="nextClick" background v-show="pagination"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 隐藏查询条件
        hideFlag: true,
        // 显示查询条件
        showFlag: false,
        // 隐藏/显示span中的文字(true显示)
        spanFlag: false,
        // 是否隐藏查询条件(true隐藏)
        isHideForm: false,
        // 分页条隐藏
        pagination: false,
        // 当前第几页
        currentPage: 0,
        // 每页几条
        pageSize: 0,
        // 数据总数
        total: 0,
        // 查询条件
        formInline: {
          user: '',
          region: ''
        },
        iconOverStyle: {
          'color': ' #c3c3c3'
        },
        iconOutStyle: {
          'color': ' #409eff'
        },
        // iconStyle: {},
        tableData: []
      }
    },
    methods: {
      /**
       * 查询按钮
       */
      searchBtn() {
        console.log('submit!');
      },
      /**
       * 重置按钮
       */
      resetBtn() {

      },
      /**
       * 单击数据行
       * @param row
       * @param event
       * @param column
       */
      clickRow(row, event, column) {
        let rowId = row.id;
      },
      /**
       * 双击数据行
       * @param row
       * @param event
       */
      selectRow(row, event) {

      },
      /**
       * 修改当前页显示条数
       * @param value
       */
      sizeChange(value) {
        this.pageSize = value;
      },
      /**
       * 自己选择页数
       * @param value
       */
      currentChange(value) {
        this.currentPage = value
      },
      /**
       * 上一页
       * @param value
       */
      prevClick(value) {
        this.currentPage = value
      },
      /**
       * 下一页
       * @param value
       */
      nextClick(value) {
        this.currentPage = value
      },
      /**
       * 鼠标移入隐藏查询条件div
       */
      overIcon(event) {
        this.spanFlag = true;
        event.path[1].style.backgroundColor = '#f5f5f5'
      },
      /**
       * 鼠标移出隐藏查询条件div
       */
      outIcon(event) {
        this.spanFlag = false;
        event.path[1].style.backgroundColor = 'white'
      },
      /**
       * 点击隐藏查询条件div
       */
      hideForm() {
        this.hideFlag = !this.hideFlag;
        this.showFlag = !this.showFlag;
        this.isHideForm = !this.isHideForm;
      }
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
