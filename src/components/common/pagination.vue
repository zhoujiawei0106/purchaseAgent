<template>
  <div class="pagination">
    <el-pagination layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]" v-show="pagination"
                   :page-size="formData.rows" :current-page="formData.page" :total="formData.total" background
                   @size-change="sizeChange" @current-change="currentChange" >
    </el-pagination>
  </div>
</template>

<script>
    export default {
      name: "pagination",
      props: {
        url: {
          type: String,
          required: true
        },
        pagination: {
          type: Boolean,
          required: true
        },
        formData: {
          type: Object,
          required: true
        },
        tableData: {
          type: Array,
          required: true
        }
      },
      methods: {
        /**
         * 修改当前页显示条数
         * @param value
         */
        sizeChange(value) {
          this.formData.rows = value;
          let that = this;
          // 请求后台更新数据
          that.$axios.get(that.$common.contentPath + that.url, {params: that.formData}).then(function (event) {
            if (event.data.flag) {
              that.tableData = event.data.data.list;
              // 根据返回数据量显示或隐藏分页条，并设置分页信息
              if (event.data.data.list.length > 0) {
                // 设置当前第页数
                that.formData.page = event.data.data.pageNum;
                // 设置每页条数
                that.formData.rows = event.data.data.pageSize;
                // 设置总条数
                that.formData.total = event.data.data.total;
                let returnData = {
                  'pagination': true,
                  'formData': that.formData,
                  'tableData': that.tableData
                };
                that.$emit('exchangePagination', returnData);
              } else {
                let returnData = {
                  'pagination': false,
                  'formData': that.formData,
                  'tableData': {}
                };
                that.$emit('exchangePagination', returnData);
              }
            } else {
              errorAlert(that, event.data);
              console.log(event.data.msg);
            }
          }).catch(function (e) {
            console.log(e)
          });
        },
        /**
         * 自己选择页数
         * @param value
         */
        currentChange(value) {
          this.formData.page = value;
          let that = this;
          // 请求后台更新数据
          that.$axios.get(that.$common.contentPath + that.url, {params: that.formData}).then(function (event) {
            if (event.data.flag) {
              that.tableData = event.data.data.list;
              // 根据返回数据量显示或隐藏分页条，并设置分页信息
              if (event.data.data.list.length > 0) {
                // 设置当前第页数
                that.formData.page = event.data.data.pageNum;
                // 设置每页条数
                that.formData.rows = event.data.data.pageSize;
                // 设置总条数
                that.formData.total = event.data.data.total;
                let returnData = {
                  'pagination': true,
                  'formData': that.formData,
                  'tableData': that.tableData
                };
                that.$emit('exchangePagination', returnData);
              } else {
                let returnData = {
                  'pagination': false,
                  'formData': that.formData,
                  'tableData': {}
                };
                that.$emit('exchangePagination', returnData);
              }
            } else {
              errorAlert(that, event.data);
              console.log(event.data.msg);
            }
          }).catch(function (e) {
            console.log(e)
          });
        }
      }
    }
</script>

<style scoped>
  .pagination{
    text-align: center; /*让div内部文字居中*/
    padding-top: 1%;
  }
</style>
