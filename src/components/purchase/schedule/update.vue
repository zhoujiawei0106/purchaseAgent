<template>
  <el-dialog title="修改行程" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :inline="inline" label-position="right">
      <el-form-item v-show="isEnd" label-width="100%"  style="width:100%; height:2px;text-align: center">
        <span class="dialog-footer">
          <el-button type="warning" v-text="'行程已结束'"></el-button>
        </span>
      </el-form-item>
      <el-form-item v-show="startStatus" label="行程开始日期" prop="startTime" label-width="110px">
        <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="选择行程开始日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd" tabindex="1">
        </el-date-picker>
      </el-form-item>
      <el-form-item  v-show="endStatus" label="行程开始日期" prop="endTime" label-width="110px">
        <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="选择行程结束日期" format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"  tabindex="2">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-show="placeStatus" label="行程目地" prop="name">
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
        isEnd:false,
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
            if(that.status == '2') {
              that.startStatus = false;
              that.endStatus = false;
              that.placeStatus = false;
              that.isEnd = true;
            } else if (that.status == '1') {
              that.startStatus = true;
              that.endStatus = true;
              that.placeStatus = false;
              that.isEnd = false;
            } else {
              that.startStatus = true;
              that.endStatus = true;
              that.placeStatus = true;
              that.isEnd = false;
            }
          });

        }
      }
    }
  }
</script>
