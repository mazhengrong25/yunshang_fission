/*
 * @Description: 订单api
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 17:26:37
 * @LastEditTime: 2020-08-05 14:36:24
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';


// 国内订单列表
function orderList (data) {
	return request({
		method: "POST",
		url: '/api/orders/list', 
		data: data 
	})
};

// 国际订单列表
function orderInterList(data) {
  return request({
    method: 'POST',
    url: '/api/inter/OrderList',
    data: data
  })
};


// 国际订单详情
function orderInterDetails(data) {
  return request({
    method: 'POST',
    url: '/api/inter/orderDetail',
    data: data
  })
};

export default{
  orderList,
  orderInterList,
  orderInterDetails
}
