<template>
  <el-dialog title="新增客户" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="ruleForm.description" placeholder="请输入商品描述" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="商品图片" prop="description">
        <el-input v-model="ruleForm.pictureUrl" placeholder="请输入商品图片" suffix-icon="el-icon-edit" tabindex="3"/>
      </el-form-item>
      <el-form-item label="商品价格" prop="description">
        <el-input v-model="ruleForm.price" placeholder="请输入商品价格" suffix-icon="el-icon-edit" tabindex="4"/>
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
      customerType: {
        type: Array,
        required: true
      },
      customerStatus: {
        type: Array,
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
          name: '',
          description: '',
          pictureUrl: '',
          price: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'change'},
          ],
          description: [
            {required: true, message: '请输入商品描述', trigger: 'change'},
          ],
          pictureUrl: [
            {required: true, message: '请输入商品图片', trigger: 'change'},
          ],
          price: [
            {required: true, message: '请输入商品价格', trigger: 'change'},
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/purchase/commodity/update', {
              name: that.ruleForm.name,
              description: that.ruleForm.description,
              pictureUrl: that.ruleForm.pictureUrl,
              price: that.ruleForm.price,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '商品信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  name: '',
                  description: '',
                  pictureUrl: '',
                  price: '',
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
            name: '',
            description: '',
            pictureUrl: '',
            price: '',
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
            description: '',
            pictureUrl: '',
            price: '',
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
          this.$common.queryAxios(this, '/purchase/commodity/getCustomer', {id: this.id}, '客户查询成功').then(function (e) {
            that.ruleForm.name = e.data.name;
            that.ruleForm.description = e.data.description;
            that.ruleForm.pictureUrl = e.data.pictureUrl;
            that.ruleForm.price = e.data.price;
          });
        }
      }
    }
  }
</script>
