<template>
  <el-dialog title="新增订单" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <div style="padding-top: 1%;">
      <div class="search-form-btn">
        <el-button type="primary" @click.prevent="addRow()" icon="el-icon-circle-plus-outline">新增</el-button>
        <el-button type="primary" @click.prevent="delData()" icon="el-icon-delete-solid">删除</el-button>
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入客户名称" suffix-icon="el-icon-edit" tabindex="1"/>
          </el-form-item>
          <el-form-item label="快递单号" prop="trackId">
            <el-input v-model="ruleForm.trackId" placeholder="请输入快递单号"/>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%;" border highlight-current-row stripe
                  @row-dblclick="selectRow" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="id" label="id" align="center" v-if="false"/>
          <el-table-column prop="name" label="商品名称" align="center">
            <template slot-scope="scope">
              <el-autocomplete
                class="inline-input"
                v-model="scope.row.name"
                :fetch-suggestions="querySearch"
                placeholder="请输入商品名称"
                @select="handleSelect"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column  prop="shopNum" label="商品数量" align="center" >
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.shopNum" prop="shopNum" @change="handleChange" controls-position="right" :min="1"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="商品价格" align="center" />
        </el-table>
      </div>
    </div>
    <el-button  v-text="'总价：' + totalPrice" prop="totalPrice"  disabled="disabled" style="color: darkorange" tabindex="1"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')" tabindex="2">保存</el-button>
      <el-button @click="back" tabindex="3">返回</el-button>
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
        multipleSelection: [],
        totalPrice:0,
        dialogForm: false,
        shopNum: 1,
        inline: true,
        selectedRow: '',
        tableData:[],
        name:'',
        trackId:'',
        // 请求地址
        url: '/purchase/commodity/list',
        // 查询条件
        formData: {
          name: '',
          shopNum:'',
          price: '',
        },
        ruleForm: {
          name: '',
          trackId:''
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'change'},
          ],
          trackId: [
            {required: true, message: '请输入英文名称', trigger: 'change'},
          ],
        }
      };
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      // 增加行
      addRow () {
        let list = {
          rowNum: '',
          address: this.address,
          name: this.name,
          weather: this.weather,
          phone: this.phone,
          date: this.date,
        }
        this.tableData.unshift(list)
      },
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
        that.$common.saveAxios(that, '/purchase/order/save', {
          nameAll:nameAll,
          priceAll:priceAll,
          shopNumAll:shopNumAll,
          idAll:idAll,
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
          that.ruleForm = {
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
