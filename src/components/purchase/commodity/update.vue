<template>
  <el-dialog title="修改商品信息" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="eName">
        <el-input v-model="ruleForm.eName" placeholder="请输入英文名称" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input v-model="ruleForm.description" placeholder="请输入商品描述" suffix-icon="el-icon-edit" tabindex="3"/>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="ruleForm.price" placeholder="请输入商品价格" suffix-icon="el-icon-edit" tabindex="4"/>
      </el-form-item>
      <el-form-item label="商品成本" prop="basePrice">
        <el-input v-model="ruleForm.basePrice" placeholder="请输入商品成本" suffix-icon="el-icon-edit" tabindex="5"/>
      </el-form-item>
      <el-form-item label="商品类型" prop="category">
        <el-input v-model="ruleForm.category" placeholder="请输入商品类型" suffix-icon="el-icon-edit" tabindex="6"/>
      </el-form-item>
      <el-form-item label="商品品牌" prop="brand">
        <el-input v-model="ruleForm.brand" placeholder="请输入商品品牌" suffix-icon="el-icon-edit" tabindex="7"/>
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
          name: '',
          eName:'',
          description: '',
          price: '',
          basePrice:'',
          category:'',
          brand:'',
          shopNum:''
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'change'},
          ],
          eName: [
            {required: true, message: '请输入英文名称', trigger: 'change'},
          ],
          description: [
            {required: true, message: '请输入商品描述', trigger: 'change'},
          ],
          price: [
            {required: true, message: '请输入商品价格', trigger: 'change'},
          ],
          basePrice: [
            {required: true, message: '请输入商品成本', trigger: 'change'},
          ],
          category: [
            {required: true, message: '请输入商品类型', trigger: 'change'},
          ],
          brand: [
            {required: true, message: '请输入商品品牌', trigger: 'change'},
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
              eName: that.ruleForm.eName,
              description: that.ruleForm.description,
              price: that.ruleForm.price,
              basePrice:that.ruleForm.basePrice,
              category:that.ruleForm.category,
              brand:that.ruleForm.brand,
              shopNum:that.ruleForm.shopNum,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '商品信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  name: '',
                  eName:'',
                  description: '',
                  price: '',
                  basePrice:'',
                  category:'',
                  brand:'',
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
            name: '',
            eName:'',
            description: '',
            price: '',
            basePrice:'',
            category:'',
            brand:'',
            shopNum:''
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
            eName:'',
            description: '',
            price: '',
            basePrice:'',
            category:'',
            brand:'',
            shopNum:''
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
            that.ruleForm.eName = e.data.eName;
            that.ruleForm.description = e.data.description;
            that.ruleForm.price = e.data.price;
            that.ruleForm.basePrice = e.data.basePrice;
            that.ruleForm.category = e.data.category;
            that.ruleForm.brand = e.data.brand;
            that.ruleForm.shopNum = e.data.shopNum;
          });
        }
      }
    }
  }
</script>
