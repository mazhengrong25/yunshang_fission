/*
 * @Description: 获取公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-09-21 10:50:27
 * @LastEditTime: 2020-09-21 13:44:33
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';


// 获取公告列表
function getNotice (data) {
	return request({
		method: "GET", // 请求方式
		url: '/api/notice' + (data? '/' + data: ''), // 请求url
	})
};

export default{
	getNotice
}