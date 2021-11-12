/*
 * @Description: 获取公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-09-21 10:50:27
 * @LastEditTime: 2021-11-12 11:12:12
 * @LastEditors: mzr
 */
import request from '@/api/request';


// 获取公告列表
function getNotice (data) {
	console.log(data)
	return request({
		method: "GET", // 请求方式
		// url: '/api/notice' + (data? '/' + data: ''), // 请求url
		url:'/api/notice?type='+data + "&channel=WXAPP",
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
}