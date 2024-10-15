/*
 * @Author: liutingting
 * [0x7FFC23F5E864] ANOMALY: use of REX.w is meaningless (default operand size is 64) tingting.liu@iplustek.com
 * [0x7FFC23F5E864] ANOMALY: use of REX.w is meaningless (default operand size is 64)
 * @Date: 2023-03-27 16:00:43
 * @LastEditors: liutingting
 * [0x7FFC23F5E864] ANOMALY: use of REX.w is meaningless (default operand size is 64) tingting.liu@iplustek.com
 * [0x7FFC23F5E864] ANOMALY: use of REX.w is meaningless (default operand size is 64)
 * @LastEditTime: 2023-04-12 16:14:37
 * @FilePath: \iplus-yunyue-cyb\src\store\modules\customizeLayout.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import { store } from '@/store';
import { ARTICLE_TYPE } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { getCurrentLayout, saveLayout } from '@/api/monitoring';
import { message } from 'ant-design-vue';
export const useCustomizeLayoutStore = defineStore({
  id: 'customizeLayout',
  state: () => ({
    changeFlag: 0,
    addComponentModalVisible: false,
    currentArtTypeItem: Storage.get(ARTICLE_TYPE),
    // 存储layout
    layouts: [],
    bodyHeight: '',
  }),
  actions: {
    /**
     * @object
     * @customizeLayout
     */
    handleCustomizeLayout(row) {
      console.log('recieve store handleCustomizeLayout', row);
      this.changeFlag = row;
    },
    handleOpenAddComponentModal(val) {
      this.addComponentModalVisible = val;
    },
    // 更新layout数据
    updateLayoutData(newLayout) {
      this.layouts = newLayout;
      // console.log('newLayout',newLayout);
    },
    getBodyHeight(val) {
      this.bodyHeight = val;
    },
    // 获取当前layout
    async getLayout(type) {
      const { data } = await getCurrentLayout({ type });
      this.layouts = eval(data);
    },
    async handleSaveLayout(type) {
      const { code, data } = await saveLayout({ type, layout: JSON.stringify(this.layouts) });

      if (code === 200) {
        message.success(data);
        this.getLayout(type);
      } else {
        message.error(data);
      }
    },
    handleChangeCurrentArtTypeItem(item) {
      this.currentArtTypeItem = item;
      Storage.set(ARTICLE_TYPE, this.currentArtTypeItem);
    },
  },
});

// 在组件setup函数外使用
export function useCustomizeLayoutStoreWithOut() {
  return useCustomizeLayoutStore(store);
}
