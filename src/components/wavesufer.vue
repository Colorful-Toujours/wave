<template>
  <div class="wave-wrapper">
    <div class="loading" v-show="loading">
      <a-skeleton />
      <div style="color: #1890ff">音频解码中：牛马也需要休息的！</div>
    </div>
    <div class="NotLoading" v-show="!loading">
      <div id="waveform" @click="handleClearRegions"></div>
      <div class="spectrogram" id="spectrogram" v-show="isSpectrogram"></div>
      <div class="opreate">
        <div class="timeContainer">
          <div class="time">{{ state.crtTiming }}</div>
          <span>/</span>
          <div class="time">{{ state.totalTime }}</div>
        </div>
        <div @click="handleSkip(-5)"><FastBackwardFilled /></div>
        <div @click="changeStep(-1)"><StepBackwardFilled /></div>
        <div @click="handlePlay()">
          <PlayCircleFilled v-if="crtPlayStatus == 'Play'" /><PauseCircleFilled
            style="color: #1890ff"
            v-else
          />
        </div>
        <div @click="changeStep(1)"><StepForwardFilled /></div>
        <div @click="handleSkip(3)"><FastForwardFilled /></div>
        <div @click="handleBack(3)"><RetweetOutlined /></div>
        <div class="slider-container">
          <input
            type="range"
            min="0"
            max="50"
            v-model="zoomLevel"
            @input="handleZoom"
          />
        </div>
        <a-select
          ref="select"
          v-model:value="state.audioRate"
          style="width: 70px; margin-left: 20px"
          @change="handleChangeRate"
          size="small"
        >
          <a-select-option
            v-for="(item, index) in state.speeds"
            :key="index"
            :value="item"
            >{{ item }}</a-select-option
          >
        </a-select>
        <a-button size="small" @click="changePane">开/关</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import {
  StepBackwardFilled,
  StepForwardFilled,
  FastBackwardFilled,
  FastForwardFilled,
  PlayCircleFilled,
  PauseCircleFilled,
  RetweetOutlined,
} from "@ant-design/icons-vue";
const ws = ref(null);
const crtPlayStatus = ref("Play");
const isSpectrogram = ref(true);
const zoomLevel = ref(0);
const loading = ref(true);
const regions = RegionsPlugin.create();
const state = reactive({
  crtTiming: "00:00",
  totalTime: "00:00",
  audioRate: 0.25,
  speeds: [0.25, 0.5, 1, 2, 4],
});
const formatTime = (seconds) => {
  seconds = Number(seconds);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let secondsStr = Math.round(seconds).toString();
  secondsStr = seconds.toFixed(0);
  if (minutes > 0) {
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + secondsStr : secondsStr
    }`;
  }
  return `00:${seconds < 10 ? "0" + secondsStr : secondsStr}`;
};
// Methods
const handleChangeRate = () => {
  ws.value.setPlaybackRate(state.audioRate, true);
};
const changePane = () => {
  isSpectrogram.value = !isSpectrogram.value;
};
const handleClearRegions = () => {
  regions.clearRegions();
};
const handlePlay = () => {
  ws.value.playPause();
};
const handleSkip = (args) => {
  ws.value.skip(args);
};
const handleBack = (args) => {
  ws.value.play();
};
const changeStep = (args) => {
  handleClearRegions();

  if (args == -1) {
    // ws.value.load("/public/sample-6s.wav");
    fetch("http://192.168.1.186:41184/bsyb/20241016/1h.json")
      .then((response) => response.json())
      .then((data) => {
        ws.value.load(
          "http://192.168.1.186:41184/bsyb/20241016/1h.wav",
          data.data
        );
      })
      .catch((error) => console.error("Error loading JSON:", error));
  } else {
    ws.value.load("/public/sample-15s.wav");
  }
};
const handleZoom = () => {
  ws.value.zoom(zoomLevel.value);
};
const initWaveSurfer = () => {
  ws.value = WaveSurfer.create({
    container: "#waveform",
    waveColor: "rgb(150, 150, 250)",
    progressColor: "rgb(100, 100, 200)",
    url: "/public/sample-6s.wav",
    // url: "/public/test64m.mp3",
    backend: "MediaElement",
    // backend:'WebAudio',
    height: 150,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    // 声道
    splitChannels: true,
    normalize: true,
    // Cursor
    cursorColor: "#ddd5e9",
    // autoScroll
    autoScroll: false,
    // minPxPerSec
    minPxPerSec: 100,
    audioRate: 0.5,
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
      regions,
      // 注册语谱图插件
      Spectrogram.create({
        labels: true,
        height: 150,
        container: "#spectrogram",
        splitChannels: true,
      }),
      Minimap.create({
        height: 20,
        waveColor: "#ddd",
        progressColor: "#999",
      }),
      ZoomPlugin.create({
        scale: 0.5,
        maxZoom: 100,
      }),
    ],
  });

  // 监听ws实例方法
  ws.value.on("ready", () => {
    console.log("ws.value.getDuration()", ws.value.getDuration());
    state.totalTime = formatTime(ws.value.getDuration());
    regions.enableDragSelection({
      color: "rgba(0, 0, 0, 0.1)",
    });
  });
  ws.value.on("decode", (duration) => {
    console.log("Decode", duration + "s");
    loading.value = false;
    const slider = document.querySelector('input[type="range"]');

    slider.addEventListener("input", (e) => {
      const minPxPerSec = e.target.valueAsNumber;
      console.log("minPxPerSec", minPxPerSec);
      ws.value.zoom(minPxPerSec);
    });
  });
  ws.value.on("redrawcomplete", () => {
    console.log("Redraw began");
  });
  ws.value.on("play", () => {
    console.log("Play");
    crtPlayStatus.value = "Pause";
  });
  ws.value.on("pause", () => {
    crtPlayStatus.value = "Play";
    console.log("Pause 暂停");
  });
  ws.value.on("timeupdate", (currentTime) => {
    console.log("Time", currentTime + "s");

    state.crtTiming = formatTime(currentTime);
  });
  ws.value.on("seeking", (currentTime) => {
    console.log("Seeking", currentTime + "s");
  });
  ws.value.on("scroll", (visibleStartTime, visibleEndTime) => {
    console.log("Scroll", visibleStartTime + "s", visibleEndTime + "s");
  });
  ws.value.on("zoom", (minPxPerSec) => {
    console.log("Zoom", minPxPerSec + "px/s");
  });
  ws.value.on("destroy", () => {
    console.log("Destroy");
  });

  // 监听区域更新事件
  regions.on("region-update-end", (region) => {
    console.log("Updated Region:", region);
  });
};

onMounted(() => {
  initWaveSurfer();
});
</script>

<style lang="less" scoped>
.wave-wrapper {
  width: 900px;
  height: auto;
  border: 3px solid #dddddd;
  /* background: rgb(165, 219, 75, 109); */
  .spectrogram {
    width: 100%;
    height: auto;
    // background: red;
    border: 3px solid #dddddd;
  }
  .opreate {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 15px;
    background: #eee;
    .timeContainer {
      width: 100px;
      display: flex;
      justify-content: flex-start;
      .time {
        min-width: 50px;
        height: 25px;
        line-height: 22px;
        text-align: center;
        margin: 2px;
        overflow: hidden;
        border: 2px solid #1890ff;
      }
    }
  }
  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100px;
  }
}
</style>
