/*
 * @Description: AV查询 获取航班信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-11 11:10:20
 * @LastEditTime: 2020-08-20 16:12:04
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


// 验价
function checkPrice(data){
	return request({
		method: "POST",
    url: '/api/checkPrice',
    data: data
	})
}


// 获取预定信息
function getTicketInfo(key,data){
	return request({
		method: "GET",
		url: '/api/inland/entry/'+key +'?price='+data,
	})
}

export default{
	getTicket,
	getNfd,
	checkPrice,
	getTicketInfo
}