/*
 * @Description: 全局方法
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 18:27:51
 * @LastEditTime: 2020-08-19 10:24:11
 * @LastEditors: wish.WuJunLong
 */
import Vue from "vue";
import moment from "moment";
moment.locale("zh-cn");
// 获取出发时间
Vue.prototype.$dateTool = (data,type) =>{
  return moment(data).format(type)
}

// 计算时间差值
Vue.prototype.$timeDiff = (oldData,data,type) =>{
  return moment(oldData).diff(moment(data), type)
}