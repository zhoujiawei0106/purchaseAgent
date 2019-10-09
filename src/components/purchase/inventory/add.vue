<template>
  <el-dialog title="新增库存商品" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="商品数量" prop="description">
        <el-input v-model="ruleForm.shopNum" placeholder="请输入商品数量" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="商品来源" prop="description">
        <el-input v-model="ruleForm.shopAddress" placeholder="请输入商品来源" suffix-icon="el-icon-edit" tabindex="3"/>
      </el-form-item>
      <el-form-item label="是否上架" prop="baseprice">
        <el-input v-model="ruleForm.whetherShelf" placeholder="是否上架" suffix-icon="el-icon-edit" tabindex="4"/>
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
      addFlag: {
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
    },
    data() {
      return {
        dialogForm: false,
        inline: true,
        ruleForm: {
          name: '',
          description: '',
          shopNum:'',
          shopAddress:'',
          whetherShelf:''
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'change'},
          ],
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.saveAxios(that, '/purchase/inventory/save', {
              name: that.ruleForm.name,
              shopNum: that.ruleForm.shopNum,
              shopAddress: that.ruleForm.shopAddress,
              whetherShelf: that.ruleForm.whetherShelf,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': that.$common.uuid()
            }, '商品新增成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  name: '',
                  shopNum:'',
                  shopAddress:'',
                  whetherShelf:''
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
            shopNum:'',
            shopAddress:'',
            whetherShelf:''
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
            shopNum:'',
            createMan:'',
            shopAddress:'',
            whetherShelf:'',
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
        this.dialogForm = newValue;
      }
    }
  }
</script>
