<template>
  <div class="wave-wrapper">
    <div id="waveform" @click="handleClearRegions"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
const ws = ref(null);
const regions = ref(null);

const initWaveSurfer = () => {
  ws.value = WaveSurfer.create({
    container: "#waveform",
    waveColor: "rgb(150, 150, 250)",
    progressColor: "rgb(100, 100, 200)",
    url: "/public/sample-6s.wav",
    // url: "/public/test64m.mp3",
    backend: "MediaElement",
    height: 150,
    plugins: [
      // 注册时间轴插件
      TimelinePlugin.create({
        height: 15,
        timeInterval: 0.1,
        primaryLabelInterval: 1,
        style: {
          fontSize: "10px",
          color: "#000",
          // background:""
        },
      }),

      // 注册选区插件
      (regions.value = RegionsPlugin.create({})),
      // 注册语谱图插件
      Spectrogram.create({
        labels: true,
        height: 200,
        container: "#waveform",
        splitChannels: true,
      }),
      Minimap.create({
        height: 20,
        waveColor: "#ddd",
        progressColor: "#999",        
      }),
    ],
  });

  ws.value.on("ready", () => {
    regions.value.addRegion({
      start: 0, // 5秒
      end: 1, // 10秒
      color: "rgba(0, 0, 255, 0.5)", // 区域颜色
    });
    regions.value.enableDragSelection({
      color: "rgba(255, 0, 0, 0.1)",
    });
  });

  // 监听区域更新事件
  regions.value.on("region-update-end", (region) => {
    console.log("Updated Region:", region);
  });
};


// Methods
const handleClearRegions=() =>{
  console.log('regions.value',regions.value);
  regions.value.clearRegions();
}
onMounted(() => {
  initWaveSurfer();
});
</script>

<style scoped>
.wave-wrapper {
  width: 100%;
  height: 150px;
  background: #fff;
}
</style>
