/*
 * @Description: 全局方法
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 18:27:51
 * @LastEditTime: 2020-09-27 16:32:51
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

// 时间对比
Vue.prototype.$timeBefore = (oldTime, newTime) => {
  return moment(newTime?newTime: moment()).isBefore(oldTime)
}

// 邮箱验证
Vue.prototype.$isEmail = (mail) => {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(mail)) {
      return true; 
  } else {
      return false;
  } 
}