import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "leaflet/dist/leaflet.css";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
createApp(App).use(Antd).use(DynamicScroller).mount('#app')