/*
 * @Description: 获取保险列表
 * @Author: wish.WuJunLong
 * @Date: 2020-08-19 13:43:49
 * @LastEditTime: 2021-08-12 17:20:27
 * @LastEditors: mzr
 */
import request from '@/api/request';

// 国内订单列表
function insuranceList () {
	return request({
		method: "GET",
		url: '/api/insurance/list'
	})
};

// 火车票保险列表
function trainInsurance () {
	return request({
		method: "GET",
		url: '/api/train/insurances/list'
	})
};


export default{
  insuranceList,
	trainInsurance
}