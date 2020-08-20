/*
 * @Description: 获取保险列表
 * @Author: wish.WuJunLong
 * @Date: 2020-08-19 13:43:49
 * @LastEditTime: 2020-08-19 13:51:37
 * @LastEditors: wish.WuJunLong
 */
import request from '@/api/request';

// 国内订单列表
function insuranceList () {
	return request({
		method: "GET",
		url: '/api/insurance/list'
	})
};


export default{
  insuranceList
}