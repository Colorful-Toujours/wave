<template>
    <div class="contaner">
        <div :ref="goodsListDom" class="item" v-for="(item,i)  in state.itemList">{{ item.id }}:{{ item.name }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'

export default defineComponent({
    setup() {
        const myRef = ref(null)
        const state = reactive({
            itemList: [{
                id: "1",
                name: "z"
            },
            {
                id: "2",
                name: "k"
            },{
                id:"3",
                name:"z"
            },{
                id:"4",
                name:"j"
            }]
        })
        onMounted(() => {
            console.log(myRef.value);

        })
        return {
            myRef,
            state
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
