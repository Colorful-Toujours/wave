<template>
    <div>
      <h2>原生 HTML 表格</h2>
      <table class="simple-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">{{ column.title }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- 使用 v-for 渲染所有数据行 -->
          <tr v-for="row in data" :key="row.id">
            <td v-for="column in columns" :key="column.key">{{ row[column.dataIndex] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from "vue";
  
  export default defineComponent({
    name: "SimpleTable",
    setup() {
      const columns = ref([
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Age", dataIndex: "age", key: "age" },
        { title: "Address", dataIndex: "address", key: "address" },
      ]);
  
      const data = ref([]);
  
      // 模拟数据生成
      const generateData = (count) => {
        const tempData = [];
        for (let i = 0; i < count; i++) {
          tempData.push({
            id: i + 1,
            name: `Name ${i + 1}`,
            age: 20 + (i % 10),
            address: `Address ${i + 1}`,
          });
        }
        return tempData;
      };
  
      // 初始化数据
      onMounted(() => {
        data.value = generateData(1000); // 生成 1000 行数据
      });
  
      return {
        columns,
        data,
      };
    },
  });
  </script>
  
  <style scoped>
  .simple-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .simple-table th,
  .simple-table td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  
  .simple-table th {
    background-color: #f4f4f4;
  }
  </style>
  