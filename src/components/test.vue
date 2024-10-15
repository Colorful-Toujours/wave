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
        counter: 0,
      };
    },
    mounted() {
      // 模拟实时返回数据
      setInterval(() => {
        const responseData = {
          res: this.counter.toString(),
          status: Math.random() < 0.5,
        };
  
        // 模拟处理实时响应数据
        this.handleResponse(responseData);
  
        // 递增计数器
        this.counter++;
      }, 2000); // 每2秒更新一次数据
    },
    methods: {
      handleResponse(response) {
        const { res, status } = response;
  
        if (status) {
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