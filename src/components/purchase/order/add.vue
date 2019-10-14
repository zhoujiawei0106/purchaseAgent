<template>
  <el-dialog title="新增订单" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <div style="padding-top: 1%;">
      <div>
        <el-table :data="tableData" style="width: 100%;" border highlight-current-row stripe
                  @row-dblclick="selectRow" @row-click="clickRow">
          <el-table-column type="selection"/>
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="id" label="id" align="center" v-if="false"/>
          <el-table-column prop="name" label="商品" align="center" sortable/>
          <el-table-column  prop="shopNum" label="数量" align="center" >
            <template slot-scope="scope">
            <el-input-number v-model="scope.row.shopNum" prop="shopNum" controls-position="right" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center" />
        </el-table>
      </div>
     <el-input  v-text="'总价：' + this.shopNum*4" prop="totalPrice"  disabled="disabled" suffix-icon="el-icon-edit" tabindex="2"/>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')" tabindex="9">保存</el-button>
      <el-button @click="back" tabindex="10">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      addFlag: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        dialogForm: false,
        shopNum: 1,
        inline: true,
        selectedRow: '',
        tableData:[],
        // 请求地址
        url: '/purchase/commodity/list',
        // 查询条件
        formData: {
          name: '',
          shopNum:'',
          price: '',
        }
      };
    },
    methods: {
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
      save() {
        alert("1");
        let that = this;
        let tableData = that.tableData;
        let nameAll = '';
        let priceAll = '';
        let shopNumAll = '';
        for(let key in tableData){
          nameAll += tableData[key].name + ',';
          priceAll += tableData[key].price + ',';
          shopNumAll += tableData[key].shopNum + ',';
        }
        debugger;
            that.$common.saveAxios(that, '/purchase/order/save', {
              nameAll:nameAll,
              priceAll:priceAll,
              shopNumAll:shopNumAll,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
            }, '订单新增成功').then(function (flag) {
              if (flag) {
                that.dialogForm = false;
                that.$emit('changeFlag', [false, true]);
              }
            });
      },
      back() {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/><b>关闭后已录入的数据无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
          that.formData = {
            name: '',
            shopNum: '',
            price: ''
          };
          that.dialogForm = false;
          that.$emit('changeFlag', [false, false]);
        }).catch(function (e) {
          console.log(e);
          that.$message({
            showClose: true,
            message: '系统异常,请联系管理员!',
            type: 'error'
          });
        });
      },
      handleClose(done) {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/><b>关闭后已录入的数据无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
          that.ruleForm = {
            name: '',
            shopNum: '',
            price: ''
          };
          done();
          that.$emit('changeFlag', [false, false]);
        }).catch(function (e) {
          console.log(e);
          that.$message({
            showClose: true,
            message: '系统异常,请联系管理员!',
            type: 'error'
          });
        });
      }
    },
    watch: {
      addFlag(newValue) {
        this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
        let that = this;
        that.$common.tableSearch(that, this.url, {});
        this.shopNum = 1;
        this.dialogForm = newValue;
      }
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
      let that = this;
      that.$common.tableSearch(that, this.url, {});
    }
  }
</script>
