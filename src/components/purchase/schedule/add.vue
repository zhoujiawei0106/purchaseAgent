<template>
  <el-dialog title="新增行程" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="行程开始时间" prop="startTime" label-width="110px">
        <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"  tabindex="1">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行程结束时间" prop="endTime" label-width="110px">
        <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="选择日期时间" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" tabindex="2">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行程目的地" prop="name" label-width="110px">
        <el-input v-model="ruleForm.place" placeholder="请输入行程目的地" suffix-icon="el-icon-edit" tabindex="3"/>
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
          place: '',
          startTime:'',
          endTime:''
        },
        rules: {
          place: [
            {required: true, message: '请输入行程地点', trigger: ''},
          ],
          startTime: [
            {required: true, message: '请输入行程开始时间', trigger: 'change'},
          ],
          endTime: [
            {required: true, message: '请输入行程结束时间', trigger: 'change'},
          ]
        }
      };
    },
    methods: {
      save() {
        let that = this;
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            that.$common.saveAxios(that, '/purchase/schedule/save', {
              place: that.ruleForm.place,
              startTime: that.ruleForm.startTime,
              endTime: that.ruleForm.endTime,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': that.$common.uuid()
            }, '商品新增成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  place: '',
                  startTime: '',
                  endTime: ''
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
            place: '',
            startTime: '',
            endTime: ''
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
            place: '',
            startTime: '',
            endTime: ''
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
      addFlag(newValue) {
        this.dialogForm = newValue;
      }
    }
  }
</script>
