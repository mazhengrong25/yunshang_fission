/*
 * @Description: 登录接口
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:37:12
 * @LastEditTime: 2020-07-23 15:58:02
 * @LastEditors: wish.WuJunLong
 */ 
import request from '@/api/request'; // 引入封装好的request

// 密码登录
function pwdLogin (data) {
	return request({
		method: "POST", // 请求方式
		url: '/api/login', // 请求url
		data: data // 参数
	})
}

export default{
	pwdLogin
}
