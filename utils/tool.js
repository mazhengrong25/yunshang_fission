import Vue from "vue";
import moment from "moment";
// 获取出发时间
Vue.prototype.$dateTool = (data,type) =>{
  return moment(data).format(type)
}