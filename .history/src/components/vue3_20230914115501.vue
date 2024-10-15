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
watchEffect(()=>{
    console.log('state',state.age);    
})
setInterval(()=>{
    state.age++
},1000)

</script>

<style lang="less" scoped>

</style>