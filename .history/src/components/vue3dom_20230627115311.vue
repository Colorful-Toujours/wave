<template>
    <div class="contaner">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
        <div class="item">4</div>
        <div class="item">5</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {


        return {}
    }
})
</script>

<style  scoped>
.contaner {
   width: 100%;
   height: 100vh;
   background: pink;
}
.contaner .item {
    width: 200px !important;
    height: 100px;
    background: blue;
}
</style>
