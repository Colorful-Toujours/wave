<template>
    <div class="contaner">
        <div class="list " v-for="(item, i) in goodsList" :key="i" :ref="goodsListDom">
        </div>

    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
    setup() {
        const myRef = ref(null)
        onMounted(() => {
            console.log(myRef.value);

        })
        return {
            myRef
        }
    }
})
</script>

<style  scoped>
.contaner {
    width: 100%;
    height: 100vh;
    background: pink;
    display: flex;
    justify-content: center;
}

.contaner .item {
    width: 200px !important;
    height: 100px;
    background: rgb(144, 226, 12);
    font-size: 30px;
    line-height: 100px;
    text-align: center;
    margin-right: 5px;
}
</style>
