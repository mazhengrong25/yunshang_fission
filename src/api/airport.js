/*
 * @Description: 获取机场列表
 * @Author: wish.WuJunLong
 * @Date: 2020-08-07 14:06:13
 * @LastEditTime: 2020-08-07 14:20:20
 * @LastEditors: wish.WuJunLong
 */

import request from '@/api/request';

// 获取机场列表
function getAirport (data) {
	return request({
		method: "GET",
    url: '/api/getAirList',
    data: data
	})
}

export default{
	getAirport
}