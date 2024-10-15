<template>
    <div>
        {{ lcx2 }}
    </div>
    <div class="container">
        <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos maiores est possimus excepturi ad ex ullam dolorem assumenda, laborum at iure nostrum aperiam dolor fuga. A at vitae labore alias.</li>
        <li>Sequi, debitis nesciunt hic tenetur, exercitationem natus similique eveniet sunt nobis, nihil obcaecati eius magni quibusdam earum voluptatibus adipisci tempora unde suscipit! Error recusandae nulla sunt fuga esse, harum earum.</li>
        <li>Iste voluptatem magnam unde deserunt itaque quis assumenda voluptates, quas in officia reiciendis esse doloribus, fuga tempora sint vel adipisci nulla animi. Facere maxime repudiandae nulla quia provident ipsum tempora.</li>
        <li>Ratione quibusdam quisquam eius architecto ipsum maiores, eveniet numquam maxime itaque debitis sit saepe? Rerum incidunt facere adipisci maxime maiores soluta repellendus, repudiandae dolorem ad quod fugiat amet odio odit.</li>
    </div>
</template>

<script setup>
import {ref,reactive,watchEffect,watch,computed, toRefs} from 'vue'
let state =  reactive({
    name:"lcx",
    age:32
})
const toRefs111 = toRefs(state)
console.log('toRefs',toRefs111.age.value);
const {age} =toRefs(state)
let lcx1 = ref(1)
watchEffect(()=>{
    console.log('state',state.age);    
    console.log('toRefs-reactive',toRefs111.age.value);
    console.log('lost-age',age.value);
})
watch(lcx1,()=>{
    console.log('okok',lcx1.value);
})
let lcx2 = computed(()=>{
    if(lcx1.value>=33){
        clearInterval(timer)
       return ''+lcx1.value
    }else{
        return `${lcx1.value}`
    }
   
})
let timer = setInterval(()=>{
    state.age++
    // lcx1.value++
},100)

</script>

<style lang="less" scoped>

</style>