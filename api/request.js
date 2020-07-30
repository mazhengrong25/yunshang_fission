/*
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:36:20
 * @LastEditTime: 2020-07-30 14:11:04
 * @LastEditors: wish.WuJunLong
 */ 
const request = (config) => {
	// 处理 apiUrl
	config.url = 'http://192.168.0.187:8092' + config.url;
	if(!config.data){
		config.data = {};
	}
	console.log(JSON.stringify(config.data));
	let promise = new Promise(function(resolve, reject) {
		uni.request(config).then(responses => {
			console.log(responses)
			// 异常
			if (responses[0]) {
				reject({message : "网络超时"});
			} else {
				let response = responses[1].data;
				resolve(response);
			}
		}).catch(error => {
			reject(error);
		})
	})
	return promise;
};

export default request;
