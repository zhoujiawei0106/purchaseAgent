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
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
      // changeMode() {
      //   if (this.mode == "transfer") {
      //     this.mode = "addressList";
      //   } else {
      //     this.mode = "transfer";
      //   }
      // },
      // 监听穿梭框组件添加
      add(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      },
      // 监听穿梭框组件移除
      remove(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        console.log("fromData:", fromData);
        console.log("toData:", toData);
        console.log("obj:", obj);
      }
    }
  }
</script>
