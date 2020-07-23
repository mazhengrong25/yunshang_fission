import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

// 自定义组件 全局注册
import yunSwitch from "@/components/global/yun_switch.vue"; // switch组件
Vue.component('yunSwitch', yunSwitch);

import yunHeader from "@/components/global/yun_header.vue"; // switch组件
Vue.component('yunHeader', yunHeader);

// import GL_Component from '@/utils/globalComponents.js'
// Vue.use(GL_Component);

Vue.use(uniPopup)
Vue.use(uniPopupMessage)
Vue.use(uniPopupDialog)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
