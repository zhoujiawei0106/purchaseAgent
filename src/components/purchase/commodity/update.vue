<template>
  <el-dialog title="修改商品信息" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入商品名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="enName">
        <el-input v-model="ruleForm.enName" placeholder="请输入英文名称" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="ruleForm.price" placeholder="请输入商品价格" suffix-icon="el-icon-edit" tabindex="4"/>
      </el-form-item>
      <el-form-item label="商品成本" prop="basePrice">
        <el-input v-model="ruleForm.basePrice" placeholder="请输入商品成本" suffix-icon="el-icon-edit" tabindex="5"/>
      </el-form-item>
      <el-form-item label="商品类型" prop="category">
        <el-select v-model="ruleForm.category" clearable placeholder="请选择" tabindex="6">
          <el-option v-for="item in category" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品牌" prop="brand">
        <el-input v-model="ruleForm.brand" placeholder="请输入商品品牌" suffix-icon="el-icon-edit" tabindex="7"/>
      </el-form-item>
      <el-form-item label="商品库存" prop="brand">
        <el-input disabled="false" v-model="ruleForm.shopNum" tabindex="7" />
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
      },
      category: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        dialogForm: false,
        inline: true,
        ruleForm: {
          name: '',
          enName:'',
          price: '',
          basePrice:'',
          category:'',
          brand:'',
          shopNum:''
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'change'},
            {max: 100, message: '商品名称长度不超过100个字符', trigger: 'blur'}
          ],
          enName: [
            {required: true, message: '请输入英文名称', trigger: 'change'},
            {max: 100, message: '英文名称长度不超过100个字符', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入商品价格', trigger: 'change'},
            {pattern: /^([0-9]+(.[0-9]{1,2})?)|(-[0-9]+(.[0-9]{1,2})?)$/,
              message: '请输入正确的价格', trigger: 'blur'},
          ],
          basePrice: [
            {required: true, message: '请输入商品成本', trigger: 'change'},
            {pattern: /^([0-9]+(.[0-9]{1,2})?)|(-[0-9]+(.[0-9]{1,2})?)$/,
              message: '请输入正确的价格', trigger: 'blur'}
          ],
          category: [
            {required: true, message: '请输入商品类型', trigger: 'change'},
            {max: 1, message: '商品类型长度不超过1个字符', trigger: 'blur'}
          ],
          brand: [
            {required: true, message: '请输入商品品牌', trigger: 'change'},
            {max: 100, message: '商品品牌长度不超过100个字符', trigger: 'blur'}
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
              enName: that.ruleForm.enName,
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
                  enName:'',
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
            enName:'',
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
            enName:'',
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
          this.$common.queryAxios(this, '/purchase/commodity/getCustomer', {id: this.id}, '客户查询成功').then(function (e) {
            that.ruleForm.name = e.data.name;
            that.ruleForm.enName = e.data.enName;
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
