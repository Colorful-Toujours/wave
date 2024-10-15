import { defineStore } from 'pinia';
import { store } from '@/store';
export const annotateDetailsStore = defineStore({
  id: 'annotateDetailsStore',
  state: () => ({
    ItemId: '',
    // 存储筛选后返回的数据
    storageScreenData: [],
    ScreenBtn: false,
    addStartTime: 0,
    addendTime: 0,
  }),
  actions: {
    saveGridItemId(val) {
      this.ItemId = val;
    },
    saveScreenData(val) {
      this.storageScreenData = val;
    },
    searchBtn(val) {
      this.ScreenBtn = val;
    },
    addTimeForm(val) {
      this.addStartTime = val.start * 1000;
      this.addendTime = val.end * 1000;
    },
  },
});

// 在组件setup函数外使用
export function useGridLayoutStoreWithOut() {
  return annotateDetailsStore(store);
}
