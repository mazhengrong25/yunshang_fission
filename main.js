import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'

Vue.use(uniPopup)
Vue.use(uniPopupMessage)
Vue.use(uniPopupDialog)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
