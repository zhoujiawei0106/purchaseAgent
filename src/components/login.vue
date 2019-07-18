<template>
  <div class="login-page-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统</h3>
      <el-form-item prop="loginName">
        <el-input type="text" v-model="ruleForm.loginName" auto-complete="off" placeholder="用户名"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码" prop="password"/>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
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
          loginName: 'admin',
          password: 'test123'
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
        checked: true
      };
    },
    methods: {
      handleSubmit() {
        let that = this;
        that.$refs.ruleForm.validate((valid) => {
          // 校验通过并且不在登陆处理中时
          if (valid && !that.logining) {
            that.logining = true;
            this.$axios({
              method: 'get',
              url: 'http://localhost:8088/api/login/' + that.ruleForm.loginName
                + '/' + that.ruleForm.password
              // data: this.$qs.stringify({
              //   loginName: that.ruleForm.loginName,
              //   password: that.ruleForm.password
              // })
            }).then(function (data) {
              that.logining = false;
              if (data.data.flag) {
                // 放入用户
                sessionStorage.setItem('user', JSON.stringify({
                  loginName: data.data.loginName,
                }));
                // 放入菜单
                localStorage.setItem('menu', JSON.stringify(data.data.data));
                that.$router.push({ path: '/home' });
              } else {
                that.$alert(data.data.msg, '提示信息', {
                  confirmButtonText: '确定'
                });
              }
            }).catch(function (error) {
              that.logining = false;
              console.log(error)
              that.$alert('系统异常,请联系管理员!', '提示信息', {
                  confirmButtonText: '确定'
              });
            });
          } else {
            console.log('请不要重复提交!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
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
</style>
