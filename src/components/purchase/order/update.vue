<template>
  <el-dialog title="修改订单" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true" width="80%">
    <div style="padding-top: 1%;">
      <div>
        <el-form :model="ruleForm" :rule="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
          <el-form-item label="客户编码" prop="id" v-if="false">
            <el-input v-model="ruleForm.customerId" />
          </el-form-item>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="ruleForm.kName" :disabled="true"/>
          </el-form-item>
          <el-form-item label="客户昵称" prop="nickName">
            <el-input v-model="ruleForm.nickName" :disabled="true"/>
          </el-form-item>
          <el-form-item label="客户身份证" prop="idCard">
            <el-input v-model="ruleForm.idCard" :disabled="true"/>
          </el-form-item>
          <el-form-item label="客户电话" prop="tel">
            <el-input v-model="ruleForm.tel" :disabled="true"/>
          </el-form-item>
          <el-form-item label="客户地址" prop="address">
            <el-input v-model="ruleForm.address" :disabled="true"/>
          </el-form-item>
          <el-form-item label="快递单号" prop="trackId">
            <el-input v-model="ruleForm.trackId" placeholder="请输入快递单号"/>
          </el-form-item>
          <el-form-item label="是否支付" prop="value">
            <el-switch
              v-model="ruleForm.value"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-form>

        <el-divider content-position="center">少年包青天</el-divider>

        <div class="search-form-btn">
          <el-button type="success" @click.prevent="addRow()" icon="el-icon-plus" circle/>
          <el-button type="info" @click.prevent="delData()" icon="el-icon-minus" circle/>
        </div>

        <div style="padding-top: 1%;">
          <div>
            <el-table :data="tableData" style="width: 100%;" border highlight-current-row stripe ref="multipleTable"
                      @row-dblclick="selectRow" @row-click="clickRow" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" show-overflow-tooltip/>
              <el-table-column type="index" width="50" label="序号" align="center" show-overflow-tooltip/>
              <el-table-column prop="id" label="id" align="center" v-if="false" show-overflow-tooltip/>
              <el-table-column prop="sName" label="商品名称" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-autocomplete
                    class="inline-input"
                    v-model="scope.row.sName"
                    :fetch-suggestions="querySearchOfShop"
                    placeholder="请输入商品名称"
                    @keyup.native="dealNone(scope)"
                    @select="((item)=>{handleSelectOfShop(item, scope)})"
                  ></el-autocomplete>
                </template>
              </el-table-column>
              <el-table-column  prop="shopNum" label="商品数量" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.shopNum" prop="shopNum" @change="handleChange(scope)" controls-position="right" :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column prop="price" label="商品单价" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="basePrice" label="商品成本" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="rePrice" label="商品差价" align="center" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-button  v-text="'总价：' + totalPrice" disabled="disabled" style="color: darkorange" tabindex="1"/>
    <el-button  v-text="'总差价：' + totalRePrice"  disabled="disabled" style="color: darkorange" tabindex="2"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')" tabindex="2">保存</el-button>
      <el-button @click="back" tabindex="3">返回</el-button>
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
        multipleSelection: [],
        totalPrice: 0,
        totalRePrice: 0,
        dialogForm: false,
        inline: true,
        selectedRow: '',
        orderNum:'',
        tableData: [],
        shopInfo: [],
        shopInfoCash: [],
          // 请求地址
          url: '/purchase/commodity/list',
          // 查询条件
          formData: {
            sName: '',
            shopNum: '',
            price: '',
            basePrice: '',
            rePrice: ''
          },
          ruleForm: {
            index: 0,
            customerId: '',
            kName: '',
            nickName: '',
            idCard: '',
            tel: '',
            address: '',
            trackId: '',
            value: false
          },
         rules: {
          trackId:[
            {max: 100, message: '快递单号长度不超过100个字符', trigger: 'blur'}
          ]
        }
        };
    },
    methods: {
      dealNone(scope) {
        let that = this;
        let shopInfoCash = that.shopInfoCash;
        that.shopInfo.push(shopInfoCash[scope.row.id]);
        that.tableData[scope.$index].id = '';
        that.tableData[scope.$index].shopNum = 1;
        that.tableData[scope.$index].price = '';
        that.tableData[scope.$index].basePrice = '';
        that.tableData[scope.$index].rePrice = '';
      },
      // 增加行
      addRow () {
        let that = this;
        if(that.tableData.length >= that.shopInfoCash.data.length) {
          this.$message({
            message: '一个商品只能存在一行,请增加商品数量',
            type: 'warning'
          });
          return;
        }
        let list = {
          id:'',
          sName:'',
          shopNum:'',
          price:'',
          basePrice:''
        }
        this.tableData.unshift(list)
      },
      delData () {
        let that = this;
        // 判断是否选择了数据
        if (this.$common.isEmpty(that.multipleSelection)) {
          this.$common.selectRowMsg(this);
          return false;
        }
        for (let i in that.multipleSelection) {
          for(let j in that.tableData) {
            if(that.tableData[j] === that.multipleSelection[i]) {
              this.tableData.splice(j, 1)
            }
          }
        }
        // 删除完数据之后清除勾选框
        this.$refs.multipleTable.clearSelection();
      },
      //处理选择框数据
      handleSelectOfShop(item,scope) {
        let that = this;
        for(let key in that.shopInfo) {
          if(item.id === that.shopInfo[key].id) {
            that.tableData[scope.$index].id = that.shopInfo[key].id;
            that.tableData[scope.$index].price = that.shopInfo[key].price;
            that.tableData[scope.$index].basePrice = that.shopInfo[key].basePrice;
            that.tableData[scope.$index].rePrice = that.shopInfo[key].price - that.shopInfo[key].basePrice;
            that.shopInfo.splice(key,1);
            break;
          }
        }
        //计算价格
        let allPrice = 0;
        let rePrice = 0;
        for(let key in that.tableData){
          allPrice += that.tableData[key].price * that.tableData[key].shopNum
          rePrice += that.tableData[key].rePrice * that.tableData[key].shopNum
        }
        that.totalPrice = allPrice;
        that.totalRePrice = rePrice;
      },
      querySearchOfShop(queryString, cb) {
        let shopInfo = this.shopInfo;
        console.log(shopInfo);
        let results = queryString ? shopInfo.filter(this.createFilterOfShop(queryString)) : shopInfo;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilterOfShop(queryString) {
        return (shopInfo) => {
          return (shopInfo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleChange(scope) {
        let that = this;
         for(let i in that.shopInfo) {
             if(scope.row.sName === that.shopInfo[i].name) {
               that.tableData[scope.$index].id = that.shopInfo[i].id;
               that.tableData[scope.$index].price = that.shopInfo[i].price;
               that.tableData[scope.$index].basePrice = that.shopInfo[i].basePrice;
               that.tableData[scope.$index].rePrice = that.shopInfo[i].price - that.shopInfo[i].basePrice;
             }
       }
        let allPrice = 0;
        let rePrice = 0;
        for(let key in that.tableData){
          allPrice += that.tableData[scope.$index].price * that.tableData[key].shopNum
          rePrice += that.tableData[scope.$index].rePrice * that.tableData[key].shopNum
        }
        that.totalPrice = allPrice;
        that.totalRePrice = rePrice;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
        if(that.$common.isEmpty(that.ruleForm.kName)) {
          this.$message({
            message: '客户名称不为空',
            type: 'warning'
          });
          return
        }
        if(that.tableData.length === 0) {
          this.$message({
            message: '商品信息不为空',
            type: 'warning'
          });
          return
        }
        for (let key in that.tableData) {
          if(that.$common.isEmpty(that.tableData[key].sName)) {
            this.$message({
              message: '商品名称不为空',
              type: 'warning'
            });
            return
          }
        }
        that.$common.saveAxios(that, '/purchase/order/update', {
          id:that.orderNum,
          customerId:that.ruleForm.customerId,
          orderStatus:that.ruleForm.value == false ? 0 : 1,
          trackId:that.ruleForm.trackId,
          tableData:JSON.stringify(that.tableData),
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
          for(let i = 0; i < that.tableData.length; i++) {
            that.tableData.splice(i, that.tableData.length)
          }
          that.ruleForm = {
            index:0,
            id:'',
            kName:'',
            nickName:'',
            idCard:'',
            tel:'',
            address:'',
            trackId:'',
            value: false
          },
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
          for(let i = 0; i < that.tableData.length; i++) {
            that.tableData.splice(i, that.tableData.length)
          }
          that.ruleForm = {
            index:0,
            id:'',
            kName:'',
            nickName:'',
            idCard:'',
            tel:'',
            address:'',
            trackId:'',
            value: false
          },
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
        let that = this;
        this.dialogForm = newValue;
        for(let key in that.tableData) {
          that.tableData.splice(key, that.tableData.length)
        }
        if (newValue) {
          this.$common.queryAxios(this, '/purchase/order/getOrderList', {id: this.id}, '商品查询成功').then(function (e) {
            that.shopInfo = e.data.data;
            that.shopInfoCash = e.dataById;
          })
          if (this.$common.isEmpty(this.id)) {
            this.$common.errorMessage(this, '系统异常,未获取到客户信息!');
            return false
          }
          this.$common.queryAxios(this, '/purchase/order/getOrder', {id: this.id}, '订单查询成功').then(function (e) {
            that.orderNum = e.customer.orderNum;
            that.ruleForm.customerId = e.customer.customerId;
            that.ruleForm.kName = e.customer.name;
            that.ruleForm.nickName = e.customer.nickName;
            that.ruleForm.idCard = e.customer.idCard;
            that.ruleForm.tel = e.customer.tel;
            that.ruleForm.address = e.customer.address;
            that.ruleForm.trackId = e.customer.trackId;
            that.ruleForm.value = e.customer.orderStatus == 1 ? true : false;
            for(let key in e.commodityList) {
              that.addRow();
            }
            that.tableData = e.commodityList;
            let allPrice = 0;
            let rePrice = 0;
            for(let key in e.commodityList){
              allPrice +=  that.tableData[key].price *  that.tableData[key].shopNum;
              rePrice +=  that.tableData[key].rePrice *  that.tableData[key].shopNum
            }
            that.totalPrice = allPrice;
            that.totalRePrice = rePrice;
          });
        }
      }
    },
  }
</script>
