<template>
  <el-dialog title="修改客户" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入客户名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="客户昵称" prop="nickName">
        <el-input v-model="ruleForm.nickName" placeholder="请输入客户昵称(用于客户登陆)" suffix-icon="el-icon-edit"
                  tabindex="2" :disabled="true"/>
      </el-form-item>
      <el-form-item label="客户电话" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入客户电话" suffix-icon="el-icon-edit" tabindex="3"/>
      </el-form-item>
      <el-form-item label="客户地址" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请输入客户地址" suffix-icon="el-icon-edit" tabindex="4"/>
      </el-form-item>
      <el-form-item label="客户身份证" prop="idcard">
        <el-input v-model="ruleForm.idcard" placeholder="请客户身份证" suffix-icon="el-icon-edit" tabindex="5"/>
      </el-form-item>
      <el-form-item label="客户积分" prop="point">
        <el-input-number v-model="ruleForm.point" :min="0" placeholder="请输入客户积分" size="medium" tabindex="6"/>
      </el-form-item>
      <el-form-item label="客户类型" prop="type">
        <el-select v-model="ruleForm.type" clearable placeholder="-请选择-" tabindex="7">
          <el-option v-for="item in customerType" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户状态" prop="status">
        <el-select v-model="ruleForm.status" clearable placeholder="-请选择-" tabindex="8">
          <el-option v-for="item in customerStatus" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
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
          nickName: '',
          tel: '',
          address: '',
          idcard: '',
          point: '',
          type: '',
          status: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入客户名称', trigger: 'change'},
            {min: 2, max: 4, message: '用户名长度在 2 到 4 个字符', trigger: 'blur'}
          ],
          nickName: [
            {required: true, message: '请输入客户名称', trigger: 'change'},
            {min: 3, max: 36, message: '登陆名长度在 3 到 36 个英文字符', trigger: 'blur'},
            {pattern: /^[a-zA-Z]{3,36}$/, message: '登陆名长度在 3 到 36 个英文字符', trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '请输入客户电话', trigger: 'change'},
            {pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
              message: '请输入正确的手机号码', trigger: 'blur'}
          ],
          address: [
            {min: 3, max: 100, message: '登陆名长度在 3 到 100 个英文字符', trigger: 'blur'},
          ],
          idcard: [
            {min: 18, max: 18, message: '请输入18位的身份证号', trigger: 'blur'},
            {pattern: /^[a-zA-Z0-9]{1,18}$/, message: '请输入正确的18位身份证号', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择客户类型', trigger: 'blur'},
          ],
          status: [
            {required: true, message: '请选择客户状态', trigger: 'blur'},
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/purchase/customer/update', {
              name: that.ruleForm.name,
              nickName: that.ruleForm.nickName,
              tel: that.ruleForm.tel,
              address: that.ruleForm.address,
              idcard: that.ruleForm.idcard,
              point: that.ruleForm.point,
              type: that.ruleForm.type,
              status: that.ruleForm.status,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '用户新增成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  name: '',
                  nickName: '',
                  tel: '',
                  address: '',
                  idcard: '',
                  point: '',
                  type: '',
                  status: ''
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
            nickName: '',
            tel: '',
            address: '',
            idcard: '',
            point: '',
            type: '',
            status: ''
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
            nickName: '',
            tel: '',
            address: '',
            idcard: '',
            point: '',
            type: '',
            status: ''
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
          this.$common.queryAxios(this, '/purchase/customer/getCustomer', {id: this.id}, '客户查询成功').then(function (e) {
            that.ruleForm.name = e.data.name;
            that.ruleForm.nickName = e.data.nickName;
            that.ruleForm.tel = e.data.tel;
            that.ruleForm.address = e.data.address;
            that.ruleForm.idcard = e.data.idcard;
            that.ruleForm.point = e.data.point;
            that.ruleForm.type = e.data.type;
            that.ruleForm.status = e.data.status;
          });
        }
      }
    }
  }
</script>
