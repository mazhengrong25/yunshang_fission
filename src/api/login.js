/*
 * @Description: 登录接口
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:37:12
 * @LastEditTime: 2020-08-03 10:38:46
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

export default{
	pwdLogin
}
