/*
 * @Description: 全局方法
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 18:27:51
<<<<<<< HEAD
 * @LastEditTime: 2021-09-18 10:57:48
 * @LastEditors: mzr
=======
 * @LastEditTime: 2021-07-27 15:48:16
 * @LastEditors: wish.WuJunLong
>>>>>>> 47979d98edefd9c6cf31d515ce6308bf840db67b
 */
import Vue from "vue";

// 时间处理注册
import moment from "moment";
moment.locale("zh-cn");
<<<<<<< HEAD
Vue.prototype.$moment = moment
=======
Vue.prototype.$moment = moment;

>>>>>>> 47979d98edefd9c6cf31d515ce6308bf840db67b
// 获取出发时间
Vue.prototype.$dateTool = (data, type) => {
  return moment(data).format(type);
};

// 计算时间差值
Vue.prototype.$timeDiff = (oldData, data, type) => {
  return moment(oldData).diff(moment(data), type);
};

// 时间对比
Vue.prototype.$timeBefore = (oldTime, newTime) => {
  return moment(newTime ? newTime : moment()).isBefore(oldTime);
};

// 邮箱验证
Vue.prototype.$isEmail = (mail) => {
  var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(mail)) {
    return true;
  } else {
    return false;
  }
};

// 电话号码验证
Vue.prototype.$isPhone = (phone) => {
  var filter = /^1[3|4|5|7|8][0-9]{9}$/;
  if(filter.test(phone)) {
    return true;
  }else {
    return false;
  }
}

// 乘法计算
Vue.prototype.$NumberMul = (arg1, arg2) => {
  let m = 0;
  let s1 = arg1.toString();
  let s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}

  return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
};

// 除法计算
Vue.prototype.$NumberDiv = (arg1, arg2, digit) => {
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));

  let result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString();
  let result2 = result.split(".")[1];
  result2 = result2.substring(0, digit > result2.length ? result2.length : digit);

  return Number(result.split(".")[0] + "." + result2);
};
