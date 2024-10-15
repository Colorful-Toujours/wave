<script setup>
import { ref, defineAsyncComponent } from "vue";
// todo 项目使用请放开
import "leaflet-trackplayer";
import { list } from "./trajectoryData.js";

const InitMap = defineAsyncComponent(() => import("./leafLeft.vue"));

const mapObj = ref();

const track = ref(null);

function start() {
  track.value.isPaused = false;
  console.log("track.value", track.value);
}

function stop() {
  track.value.pause();
}

function mapLoad(map) {
  console.log("alert", L);
  mapObj.value = map;
  // 地图设置到合适的缩放级别
  map.setZoom(16, { animate: false });

  // 定义沿着轨迹移动的marker
  const markerIcon = L.icon({
    iconSize: [27, 54],
    iconUrl: new URL("./car.png", import.meta.url).href,
    iconAnchor: [13.5, 27],
  });
  console.log("markerIcon", markerIcon);
  // 创建播放器对象并添加至地图
  try {
    track.value = new L.TrackPlayer(list, { markerIcon });
    console.log("Track Player:", track.value);
    start();
  } catch (error) {
    console.error("Error initializing TrackPlayer:", error);
  }


  start();
}
</script>

<template>
  <init-map
    @map-load="mapLoad"
    :center="[34.27519341726532, 108.911884710754]"
  ></init-map>

  <ul>
    <li class="c-button" @click="start">开始</li>
    <li class="c-button" @click="stop">暂停</li>
  </ul>
</template>

<style scoped></style>