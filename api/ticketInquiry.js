/*
 * @Description: AV查询 获取航班信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-11 11:10:20
 * @LastEditTime: 2020-08-12 09:27:37
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';

// 获取航班信息
function getTicket (data) {
	return request({
		method: "POST",
    url: '/api/inland/air',
    data: data
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

export default{
	getTicket,
	getNfd
}