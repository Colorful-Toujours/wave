import { defineStore } from 'pinia';
import { store } from '@/store';
import { getAudioUrl, getAudioStream } from '@/api/minio';
import { Storage } from '@/utils/Storage';

export const useArticleProcessingStore = defineStore({
  id: 'articleProcessing',
  state: () => ({
   
    /** @文章单行数据 **/
    articleRowItem: {},
    /** @转写结果原始数据 **/
    csrOriRowItem: {},
    /** @转写结果数据 **/
    csrRowItem: [],
    // csrRowItem: Storage.get('CSRLIST'),
    csrDeepCloneItem: [],
    // 存储表格行的名字
    storageTabelColumnData: '',
    /** @识别结果数据 **/
    rawDataItem: {
      data: {},
      index: '',
    },
    regionRawDataItem: {
      data: {},
      index: '',
    },
    /** @ITable默认值 **/
    iTable: {
      isCurrentKey: -1,
      playingPageNum: -1,
    },
    /** @音频播放器url **/
    audio: {
      id: '',
      audioUrl: '', // 默认不能为空，wavesurfer抛异常
      audioBolb: null,
      isPlayingStatus: false,
      audioprocess: 0,
      currentTime: '00:00',
      region: {
        regionStartTime: 0,
        regionEndTime: 0,
      },
      regionUpdated:null,
      isPlayDenoise: false, // 是否设置为降噪语音播放
      regions:[],
      regionsRes:[],

      currentPlayRegions:null,
      activeUser:null,
    },
    /**
     * @视频播放器
     * **/
    video: {
      uu_id: '',
      video_path: '',
      vtt_path: '',
      audioprocess: 0,
      isPlayingStatus: false,
      currentTime: '00:00',
      region: {
        regionStartTime: 0,
      },
    },
    /**
     * @文本预览
     * **/
    text: {
      id: '',
      textUrl: '',
      isPlayingStatus: false,
    },
    /**
     * @文章处理
     * @bt信息
     * @bt列表
     * @bt默认值
     * **/
    bt: {
      btActive: '',
      btList: [],
    },
    /**
     * @模板管理
     * @跳转时的参数传递
     * **/
    currentTemplate: {},
    /**
     * @存储双击行所获取数据
     * **/
    DoubleClickRowData: '',
    zyStatus: 2,
  }),
  actions: {
    // 存储是否开启择优数据
    saveZyStatus(row) {
      this.zyStatus = row;
    },
    /**
     * 存储文章数据
     * @object
     */
    saveArticleRowItem(row) {
      // console.log('第八十行row', row);
      
      this.articleRowItem = row;
      this.audio.id = row.uuid ? row.uuid : row.uuidVoice;
      this.DoubleClickRowData = row.uuid;
    },
    saveDoubleClickRowData(row) {
      // console.log('123456789', row);
      this.DoubleClickRowData = row;
    },
    saveAudioId(id) {
      this.audio.id = id;
    },
    /**
     * 存储转写结果原始数据
     * @object
     */
    saveCsrOriRowItem(row) {
      this.csrOriRowItem = row;
    },
    /**
     * 存储转写结果数据
     * @object
     */
    saveCsrRowItem(row) {
      this.csrRowItem = row;
      this.csrDeepCloneItem = JSON.parse(JSON.stringify(row));
    },
    /**
     * 存储识别结果数据
     * @object
     * **/
    saveRawDataItem(row, index) {
      this.rawDataItem.index = index;
      this.rawDataItem.data = row;
    },
    saveRegionRawDataItem(row, index) {
      // this.regimrawDataItem.index = index;
      console.log('fuck-bitch',row);
      
      this.regionRawDataItem.data = row;
    },
    //  /**
    //   * 指定播放位置
    //   */
    //  controlPlayTime(val){
    //   this.audio.
    //  },
    /**
     * 存储音频播放器
     * @string
     * **/
    saveAudio(row) {
      console.log('存储音频播放器', row);

      this.audio.audioUrl = row;
    },
    setCurrentTime(val) {
      console.log('setCurrentTime90', val.startTime, val.endTime);
      this.audio.currentTime = val.startTime;
      this.audio.region.regionStartTime = val.startTime;
      this.audio.region.regionEndTime = val.endTime;
      this.video.currentTime = val.startTime;
      this.video.region.regionStartTime = val.startTime;
    },
    setProcess(val) {
      // console.log('999', val);

      this.audio.audioprocess = val;
      this.video.audioprocess = val;
    },
    // 清除波形控件所有状态值
    clearWaveSurfer() {
      // console.log('触发clearWaveSurfer');
      // this.audio = {
      //   id: '',
      //   audioUrl: '', // 默认不能为空，wavesurfer抛异常
      //   isPlayingStatus: false,
      //   audioprocess: 0,
      //   currentTime: '00:00',
      //   region: {
      //     regionStartTime: 0,
      //     regionEndTime: 0,
      //   },
      // };
      (this.audio.id = ''),
        (this.audio.audioUrl = ''),
        (this.audio.isPlayingStatus = false),
        (this.audio.audioprocess = 0),
        (this.audio.currentTime = '00:00'),
        (this.audio.region.regionStartTime = 0),
        (this.audio.region.regionEndTime = 0);
    },
    //
    storageTabelColumn(val) {
      this.storageTabelColumnData = val;
    },
    // 清除MyTable控件所有状态值
    clearITable() {
      this.iTable.isCurrentKey = -1;
      this.iTable.playingPageNum = -1;
    },
    // 清除转写结果控件所有状态值
    clearTransResults() {
      this.csrOriRowItem = {};
      this.csrRowItem = [];
      this.csrDeepCloneItem = [];
    },
    // 清除转写结果控件所有状态值
    clearIdentificationResults() {
      this.rawDataItem.data = {};
      this.rawDataItem.index = '';
    },
    // 设置选中行状态值
    setSelectedITableRow(index, pageNum) {
      this.iTable.isCurrentKey = index;
      this.iTable.playingPageNum = pageNum;
    },
    // 获取minio audio url
    async getCurrentAudio(path) {
      console.log('是否降噪',this.audio.isPlayDenoise);
      
      const { data } = await getAudioUrl({
        bucketName: 'bsyb',
        filePath: path,
        voiceType: this.audio.isPlayDenoise ? 1 : null,
      });
      console.log('data', data);
      this.audio.audioUrl = data;

      return data;
    },
    async getCurrentAudioStream(path) {
      const res = await getAudioStream({
        bucketName: 'bsyb',
        filePath: path,
        voiceType: this.audio.isPlayDenoise ? 1 : null,
      });
      console.log('--------getAudioStream', res);
      // const newFileName = data.replace('.wav', '.mp3')
      this.audio.audioBolb = res;
      return res;
    },
    /**
     * @设置播放区域时间段
     * **/
    setRegionTime(start, end) {
      this.audio.regionStartTime = start * 1000;
      this.audio.regionEndTime = end * 1000;
      this.video.regionStartTime = start * 1000;
    },
    //
    /**
     * @切换播放状态
     * @boolean
     * **/
    switchPlayingState(val: boolean) {
      // console.log('切换播放状态', val);

      this.audio.isPlayingStatus = val;
    },
    /**
     * @存储bt信息
     * **/
    saveBtInfo(val) {
      this.bt = val;
      this.bt.btActive = val.btActive;
      this.bt.btList = val.btList;
    },
    /**
     * @保存模板管理数据
     * **/
    saveCurrentTemplate(val) {
      this.currentTemplate = val;
    },
    /**
     * @视频播放器相关
     * **/
    saveVideo(videoPath, vttPath, uuid) {
      console.log('视频字幕相关的', videoPath, vttPath, uuid);

      this.video.video_path = videoPath;
      this.video.vtt_path = vttPath;
      this.video.uu_id = uuid;
    },
    switchVideoPlayingState(val: boolean) {
      this.video.isPlayingStatus = val;
    },
    /**
     * @文本预览相关
     * **/
    saveText(val) {
      this.text.textUrl = val;
    },
    switchTextPlayingState(val: boolean) {
      this.text.isPlayingStatus = val;
    },
    // 设置降噪语音播放状态
    setPlayDenoiseStatus(val: boolean) {
      this.audio.isPlayDenoise = val;
    },
  },
});

// 在组件setup函数外使用
export function useArticleProcessingStoreWithOut() {
  return useArticleProcessingStore(store);
}
