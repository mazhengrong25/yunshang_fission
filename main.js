/*
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:53:03
 * @LastEditTime: 2020-08-20 15:29:22
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

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
