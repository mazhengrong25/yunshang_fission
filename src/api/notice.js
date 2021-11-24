/*
 * @Description: 获取公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-09-21 10:50:27
<<<<<<< HEAD
 * @LastEditTime: 2021-11-24 10:35:24
 * @LastEditors: mzr
=======
 * @LastEditTime: 2021-11-16 17:18:59
 * @LastEditors: wish.WuJunLong
>>>>>>> 641ca54ec3b2bb01599e681262004b5ae53f23b3
 */
import request from '@/api/request';


// 获取公告列表
<<<<<<< HEAD
function getNotice(data) {
	return request({
		method: "GET", // 请求方式
		url: '/api/notice' + (data ? '/' + data : ''), // 请求url
	})
};

// 获取退改签理由
function getReason(data) {
	return request({
		method: "POST", // 请求方式
		url: '/api/getreason',
		data: data
	})
};

export default {
	getNotice,
	getReason
=======
function getNotice (data) {
	console.log(data)
	return request({
		method: "GET", // 请求方式
		// url: '/api/notice' + (data? '/' + data: ''), // 请求url
		url:'/api/notice?type='+data + "&channel=WXAPP",
		status: true
		// params:data
	})
};

// 获取公告详情
function getNoticeDetails (data) {
	console.log(data)
	return request({
		method: "GET", // 请求方式
		url:'/api/notice/'+data,
	})
};

export default{
	getNotice,
	getNoticeDetails
>>>>>>> 641ca54ec3b2bb01599e681262004b5ae53f23b3
}