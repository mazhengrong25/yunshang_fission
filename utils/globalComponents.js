/*
 * @Description: 全局注册组件
 * @Author: wish.WuJunLong
 * @Date: 2020-07-23 11:45:41
 * @LastEditTime: 2020-07-23 11:57:29
 * @LastEditors: wish.WuJunLong
 */

import yunSwitch from "@/components/global/yun_switch.vue"; // switch组件

const plugins = {
  install(Vue) {
    Vue.component("base-yun-switch", yunSwitch);
  },
};
export default plugins;
