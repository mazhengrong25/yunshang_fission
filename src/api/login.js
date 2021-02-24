/*
 * @Description: 登录接口
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:37:12
 * @LastEditTime: 2021-02-24 17:38:52
 * @LastEditors: wish.WuJunLong
 */ 
import request from '@/api/request';


// 密码登录
function pwdLogin (data) {
	return request({
		method: "POST", // 请求方式
		url: '/api/login', // 请求url
		data: data // 参数
	})
};

// 扫码登录
function scanCodeLogin (data) {
	return request({
		method: "POST",
		url: "/api/access_token/login",
		data: data
	})
}

export default{
	pwdLogin,
	scanCodeLogin
}
