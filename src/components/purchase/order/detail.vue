<template>
  <el-dialog title="订单明细" :visible.sync="dialogForm" :before-close="handleClose" :close-on-click-modal="false"
             :center="true" :destroy-on-close="true">
    <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="180" align="center"/>
      <el-table-column prop="name" label="商品" align="center"/>
      <el-table-column prop="eName" label="英文名称" align="center"/>
      <el-table-column prop="brand" label="商品品牌" align="center"/>
      <el-table-column prop="price" label="商品价格" align="center"/>
      <el-table-column prop="shopNum" label="商品数量" align="center"/>
    </el-table>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      detailFlag: {
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
        tableData:[],
        dialogForm: false,
      };
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {    //用于设置要合并的列
          if (rowIndex % this.tableData.length === 0) {   //用于设置合并开始的行号
            return {
              rowspan: this.tableData.length,　　　　　//合并的行数
              colspan: 1          //合并的列数，设为０则直接不显示
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleClose(done) {
        let that = this;
        this.$confirm('是否确认关闭窗口？<br/>', '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(function () {
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
      detailFlag(newValue) {
        this.dialogForm = newValue;
        if (newValue) {
          if (this.$common.isEmpty(this.id)) {
            this.$common.errorMessage(this, '系统异常,未获取到订单信息!');
            return false
          }
          let that = this;
          this.$common.queryAxios(this, '/purchase/order/getOrder', {id: this.id}, '订单查询成功').then(function (e) {
            that.tableData = e.data;
          });
        }
      }
    }
  }
</script>
