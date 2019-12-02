<template>
  <el-dialog title="新增角色" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true" width="50%">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称" suffix-icon="el-icon-edit" tabindex="1"/>
      </el-form-item>
      <el-form-item label="角色描述" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入角色描述" suffix-icon="el-icon-edit" tabindex="2"/>
      </el-form-item>
      <hr style="height: 1px;background-color: #d9d9d9;border: none;"/>
      <el-form-item label="分配菜单"/>
      <menu-tree :distribute="distribute" :undistributed="undistributed" @menuLists="menuLists"/>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save('ruleForm')" tabindex="3">保存</el-button>
      <el-button @click="back" tabindex="4">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import menuTree from './menuTree';

  export default {
    props: {
      addFlag: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        dialogForm: false,
        inline: true,
        ruleForm: {
          roleName: '',
          remark: '',
        },
        rules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'change'},
            {min: 2, max: 4, message: '用户名长度在 2 到 50 个字符', trigger: 'blur'}
          ],
          remark: [
            {required: false, message: '请输入角色描述', trigger: 'change'},
            {min: 0, max: 250, message: '请输入备注长度在 0 到 250 个字符', trigger: 'blur'}
          ]
        },
        distribute:[],
        undistributed:[]
      };
    },
    components: {
      menuTree
    },
    methods: {
      menuLists(param) {
        this.distribute = param[0];
        this.undistributed = param[1];
      },
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.saveAxios(that, '/system/role/save', {
              'roleName': that.ruleForm.roleName,
              'remark': that.ruleForm.remark,
              'menus': JSON.stringify(that.undistributed),
              'id': that.$common.uuid(),
            }, '用户新增成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  roleName: '',
                  remark: '',
                  distribute: [],
                  undistributed:[]
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
            roleName: '',
            remark: '',
            distribute: [],
            undistributed:[]
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
            roleName: '',
            remark: '',
            distribute: [],
            undistributed:[]
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
        let that = this;
        that.dialogForm = newValue;
        // 打开新增窗口时加载未分配菜单数据
        if (newValue) {
          that.$common.queryAxios(that, '/system/role/getUndistributedMenu', {type: 'save'}, '', false).then(function (e) {
            that.undistributed = e.data;
          });
        }
      }
    }
  }
</script>
