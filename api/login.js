import request from '@/api/request'; // 引入封装好的request

// 密码登录
function pwdLogin (data) {
	return request({
		method: "POST", // 请求方式
		url: 'login/pwd', // 请求url
		data: data // 参数
	})
}

// 手机登录
function phoneLogin (data) {
	return request({
		method: "POST", // 请求方式
		url: 'login/phone', // 请求url
		data: data // 参数
	})
}

export default{
	pwdLogin,
	phoneLogin
}
