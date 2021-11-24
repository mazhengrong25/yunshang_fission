/*
 * @Description: 获取公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-09-21 10:50:27
 * @LastEditTime: 2021-11-24 10:35:24
 * @LastEditors: mzr
 */
import request from '@/api/request';


// 获取公告列表
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
}