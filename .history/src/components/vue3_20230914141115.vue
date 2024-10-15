<template>
    <div>
        {{ lcx2 }}
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