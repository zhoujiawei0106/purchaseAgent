<template>
  <el-dialog title="修改用户" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="请输入用户名" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="手机号码" prop="tel">
        <el-input v-model="ruleForm.tel" placeholder="请输入手机号码" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <el-form-item label="登陆名" prop="loginName">
        <el-input v-model="ruleForm.loginName" placeholder="请输入登陆名" suffix-icon="el-icon-edit" :disabled="true"/>
        <el-input style="position: fixed;bottom: -9999px;"/>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-select v-model="ruleForm.status" clearable placeholder="-请选择-" tabindex="3">
          <el-option v-for="item in userStatus" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="旧密码">
        <el-input type="password" style="position: fixed;bottom: -9999px;"/>
        <el-input v-model="ruleForm.oldPwd" placeholder="请输入密码" show-password tabindex="4"/>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" style="position: fixed;bottom: -9999px;"/>
        <el-input v-model="ruleForm.password" placeholder="请输入密码" show-password tabindex="5"/>
      </el-form-item>
      <el-form-item label="确认密码" prop="pwd">
        <el-input v-model="ruleForm.pwd" placeholder="请再次输入密码" show-password tabindex="6"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')" tabindex="7">保存</el-button>
      <el-button @click="back" tabindex="8">返回</el-button>
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
      userId: {
        type: String,
        required: true
      },
      userStatus: {
        type: Array,
        required: true
      },
    },
    data() {
      const that = this;
      const valid2Password = (rule, value, callback) => {
        if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      const passwordPatten = (rule, value, callback) => {
        if (that.$common.isNotEmpty(value)) {
          let patten = /^[a-zA-Z]{1}([a-zA-Z0-9]|[!@#$%^&*?]){7,20}$/;
          let excludePatten = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/;
          if (!patten.test(value)) {
            callback(new Error('请输入以字母开头,长度为8-20位的密码'));
          } else if (!excludePatten.test(value)) {
            callback(new Error("输入的密码中至少包含一个大写英文字母、一个小写英文字母以及一个数字"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
      return {
        dialogForm: false,
        inline: true,
        ruleForm: {
          userName: '',
          tel: '',
          loginName: '',
          oldPwd: '',
          password: '',
          pwd: '',
          status: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'change'},
            {min: 2, max: 4, message: '用户名长度在 2 到 4 个字符', trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '请输入手机号码', trigger: 'change'},
            {pattern: /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/,
              message: '请输入正确的11位手机号码', trigger: 'blur'}
          ],
          loginName: [
            {required: true, message: '请输入登陆名', trigger: 'change'},
            {min: 3, max: 36, message: '登陆名长度在 3 到 36 个英文字符', trigger: 'blur'},
            {pattern: /^[a-zA-Z]{3,36}$/, message: '登陆名长度在 3 到 36 个英文字符', trigger: 'blur'}
          ],
          // status: [
          //   {required: true, message: '请选择用户状态', trigger: 'change'}
          // ],
          password: [
            {required: false, message: '请输入密码', trigger: 'change'},
            {validator: passwordPatten, trigger: 'blur'}
          ],
          pwd: [
            {required: false, message: '请再次输入密码', trigger: 'change'},
            {validator: valid2Password, trigger: 'blur'},
            {validator: passwordPatten, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/system/user/update', {
              'userName': that.ruleForm.userName,
              'tel': that.ruleForm.tel,
              'loginName': that.ruleForm.loginName,
              'oldPwd': that.ruleForm.oldPwd,
              'password': that.ruleForm.password,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': that.userId,
              'status': that.ruleForm.status
            }, '用户修改成功').then(function (flag) {
              if (flag) {
                that.dialogForm = false;
                that.$emit('changeFlag', [false, true]);
              }
            });
          };
        })
      },
      back() {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/><b>关闭后已录入的数据无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
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
          if (this.$common.isEmpty(this.userId)) {
            this.$common.errorMessage(this, '系统异常,未获取到用户信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/system/user/getUser', {id: this.userId}, '用户查询成功').then(function (e) {
            that.ruleForm.loginName = e.data.loginName;
            that.ruleForm.tel = e.data.tel;
            that.ruleForm.userName = e.data.userName;
            that.ruleForm.status = e.data.status;
          });
        }
      }
    }
  }
</script>
