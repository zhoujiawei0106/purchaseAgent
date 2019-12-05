<template>
  <el-dialog title="权限分配" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true" width="50%">
    <!--<el-form label-width="100px" :inline="inline" label-position="right">-->
      <!--<el-form-item label="权限分配">-->
    <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入城市拼音" v-model="value" :data="data"/>
      <!--</el-form-item>-->
    <!--</el-form>-->

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()" tabindex="1">保存</el-button>
      <el-button @click="back" tabindex="2">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>

  export default {
    props: {
      permissionFlag: {
        type: Boolean,
        required: true
      },
      userId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        dialogForm: false,
        data: [],
        value: [],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1 || item.label.indexOf(query) > - 1;
        }
      };
    },
    methods: {
      save() {
        let that = this;
        // that.$refs['ruleForm'].validate((valid) => {
        //   if (valid) {
        //     that.$common.updateAxios(that, '/system/role/update', {
        //       'roleName': that.ruleForm.roleName,
        //       'remark': that.ruleForm.remark,
        //       'menus': JSON.stringify(that.distribute),
        //       'id': that.roleId,
        //     }, '角色修改成功').then(function (flag) {
        //       if (flag) {
        //         that.ruleForm = {
        //           roleName: '',
        //           remark: ''
        //         };
        //         that.distribute = [];
        //         that.undistributed = [];
        //         that.dialogForm = false;
        //         that.$emit('changeFlag', [false, true]);
        //       }
        //     });
        //   };
        // });
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
      permissionFlag(newValue) {
        let that = this;
        that.dialogForm = newValue;
        // 打开新增窗口时加载未分配菜单数据
        if (newValue) {
          that.$common.queryAxios(that, '/system/permission/getUserPermission', {'userId': that.userId}, '', false)
            .then(function (e) {
              debugger
              that.data = e.data.data;
              // that.value = e.data.value;
          });
        }
      }
    }
  }
</script>
