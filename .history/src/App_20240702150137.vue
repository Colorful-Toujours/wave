<script setup>
import HelloWorld from './components/HelloWorld.vue'
import onlyOffice from './components/onlyOffice.vue';
import vue3dom from './components/vue3dom.vue';
import test from './components/test.vue';
import vue3 from './components/vue3.vue'
import leafLeft from './components/leafLeft.vue';
</script>

<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="container">
    <!-- <onlyOffice /> -->
    <!-- <vue3dom></vue3dom> -->
    <!-- <test></test> -->
    <!-- <vue3></vue3> -->
    <!-- <leaf-left></leaf-left> -->
    <Track />
  </div>
 

</template>

<style scoped>
.container{
  width: 100vw;
  height: 100vh;
  /* background: rgb(174, 228, 112); */
}
</style>
