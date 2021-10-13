/*
 * @Description: 获取车次信息
 * @Author: mzr
 * @Date: 2021-07-28 14:03:03
 * @LastEditTime: 2021-10-13 09:31:51
 * @LastEditors: wish.WuJunLong
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

export default {
  getTrainNumber,
  getTrainSite,
  getTrainReserve,
  getTrainDetail,
  payOrder
};
