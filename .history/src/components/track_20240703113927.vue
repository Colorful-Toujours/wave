<template>
    <init-map @map-load="mapLoad" :center="[39.9042, 116.4074]"></init-map>
    <ul>
      <li class="c-button" @click="start">开始</li>
      <li class="c-button" @click="stop">暂停</li>
    </ul>
  </template>
  
  <script setup>
  import { ref, defineAsyncComponent } from "vue";
  import "leaflet-trackplayer";
  import { list } from "./trajectoryData.js";
  import L from 'leaflet';
  const InitMap = defineAsyncComponent(() => import("./leafLeft.vue"));
  
  const mapObj = ref();
  const track = ref(null);
  
  function start() {
    track.value.start();
      console.log("track.value", track.value);
  }
  
  function stop() {
    if (track.value) {
      track.value.pause();
    } else {
      console.error("TrackPlayer is not initialized");
    }
  }
  
  function mapLoad(map) {
  
    mapObj.value = map;
    map.setZoom(16, { animate: false });
  
    const markerIcon = L.icon({
      iconSize: [54, 108],
      iconUrl: new URL("https://webapi.amap.com/images/car.png", import.meta.url).href,
      iconAnchor: [27, 54],
    });
    console.log("markerIcon", markerIcon);
  
    track.value = new L.TrackPlayer(list, { markerIcon ,speed:800}).addTo(map);
  
    // start();
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
  