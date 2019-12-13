<template>
  <el-dialog title="权限分配" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true" width="50%">

      <hr style="height: 1px;background-color: #d9d9d9;border: none;"/>
      <menu-tree :distribute="distribute" :undistributed="undistributed" @menuLists="menuLists"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save()" tabindex="1">保存</el-button>
      <el-button @click="back" tabindex="2">返回</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import menuTree from '../../common/menuTree'

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
        distribute:[],
        undistributed:[],
      };
    },
    components: {
      menuTree
    },
    methods: {
      menuLists(param) {
        this.undistributed = param[0];
        this.distribute = param[1];
      },
      save() {
        let that = this;
        that.$common.updateAxios(that, '/system/permission/save', {
               role: JSON.stringify(that.distribute),
               userId: that.userId,
             }, '权限新增成功').then(function (flag) {
               if (flag) {
                 that.dialogForm = false;
                 that.$emit('changeFlag', [false, true]);
               }
             });
      },
      back() {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/><b>关闭后已录入的数据无法恢复</b>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
          that.distribute = [];
          that.undistributed = [];
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
          that.distribute = [];
          that.undistributed = [];
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
              that.undistributed = e.data.undistributed;
              that.distribute = e.data.distribute;
          });
        }
      }
    }
  }
</script>
