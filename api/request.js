/*
 * @Description: 封装uniapp request
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:36:20
 * @LastEditTime: 2020-08-03 15:46:15
 * @LastEditors: wish.WuJunLong
 */

let loginInfo = uni.getStorageSync("loginInfo");
if (loginInfo) {
	let currentTime = new Date();
	let loginTime = new Date(loginInfo.loginTime);
	if (currentTime.getTime() > loginTime.getTime()) {
		uni.request({
			method: "POST",
			url: "http://192.168.0.187:8092/api/login",
			data: {
				login_name: loginInfo.account,
				password: loginInfo.password,
			},
			success: (res) => {
				if (res.data.errorcode === 10000) {
					let loginInfo = {
						'account': uni.getStorageSync("loginInfo").account,
						'password': uni.getStorageSync("loginInfo").password,
						'token': res.data.data.access_token,
						'loginTime': new Date(
							new Date().getTime() + res.data.data.expires_in * 1000
						),
					};
					uni.setStorageSync("loginInfo", loginInfo);
				}
			},
		});
	}
}

const request = (config, type) => {
  // 处理 apiUrl
  let baseUrl;
  if (type === "user") {
    // 调用用户信息地址
    baseUrl = "http://192.168.0.187:8088";
  } else {
    baseUrl = "http://192.168.0.187:8092";
  }
  config.url = baseUrl + config.url;
  if (uni.getStorageSync("loginInfo").token) {
    // 判断token 在header中加入token信息
    config["header"] = {
      Authorization: "Bearer " + uni.getStorageSync("loginInfo").token,
    };
  }
  if (!config.data) {
    config.data = {};
  }
  let promise = new Promise(function (resolve, reject) {
    uni
      .request(config)
      .then((responses) => {
        // 异常
        if (responses[0]) {
          reject({ message: "网络超时" });
        } else {
          let response = responses[1].data;
          resolve(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
  return promise;
};

export default request;
