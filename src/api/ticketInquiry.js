/*
 * @Description: AV查询 获取航班信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-11 11:10:20
 * @LastEditTime: 2020-09-02 17:50:49
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';

// 获取航班信息
function getTicket (data,status) {
	return request({
		method: "POST",
    url: '/api/inland/air',
		data: data,
		status: status
	})
}


// 获取票价舱位信息
function getNfd (data) {
	return request({
		method: "POST",
    url: '/api/getNfd',
    data: data
	})
}


// 验价
function checkPrice(data){
	return request({
		method: "POST",
    url: '/api/checkPrice',
    data: data
	})
}


// 单程预定
function getTicketInfo(key,data){
	return request({
		method: "GET",
		url: '/api/inland/entry/'+key +'?price='+data,
	})
}


// 往返预定
function getRoundTicketInfo(key,roundKey,data){
	return request({
		method: "GET",
		url: '/api/inland/roundentry/'+key +'/'+roundKey,
		data: data
	})
}

// 单程下单
function createOrder(data){
	return request({
		method: "POST",
		url: '/api/insert/order',
		data: data
	})
}

// 往返下单
function createRoundOrder(data){
	return request({
		method: "POST",
		url: '/api/insert/orders',
		data: data
	})
}

// 获取支付信息
function getPayInfo(data){
	return request({
		method: "GET",
		url: '/api/pay/' + data,
	})
}

// 支付
function payOrder(id,data){
	return request({
		method: "POST",
		url: '/api/pay/' + id,
		data: data
	})
}

export default{
	getTicket,
	getNfd,
	checkPrice,
	getTicketInfo,
	getRoundTicketInfo,
	createOrder,
	createRoundOrder,
	getPayInfo,
	payOrder
}