<!-- <template>
  <div ref="mapRef" class="map"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
// todo 项目使用请放开 leaflet 引入
import L from 'leaflet';
import { list } from './trajectoryData.js';

const props = defineProps({
  center: {
    type: Array,
    default: [32.0237855, 118.8075675],
  },
});

const emit = defineEmits(["mapLoad"]);

const mapRef = ref();

const initMap = () => {
  const map = L.map(mapRef.value, {
    center: props.center,
    zoom: 11,
    minZoom: 6,
    maxZoom: 20,
  });

  const mapType = "vec";
  L.tileLayer(
    "https://t{s}.tianditu.gov.cn/" +
      mapType +
      "_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
      mapType +
      "&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e",
    {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
      attribution:
        '&copy; <a href="http://lbs.tianditu.gov.cn/home.html">天地图 GS(2022)3124号 - 甲测资字1100471</a>',
    }
  ).addTo(map);

  const mapLabelType = "cva";
  L.tileLayer(
    "https://t{s}.tianditu.gov.cn/" +
      mapLabelType +
      "_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
      mapLabelType +
      "&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=b72aa81ac2b3cae941d1eb213499e15e",
    {
      subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
    }
  ).addTo(map);

  // 地图初始化完成发送事件
  emit("mapLoad", map);

  return map;
};

const mapObj = ref();

// 在 onMounted 中初始化地图
onMounted(() => {
  mapObj.value = initMap();
});

const removeMap = () => {
  if (mapObj.value) {
    mapObj.value.remove();
  }
};

// 在组件卸载时删除地图
onUnmounted(() => {
  removeMap();
});
</script>

<style  scoped>
.map {
    width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style> -->
<script setup>
import { ref, defineAsyncComponent } from 'vue';
// todo 项目使用请放开
// import 'leaflet-trackplayer';
import { list } from './trajectoryData.js';

const InitMap = defineAsyncComponent(() =>
  import('../../components/InitMapTianditu.vue')
);

const mapObj = ref();

const track = ref(null);

function start() {
  track.value.start();
}

function stop() {
  track.value.pause();
}

function mapLoad(map) {
  mapObj.value = map;
  // 地图设置到合适的缩放级别
  map.setZoom(16, { animate: false });

  // 定义沿着轨迹移动的marker
  const markerIcon = L.icon({
    iconSize: [27, 54],
    iconUrl: new URL('/img/car.png', import.meta.url).href,
    iconAnchor: [13.5, 27]
  });

  // 创建播放器对象并添加至地图
  track.value = new L.TrackPlayer(list, { markerIcon }).addTo(map);

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