/*
 * @Description: 订单api
 * @Author: wish.WuJunLong
 * @Date: 2020-08-04 17:26:37
 * @LastEditTime: 2021-09-08 15:45:26
 * @LastEditors: mzr
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

// 改签 提交申请
function changeSubmit(data) {
	return request({
		method:'POST',
		url:'/api/change/order',
		data: data
	})
}

// 改签列表
function changeList(data) {
	return request({
		method:'POST',
		url:'/api/change/list',
		data: data
	})
}

// 获取多次改签
function mulChangeList(data) {
	return request({
		method:'POST',
		url:'/api/change/get_manychange',
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

// 发送短信
function sendMessage(data,url) {
	return request({
		method:'POST',
		url:'/api/admin_msg/sendMsg/'+url,
		data: data
	})
}

// 发送短信   选择模板
function sendMessageSelect(url) {
	return request({
		method:'get',
		url:'/api/admin_msg/sendMsg/'+url,
	})
}

////////////////////////////////////////火车票

// 火车票 订单列表
function trainOrderList(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/list',
    data: data
  })
};

// 火车票 订单详情
function trainOrderDetail(key) {
  return request({
    method: 'POST',
    url: '/api/train/order/detail/' +key,
  })
};

// 火车票  订单详情  取消订单
function trainOrderCancel(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/cancel',
		data:data
  })
};

// 火车票 退票列表
function trainRefundList(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/refund/list',
    data: data
  })
};

// 火车票 退票详情
function trainRefundDetail(key,data) {
  return request({
    method: 'POST',
    url: '/api/train/order/refund/detail/' +key,
    data: data
  })
};

// 火车票 订单退票
function trainOrderRefund(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/refund',
    data: data
  })
};

// 火车票 订单改签
function trainOrderChange(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/change/reserve',
    data: data
  })
};

// 火车票 改签列表
function trainChangeList(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/change/list',
    data: data
  })
};

// 火车票 改签详情
function trainChangeDetail(key) {
  return request({
    method: 'POST',
    url: '/api/train/order/change/detail/' +key,
  })
};

// 火车票 改签详情  取消订单
function trainChangeCancel(data) {
  return request({
    method: 'POST',
    url: '/api/train/order/change/cancel',
		data:data
  })
};
export default{
  orderList,
  orderInterList,
  orderInterDetails,
  orderDetails,
  orderInterRefund,
  cancleInterRefund,
  refundSubmit,
  orderRefundList,
  getFilghtData,
  sendMessage,
  sendMessageSelect,
  changeSubmit,
  changeList,
  mulChangeList,
	trainOrderList,
	trainOrderDetail,
	trainOrderCancel,
	trainRefundList,
	trainChangeList,
	trainRefundDetail,
	trainOrderRefund,
	trainChangeDetail,
	trainChangeCancel,
	trainOrderChange
}
