<template>
    <div>
      <div class="text-container">
        <p v-for="(sentence, index) in sentences" :key="index">{{ sentence }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sentences: [],
        status: false,
      };
    },
    mounted() {
      // 模拟实时返回数据
      setInterval(() => {
        const responseData = {
          res: 'New sentence',
        };
  
        // 模拟根据条件变化status的值
        this.status = Math.random() < 0.5; // 随机设置status为true或false
  
        // 模拟处理实时响应数据
        this.handleResponse(responseData);
      }, 2000); // 每2秒更新一次数据
    },
    methods: {
      handleResponse(response) {
        const { res } = response;
  
        if (this.status) {
          // 最终语句
          this.sentences.push(res);
        } else {
          // 校对语句
          const lastSentence = this.sentences[this.sentences.length - 1];
          const updatedSentence = lastSentence ? lastSentence + res : res;
          this.sentences.splice(this.sentences.length - 1, 1, updatedSentence);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .text-container {
    height: 200px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 10px;
  }
  .text-container p {
    margin: 0;
    padding: 5px 0;
  }
  </style>