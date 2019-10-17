<template>
  <el-dialog title="修改行程" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="行程目的地" prop="name">
        <el-input v-model="ruleForm.place" placeholder="请输入行程目的地" suffix-icon="el-icon-edit" tabindex="1"/>
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
          place: ''
        },
        rules: {
          place: [
            {required: true, message: '请输入行程目的地', trigger: 'change'},
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.updateAxios(that, '/purchase/schedule/update', {
              place: that.ruleForm.place,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '行程信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  place: ''
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
            place: ''
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
            place: ''
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
            this.$common.errorMessage(this, '系统异常,未获取到行程信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/purchase/schedule/getSchedule', {id: this.id}, '行程查询成功').then(function (e) {
            that.ruleForm.place = e.data.place;
          });
        }
      }
    }
  }
</script>
