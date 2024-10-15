<template>
    <init-map @map-load="mapLoad" :center="[34.27519341726532, 108.911884710754]"></init-map>
    <ul>
      <li class="c-button" @click="start">开始</li>
      <li class="c-button" @click="stop">暂停</li>
    </ul>
  </template>
  
  <script setup>
  import { ref, defineAsyncComponent } from "vue";
  import "leaflet-trackplayer";
  import { list } from "./trajectoryData.js";
  
  const InitMap = defineAsyncComponent(() => import("./leafLeft.vue"));
  
  const mapObj = ref();
  const track = ref(null);
  
  function start() {
    if (track.value) {
      track.value.start();
      console.log("track.value", track.value);
    } else {
      console.error("TrackPlayer is not initialized");
    }
  }
  
  function stop() {
    if (track.value) {
      track.value.pause();
    } else {
      console.error("TrackPlayer is not initialized");
    }
  }
  
  function mapLoad(map) {
    console.log("alert", L);
    mapObj.value = map;
    map.setZoom(16, { animate: false });
  
    const markerIcon = L.icon({
      iconSize: [27, 54],
      iconUrl: new URL("./car.png", import.meta.url).href,
      iconAnchor: [13.5, 27],
    });
    console.log("markerIcon", markerIcon);
  
    try {
      track.value = new L.TrackPlayer(list, { markerIcon });
      console.log("Track Player:", track.value);
      track.value.addTo(map);  // 确保addTo方法在TrackPlayer实例上正确调用
    
    } catch (error) {
      console.error("Error initializing TrackPlayer:", error);
    }
  
    start();
  }
  </script>
  
  <style scoped>
  .c-button {
    cursor: pointer;
    margin: 5px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
  }
  .c-button:hover {
    background-color: #0056b3;
  }
  </style>
  