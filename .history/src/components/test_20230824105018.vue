<template>
    <div>
      <div class="text-container">
        1111
        <p v-for="(sentence, index) in sentences" :key="index">{{ sentence }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sentences: [],
      };
    },
    mounted() {
      // 模拟后端返回的数据
      const responseData = {
        res: 'This is a sentence.',
        status: true,
      };
  
      // 模拟处理响应数据
      this.handleResponse(responseData);
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