/*
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:53:03
 * @LastEditTime: 2021-11-11 10:04:01
 * @LastEditors: wish.WuJunLong
 */
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

Vue.use(uniPopup)
Vue.use(uniPopupMessage)
Vue.use(uniPopupDialog)

import "@/utils/tool.js"
import "@/utils/base.less"

// 自定义组件 全局注册
import yunSwitch from "@/components/global/yun_switch.vue"; // switch组件
Vue.component('yunSwitch', yunSwitch);

import yunHeader from "@/components/global/yun_header.vue"; // 头部组件
Vue.component('yunHeader', yunHeader);

import yunSelector from "@/components/global/yun_selector.vue"; // 弹窗选择器组件
Vue.component('yunSelector', yunSelector);

import yunConfig from "@/components/global/yun_config.vue"; // 确认信息框
Vue.component('yunConfig', yunConfig);

import DefaultPage from "@/components/default_page.vue"; // 缺省页
Vue.component('DefaultPage', DefaultPage);

Vue.prototype.$globalType = '云上航空', // 全局变量

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
