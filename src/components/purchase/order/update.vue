<template>
  <el-dialog title="修改订单" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <div style="padding-top: 1%;">
      <div>
        <el-table :data="tableData" style="width: 100%;" border highlight-current-row stripe ref="table"
                  @row-dblclick="selectRow" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="id" label="id" align="center" v-if="false"/>
          <el-table-column prop="name" label="商品" align="center" sortable/>
          <el-table-column  prop="shopNum" label="数量" align="center" >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.shopNum" prop="shopNum" @change="handleChange" controls-position="right" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" align="center" />
        </el-table>
      </div>
      <el-input  v-text="'总价：' + totalPrice" prop="totalPrice"  disabled="disabled" suffix-icon="el-icon-edit" tabindex="2"/>
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
      updateFlag: {
        type: Boolean,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        hasSelectList:[],
        multipleSelection: [],
        totalPrice:0,
        dialogForm: false,
        shopNum: 1,
        inline: true,
        selectedRow: '',
        tableData:[],
        // 请求地址
        url: '/purchase/commodity/list',
        // 查询条件
        formData: {
          id:'',
          name: '',
          shopNum:'',
          price: '',
        }
      };
    },
    methods: {
      handleChange(value) {
        let that = this;
        let allPrice = 0;
        let multipleSelection = that.multipleSelection;
        for(let key in multipleSelection){
          allPrice += multipleSelection[key].price * multipleSelection[key].shopNum
        }
        this.totalPrice = allPrice;
      },
      handleSelectionChange(val) {
        let allPrice = 0;
        for(let key in val){
          allPrice += val[key].price * val[key].shopNum
        }
        this.multipleSelection = val;
        this.totalPrice = allPrice;
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
      save() {
        let that = this;
        let multipleSelection = that.multipleSelection;
        let nameAll = '';
        let priceAll = '';
        let shopNumAll = '';
        let idAll = '';
        for(let key in multipleSelection){
          nameAll += multipleSelection[key].name + ',';
          priceAll += multipleSelection[key].price + ',';
          shopNumAll += multipleSelection[key].shopNum + ',';
          idAll += multipleSelection[key].id + ',';
        }
        that.$common.saveAxios(that, '/purchase/order/update', {
          nameAll:nameAll,
          priceAll:priceAll,
          shopNumAll:shopNumAll,
          idAll:idAll,
          'parentId': JSON.parse(sessionStorage.getItem('user')).id,
          id:this.id
        }, '订单修改成功').then(function (flag) {
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
          if(e === 'cancel') {
          } else {
            that.$message({
              showClose: true,
              message: '系统异常,请联系管理员!',
              type: 'error'
            });
          }
        });
      },
      handleClose(done) {
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
          done();
          that.$emit('changeFlag', [false, false]);
        }).catch(function (e) {
          console.log(e);
          if(e === 'cancel') {
          } else {
            that.$message({
              showClose: true,
              message: '系统异常,请联系管理员!',
              type: 'error'
            });
          }
        });
      }
    },
    watch: {
      updateFlag(newValue) {
        this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
        let that = this;
        that.$common.tableSearch(that, this.url, {});
        this.shopNum = 1;
        this.dialogForm = newValue;
        if (newValue) {
          if (this.$common.isEmpty(this.id)) {
            alert(this.id);
            this.$common.errorMessage(this, '系统异常,未获取到客户信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/purchase/order/getOrder', {id: this.id}, '订单查询成功').then(function (e) {
            that.hasSelectList = e.data;
          });
          debugger;
          this.$nextTick(()=>{
            for(let key in that.tableData) {
              if(this.hasSelectList.indexOf(that.tableData[key].id) >= 0){
                this.$refs.dataTable.toggleRowSelection(that.tableData[key],true);
              }
            }
          })
        }
      }
    },
    created: function() {
      this.loginName = JSON.parse(sessionStorage.getItem('user')).loginName;
      let that = this;
      that.$common.tableSearch(that, this.url, {});
    }
  }
</script>
