<template>
  <el-dialog title="修改订单信息" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="订单编号" prop="id">
        <el-input v-model="ruleForm.orderNum" disabled="disable" placeholder="请输入订单状态" tabindex="1"/>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-input v-model="ruleForm.orderStatus" placeholder="请输入订单状态" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="订单价格" prop="totalPrice">
        <el-input v-model="ruleForm.totalPrice" placeholder="请输入订单价格" suffix-icon="el-icon-edit" tabindex="3"/>
      </el-form-item>
    </el-form>
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
        dialogForm: false,
        inline: true,
        ruleForm: {
          orderNum: '',
          orderStatus: '',
          totalPrice:''
        },
        rules: {
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/purchase/order/update', {
              orderNum: that.ruleForm.orderNum,
              orderStatus: that.ruleForm.orderStatus,
              totalPrice: that.ruleForm.totalPrice,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '订单信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  orderNum: '',
                  orderStatus: '',
                  totalPrice:''
                };
                that.dialogForm = false;
                that.$emit('changeFlag', [false, true]);
              }
            });
          };
        });
      },
      back() {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/><b>关闭后已录入的数据无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
          that.ruleForm = {
            orderNum: '',
            orderStatus: '',
            totalPrice:''
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
            orderNum: '',
            orderStatus: '',
            totalPrice:''
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
      updateFlag(newValue) {
        this.dialogForm = newValue;
        if (newValue) {
          if (this.$common.isEmpty(this.id)) {
            this.$common.errorMessage(this, '系统异常,未获取到客户信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/purchase/order/getOrder', {id: this.id}, '订单查询成功').then(function (e) {
              that.ruleForm.orderNum = e.data.id,
              that.ruleForm.orderStatus = e.data.orderStatus,
              that.ruleForm.totalPrice = e.data.totalPrice
          });
        }
      }
    }
  }
</script>
