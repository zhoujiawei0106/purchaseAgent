<template>
  <el-dialog title="修改行程" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item label="行程开始时间" prop="startTime" label-width="110px">
        <el-date-picker v-model="ruleForm.startTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"
                       :readonly="startStatus" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" tabindex="1">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行程结束时间" prop="endTime" label-width="110px">
        <el-date-picker v-model="ruleForm.endTime" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm:ss"
                       :readonly="endStatus" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" tabindex="2">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="行程目的地" prop="name">
        <el-input v-model="ruleForm.place" placeholder="请输入行程目的地" :readonly="placeStatus" suffix-icon="el-icon-edit" tabindex="3"/>
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
        //日期控件
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        startStatus:false,
        endStatus:false,
        placeStatus:false,
        status:'',
        dialogForm: false,
        inline: true,
        ruleForm: {
          place: '',
          startTime:'',
          endTime:''
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
              startTime:that.ruleForm.startTime,
              endTime:that.ruleForm.endTime,
              'parentId': JSON.parse(sessionStorage.getItem('user')).id,
              'id': this.id
            }, '行程信息修改成功').then(function (flag) {
              if (flag) {
                that.ruleForm = {
                  place: '',
                  startTime:'',
                  endTime:''
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
            startTime:'',
            endTime:''
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
            startTime:'',
            endTime:''
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
            that.ruleForm.startTime = e.data.startTime;
            that.ruleForm.endTime = e.data.endTime,
            that.status = e.data.status;
            debugger;
            if(that.status == '2') {
              that.startStatus = true;
              that.endStatus = true;
              that.placeStatus = true;
            } else if (that.status == '1') {
              that.placeStatus = true;
            }
          });

        }
      }
    }
  }
</script>
