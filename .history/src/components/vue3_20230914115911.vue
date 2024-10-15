<template>
    <div>

    </div>
</template>

<script setup>
import {ref,reactive,watchEffect,watch} from 'vue'
let state =  reactive({
    name:"lcx",
    age:32
})
let lcx1 = ref(1)
watchEffect(()=>{
    console.log('state',state.age);    
})
watch(lcx1,()=>{
    console.log('okok',lcx1.value);
})
setInterval(()=>{
    state.age++
},1000)

</script>

<style lang="less" scoped>

</style>