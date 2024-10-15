<template>
    <div class="contaner">
        <!-- <div :ref="goodsListDom" class="item" v-for="(item,i)  in state.itemList">{{ item.id }}:{{ item.name }}</div> -->       
    </div>
    <Child :class="mineCls"></Child>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from 'vue'
import Child from './Child.vue'
export default defineComponent({
    components: {
        Child
  },
    setup() {
        const mineCls = ref('111')
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
        // 变量保存所有的dom
    const gDomArr = ref([])
    // 获取goodsListDom多个dom节点
    const goodsListDom = (el) => {
        console.log('el',el);
        
      gDomArr.value.push(el)
    }
        onMounted(() => {
            console.log(myRef.value);
                console.log('gDomArr',gDomArr.value);
                
        })
        return {
            myRef,
            state,
            gDomArr,
            goodsListDom,
            mineCls            
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
.mineCls{
    background: red;
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
