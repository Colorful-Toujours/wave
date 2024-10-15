import { defineStore } from 'pinia';
import { store } from '@/store'
export const useGridLayoutStore = defineStore({
    id: 'gridLayout',
    state: () => ({
        /** @ grid layout target **/
        gridItemId: ''
    }),
    actions: {
        /**
         * 存储grid layout item
         */
        saveGridItemId(val) {
            this.gridItemId = val
        }
    }
});

// 在组件setup函数外使用
export function useGridLayoutStoreWithOut() {
    return useGridLayoutStore(store);
}
