<template>
  <div class="login-page-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">用户登陆</h3>
      <el-form-item prop="loginName">
        <el-input type="text" v-model="ruleForm.loginName" auto-complete="off" placeholder="用户名" @keydown.enter.native="handleSubmit"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码" prop="password" @keydown.enter.native="handleSubmit"/>
      </el-form-item>
      <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {},
    data() {
      return {
        logining: false,
        ruleForm: {
          loginName: '',
          password: ''
        },
        rules: {
          loginName: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        },
        checked: false
      };
    },
    methods: {
      handleSubmit() {
        let that = this;
        that.$refs.ruleForm.validate((valid) => {
          // 校验通过并且不在登陆处理中时
          if (valid && !that.logining) {
            that.logining = true;
            this.$axios.get(this.$common.contentPath + '/login/' + that.ruleForm.loginName + '/' + that.ruleForm.password)
              .then(function (data) {
                that.logining = false;
                if (data.data.flag) {
                  // 在session中放入用户
                  sessionStorage.setItem('user', JSON.stringify({
                    loginName: data.data.data.loginName,
                    userName: data.data.data.userName,
                    id: data.data.data.id
                  }));
                  // 在local中添加token
                  localStorage.setItem('token', data.data.data.token);
                  localStorage.setItem('checked', that.checked);
                  localStorage.setItem('loginName', that.ruleForm.loginName);
                  localStorage.setItem('password', that.ruleForm.password);
                  that.$router.push({ path: '/home' });
                } else {
                  that.$alert(data.data.msg, '提示信息', {
                    confirmButtonText: '确定'
                  });
                }
            }).catch(function (error) {
              that.logining = false;
              console.log(error);
              that.$alert('系统异常,请联系管理员!', '提示信息', {
                  confirmButtonText: '确定'
              });
            });
          } else {
            that.$alert('请不要重复提交!', '提示信息', {
              confirmButtonText: '确定'
            });
            console.log('请不要重复提交!');
            return false;
          }
        });
      }
    },
    mounted: function () {
      if (localStorage.getItem('checked') === 'true') {
        this.checked = true;
        this.ruleForm.loginName = localStorage.getItem('loginName');
        this.ruleForm.password = localStorage.getItem('password');
      }
    }
  }
</script>

<style scoped>
  .title {
    text-align: center;
  }

  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  label.el-checkbox.remember {
    margin: 0px 0px 35px 0px;
  }

  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }
</style>
