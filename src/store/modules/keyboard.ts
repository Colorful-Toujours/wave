import { defineStore } from 'pinia';
import { store } from '@/store';
import { KEYBOARD_FOCUS } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { queryKeyboard } from '@/api/system/keyboard';
export const keyboardStore = defineStore({
  id: 'keyboard',
  state: () => ({
    /** 快捷键设置 **/
    focus: false,
    setting: {}
  }),
  actions: {
    async getKeyboardSetting() {
      const { data } = await queryKeyboard();
      
      this.setting = data;
    },
    // 更新FOCUS状态
    updateKeyboardFocus(val: boolean) {
      this.focus = val
      Storage.set(KEYBOARD_FOCUS, val)
    }
  },
});

// 在组件setup函数外使用
export function keyboardStoreWithOut() {
  return keyboardStore(store);
}