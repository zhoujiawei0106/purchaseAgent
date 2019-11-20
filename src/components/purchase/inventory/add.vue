<template>
  <el-dialog title="库存商品增量" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" disabled="disabled" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="enName">
        <el-input v-model="ruleForm.enName" placeholder="请输入英文名称" disabled="disabled" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="商品数量" prop="shopNum">
        <el-input-number v-model="ruleForm.shopNum" :min="0" placeholder="请输入商品数量" size="medium" tabindex="3"/>
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
          name:'',
          enName:'',
          shopNum:''
        },
        rules: {
          shopNum: [
            {pattern: /^\d+$/,
              message: '请输入整数', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/purchase/inventory/update', {
              shopNum:that.ruleForm.shopNum,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '库存商品信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  name:'',
                  enName:'',
                  shopNum:''
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
            name:'',
            enName:'',
            shopNum:''
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
            name:'',
            enName:'',
            shopNum:''
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
        this.dialogForm = newValue;
        if (newValue) {
          if (this.$common.isEmpty(this.id)) {
            this.$common.errorMessage(this, '系统异常,未获取到客户信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/purchase/inventory/getInventory', {id: this.id}, '商品信息查询成功').then(function (e) {
            that.ruleForm.name = e.data.name;
            that.ruleForm.enName = e.data.enName;
            that.ruleForm.shopNum = e.data.shopNum;
          });
        }
      }
    }
  }
</script>
