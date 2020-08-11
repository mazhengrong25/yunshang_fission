/*
 * @Description: AV查询 获取航班信息
 * @Author: wish.WuJunLong
 * @Date: 2020-08-11 11:10:20
 * @LastEditTime: 2020-08-11 11:11:17
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

export default{
	getTicket
}