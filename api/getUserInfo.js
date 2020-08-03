/*
 * @Description: 获取用户信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-03 10:34:01
 * @LastEditTime: 2020-08-03 18:06:27
 * @LastEditors: wish.WuJunLong
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
		url: '/wallet/get_msg',
		data: data
	},'user')
}

// 修改用户密码
function editPassword(data){
	return request({
		method: "POST",
		url: '/user/editPwd',
		data: data
	},'user')
}

// 钱包流水
function getWalletList (data) {
	return request({
		method: "POST",
		url: '/trans/list',
		data: data
	},'user')
}

export default{
	getUserInfo,
	getWallet,
	editPassword,
	getWalletList
}