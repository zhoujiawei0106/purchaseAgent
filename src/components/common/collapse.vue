<template>
  <div class="search-item-icon" @mouseover="overIcon" @mouseout="outIcon" @click="hideForm">
    <el-collapse-transition>
      <div v-show="hideFlag && !spanFlag" :style="iconOverStyle">
        <i class="el-icon-caret-top"></i>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="hideFlag && spanFlag" :style="iconOutStyle">
        <i class="el-icon-caret-top"></i>
        <span>隐藏查询条件</span>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showFlag && !spanFlag" :style="iconOverStyle">
        <i class="el-icon-caret-bottom"></i>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="showFlag && spanFlag" :style="iconOutStyle">
        <i class="el-icon-caret-bottom"></i>
        <span>显示查询条件</span>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
    export default {
      name: "collapse",
      data() {
        return {
          // 隐藏查询条件
          hideFlag: true,
          // 显示查询条件
          showFlag: false,
          // 隐藏/显示span中的文字(true显示)
          spanFlag: false,
          iconOutStyle: {
            'color': ' #409eff'
          },
          iconOverStyle: {
            'color': ' #c3c3c3'
          },
        }
      },
      props: {
        isHideForm: {
          type: Boolean,
          required: true
        },
      },
      methods: {
        /**
         * 鼠标移入隐藏查询条件div
         */
        overIcon(event) {
          this.spanFlag = true;
          event.path[1].style.backgroundColor = '#f5f5f5'
        },
        /**
         * 鼠标移出隐藏查询条件div
         */
        outIcon(event) {
          this.spanFlag = false;
          event.path[1].style.backgroundColor = 'white'
        },
        /**
         * 点击隐藏查询条件div
         */
        hideForm() {
          debugger;
          this.hideFlag = !this.hideFlag;
          this.showFlag = !this.showFlag;
          // 给父容器传值
          this.$emit('exchangeForm', !this.isHideForm);
        }
      }
      // created:function () {
      //   this.$emit('collapse', false);
      // }
    }
</script>

<style scoped>

</style>
