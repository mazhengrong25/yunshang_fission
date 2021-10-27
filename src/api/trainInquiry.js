/*
 * @Description: 获取车次信息/托管
 * @Author: mzr
 * @Date: 2021-07-28 14:03:03
 * @LastEditTime: 2021-10-22 11:48:09
 * @LastEditors: mzr
 */
import request from '@/api/request';

// 车次查询
function getTrainNumber(data, status) {
  return request({
    method: 'POST',
    url: '/api/train/query',
    data: data,
    status: status,
  });
}

// 站点查询
function getTrainSite(data, status) {
  return request({
    method: 'POST',
    url: '/api/train/query/station',
    data: data,
    status: status,
  });
}

// 订单预定
function getTrainReserve(data, status) {
  return request({
    method: 'POST',
    url: '/api/train/order/reserve',
    data: data,
    status: status,
  });
}

// 订单详情
function getTrainDetail(key,type) {
  console.log(key)
  return request({
    method: 'POST',
    url: '/api/train/order/detail/' + key,
    status: type
  });
}

// 订单支付
function payOrder(id,data){
  return request({
    method: 'POST',
    url: '/api/pay/' + id,
    data:data
  })
}

// 托管模式
// 获取托管列表账号
function getAccountList(data){
  return request({
    method: 'POST',
    url: '/api/train/account/list',
    data:data
  })
}

// 新增账号
function getAddAccount(data){
  return request({
    method: 'POST',
    url: '/api/train/account/add',
    data:data
  })
}

// 删除账号
function getDeleteAccount(data){
  return request({
    method: 'POST',
    url: '/api/train/account/del',
    data:data
  })
}

// 短信验证
function getMessVerify(data){
  return request({
    method: 'POST',
    url: '/api/train/account/msgcheck',
    data:data
  })
}

// 账号选择
function getSelectAccount(data){
  return request({
    method: 'POST',
    url: '/api/train/account/select',
    data:data
  })
}

export default {
  getTrainNumber,
  getTrainSite,
  getTrainReserve,
  getTrainDetail,
  payOrder,
  getAccountList,
  getAddAccount,
  getDeleteAccount,
  getMessVerify,
  getSelectAccount
};
