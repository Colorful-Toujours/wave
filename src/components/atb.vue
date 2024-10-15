<template>
    <a-card>
      <!-- 使用 vue-virtual-scroller 实现 Table 虚拟滚动 -->      
      <DynamicScroller
        :items="items"
        :min-item-size="54"
        class="table-scroller"
      >
        <template #default="{ item, index, active }">
          显示Item:{{ item }}
          <DynamicScrollerItem
            :item="item"
            :active="active"
         
            :data-index="index"     
          >
            <a-table
              :dataSource="[item]"
              :columns="columns"
              rowKey="id"
              :pagination="false"
              :showHeader="index === 0"
              class="virtual-table-row"
              bordered
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </a-card>
  </template>
  
  <script>
  import { ref } from "vue";
  import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
  import { Table, Card } from "ant-design-vue";
  
  export default {
    name: "VirtualScrollTable",
    components: {
      DynamicScroller,
      DynamicScrollerItem,
      'a-table': Table,
      'a-card': Card,
    },
    setup() {
      // 定义表格的列
      const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
        { title: 'Avatar', dataIndex: 'avatar', key: 'avatar', width: 100, scopedSlots: { customRender: 'avatar' }},
        { title: 'Message', dataIndex: 'message', key: 'message', width: 300 },
      ];
  
      // 生成表格数据

      
      const items = ref(generateDefaultData());
      // const items = ref([]);
  
      // 生成 100 条默认消息数据，每条数据包含 avatar 和 message
      function generateDefaultData() {
        const data = [];
        for (let i = 1; i <= 10000; i++) {
          data.push({
            id: i, // 唯一 ID
            avatar: `https://i.pravatar.cc/150?img=${i}`, // 使用随机头像图片
            message: `This is message number ${i}`, // 消息内容
          });
        }
        return data;
      }
  
      return {
        items,
        columns,
      };
    },
  };
  </script>
  
  <style scoped>
  .table-scroller {
    height: 400px; /* 设置滚动区域的高度 */
    overflow-y: auto;
    border: 1px solid #ddd;
  }
  
  .virtual-table-row {
    display: block;
    width: 100%;
  }
  
  .virtual-table-row .ant-table {
    margin-bottom: 0; /* 移除默认的 table 下边距 */
  }
  </style>
  