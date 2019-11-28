<template>
  <div>
    <tree-transfer :title="title" :from_data='distribute' :to_data='undistributed' :defaultProps="{label:'label', type: 'type'}"
                  @addBtn='add' @removeBtn='remove' :mode='mode' filter openAll/>
  </div>
</template>

<script>
  export default {
    props: {
      distribute: {
        type: Array,
        required: true
      },
      undistributed: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        title: ['未分配菜单', '已分配菜单'],
        mode: "transfer", // transfer addressList
      }
    },
    methods: {
      // 监听穿梭框组件添加
      add(fromData, toData) {
        this.$emit('menuLists', [fromData, toData]);
      },
      // 监听穿梭框组件移除
      remove(fromData, toData) {
        this.$emit('menuLists', [fromData, toData]);
      }
    }
  }
</script>
