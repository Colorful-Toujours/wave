<template>
    <div>
        李程序能活到{{ lcx2 }}
    </div>
</template>

<script setup>
import {ref,reactive,watchEffect,watch,computed} from 'vue'
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
let lcx2 = computed(()=>{
    return lcx1.value
})
setInterval(()=>{
    state.age++
    lcx1.value++
},1000)

</script>

<style lang="less" scoped>

</style>