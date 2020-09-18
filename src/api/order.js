/*
 * @Description: 订单api
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 17:26:37
 * @LastEditTime: 2020-09-18 11:56:26
 * @LastEditors: mazhengrong
 */
import request from '@/api/request';


//	获取航程信息
function getFilghtData(data) {
	return request({
		method:'POST',
		url:'/api/refund/details',
		data: data
	})
}

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

// 国内订单详情
function orderDetails(data) {
	return request({
		method: 'POST',
		url:'/api/order/details',
		data: data
	})
}

//	退票详情
function orderInterRefund(data) {
	return request({
		method:'POST',
		url:'/api/refund/details',
		data: data
	})
}

// 退票  提交申请
function refundSubmit(data) {
	return request({
		method:'POST',
		url:'/api/refund/order',
		data: data
	})
}

// 退票订单列表(国内)
function orderRefundList(data) {
	return request({
		method:'POST',
		url:'/api/refund/list',
		data: data
	})
}

// 取消订单
function cancleInterRefund(data) {
	return request({
		method:'POST',
		url:'/api/cancle/orders',
		data: data
	})
}

export default{
  orderList,
  orderInterList,
  orderInterDetails,
  orderDetails,
  orderInterRefund,
  cancleInterRefund,
  refundSubmit,
  orderRefundList,
  getFilghtData

}
