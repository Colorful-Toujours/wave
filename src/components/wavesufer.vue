<template>
  <div class="wave-wrapper">
    <div class="loading" v-show="loading">
      <a-skeleton />
      <div style="color: #1890ff">音频解码中：牛马也需要休息的！</div>
      <a-button @click="playSegmentFromBlob(1)">111</a-button>
    </div>
    <div class="NotLoading" v-show="!loading">
      {{ segNumbers }}
      <div
        id="waveform"
        @click="handleClearRegions"
        @wheel.prevent="handleWheel"
      ></div>
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
          <a-slider
            v-model:value="zoomValue"
            :min="0"
            :max="1000"
            :tooltip-open="true"
            @afterChange="triggerZoom"
          />
        </div>
        <a-select
          ref="select"
          v-model:value="state.audioRate"
          style="width: 70px"
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
const zoomValue = ref(0);
const loading = ref(true);
const regions = RegionsPlugin.create();
// 总段数
const segNumbers = ref(0);
const blobPools = ref([]);
const state = reactive({
  crtTiming: "00:00",
  totalTime: "00:00",
  audioRate: 0.25,
  speeds: [0.25, 0.5, 1, 2, 4],
  currentChunk: 0,
  chunkSize: 1024,
  isChunkLoading: false, // 标志
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
const handleWheel = (e) => {
  console.log("e", e);
  // 获取滚动的距离
  let deltaY = e.deltaY;
  let deltaX = e.deltaX;

  if (deltaY > 0) {
    console.log("向下滚动");
  } else {
    console.log("向上滚动");
  }

  if (deltaX > 0) {
    console.log("向右滚动");
  } else if (deltaX < 0) {
    console.log("向左滚动");
  }
  zoomValue.value = e.deltaY;
  ws.value.zoom(zoomValue.value);
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
          data.data,
          60
        );
      })
      .catch((error) => console.error("Error loading JSON:", error));
  } else {
    // ws.value.load("/public/sample-15s.wav");
  }
};

const getSegNumbers = () => {
  // 请求服务端获取音频段
  fetch(`http://127.0.0.1:3000/audio-info`)
    .then((response) => response.text())
    .then((data) => {
      try {
        const jsonData = JSON.parse(data);
        console.log(jsonData);
        const rangeBit = (jsonData.bit_rate * 1) / 8;
        segNumbers.value = Math.ceil(jsonData.size / rangeBit);
        console.log("????");
        getSegment(3);
      } catch (error) {
        console.error("JSON 解析错误:", error, data);
      }
    });
};
const getSegment = (segNumber) => {
  console.log(`Loading segment ${segNumber}`);
  return new Promise((resolve, reject) => {
    const chunkStart = state.chunkSize * (segNumber - 1);
    const chunkEnd = state.chunkSize * segNumber;

    fetch(`http://127.0.0.1:3000/audio-slice`, {
      method: "GET",
      headers: {
        Range: `bytes=${chunkStart}-${chunkEnd}`, // 设置 Range 请求头
      },
    })
      .then((response) => {
        if (response.status === 206) {
          return response.arrayBuffer();
        } else {
          reject(`Unexpected response status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log('data',data);
        const blob = new Blob([data], { type: "audio/wav" });
        console.log("blob", blob);
        const url = URL.createObjectURL(blob);
        blobPools.value[segNumber] = { url };
        // console.log(`Segment ${segNumber} loaded and cached.`);
        console.log("blobPools", blobPools.value);
        resolve(); // 加载完成后 resolve
      })
      .catch((error) => {
        console.error("Error loading audio chunk:", error);
        reject(error); // 如果出错，reject
      });
  });
};
// 播放指定的音频片段
const playSegmentFromBlob = (segNumber) => {
  loading.value = false;
  // 检查缓存中是否有该片段
  if (blobPools.value[segNumber]) {
    const blobUrl = blobPools.value[segNumber].url;
    console.log("blobUrl", blobUrl);
    // 使用 wavesurfer 加载该音频片段的 URL
    ws.value.load(blobUrl);

    // 播放该音频片段
    ws.value.play();
    console.log(`Playing segment ${segNumber} from cache.`);
  } else {
    console.error(`Segment ${segNumber} is not cached.`);
  }
};

const triggerZoom = (val) => {
  console.log("after change", val);
  ws.value.zoom(val);
};

const initWaveSurfer = () => {
  ws.value = WaveSurfer.create({
    container: "#waveform",
    waveColor: "rgb(150, 150, 250)",
    progressColor: "rgb(100, 100, 200)",
    // url: "/public/sample-6s.wav",
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
    minPxPerSec: 10,
    scrollParent: true,
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
        maxZoom: 1000,
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
    const currentDuration = ws.value.getDuration();
    const timeRemaining = currentDuration - currentTime;

    // 当剩余时间少于2秒时，加载并播放下一段
    if (timeRemaining < 2 && !state.isChunkLoading) {
      const nextSegment = state.currentChunk + 1;
      if (nextSegment <= segNumbers.value) {
        playSegment(nextSegment); // 自动播放下一段
      }
    }

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
  getSegNumbers();
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
    cursor: grab;
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
        border: 2px solid #d6d5d5;
      }
    }
  }
  .slider-container {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 60px;
    // background: red;
    :deep(.ant-slider) {
      width: 60px;
    }
  }
}
</style>
