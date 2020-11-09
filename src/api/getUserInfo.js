/*
 * @Description: 获取用户信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-03 10:34:01
 * @LastEditTime: 2020-11-09 15:12:36
 * @LastEditors: Please set LastEditors
 */ 
import request from '@/api/request';

// 获取用户信息
function getUserInfo () {
	return request({
		method: "POST",
		url: '/api/me',
	})
}

// 获取钱包信息
function getWallet (data) {
	return request({
		method: "POST",
		url: '/api/wallet/get_msg',
		data: data
	})
}

// 修改用户密码
function editPassword(data){
	return request({
		method: "POST",
		url: '/api/user/editPwd',
		data: data
	})
}

// 钱包流水
function getWalletList (data) {
	return request({
		method: "POST",
		url: '/api/trans/list',
		data: data
	})
}

// 客服服务列表
function getServiceList () {

	return request({
		method: "GET",
		url: '/api/kf/list',
		
	})
}

// 订单支付方式 - 国内
function getOrderPay (data) {
	return request({
		method: "POST",
		url: '/api/order/details',
		data: data
	})
}
// 订单支付方式 - 国际
function getOrderInterPay (data) {
	return request({
		method: "POST",
		url: '/api/inter/orderDetail',
		data: data
	})
}


// 退出登录
function signOut(){
	return request({
		method: 'POST',
		url: '/api/logout'
	})
}

export default{
	getUserInfo,
	getWallet,
	editPassword,
	getWalletList,
	getServiceList,
	getOrderPay,
	getOrderInterPay,
	signOut
}