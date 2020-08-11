/*
 * @Description: 封装uniapp request
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:36:20
 * @LastEditTime: 2020-08-11 14:26:00
 * @LastEditors: wish.WuJunLong
 */

function getToken() {
  let loginInfo = uni.getStorageSync("loginInfo");
  if (loginInfo) {
    let currentTime = new Date();
    let loginTime = new Date(loginInfo.loginTime);
    if (new Date(currentTime).getTime() > new Date(loginTime).getTime()) {
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
              account: uni.getStorageSync("loginInfo").account,
              password: uni.getStorageSync("loginInfo").password,
              token: res.data.data.access_token,
              loginTime: new Date(new Date().getTime() + 3600 * 1000),
            };
            uni.setStorageSync("loginInfo", loginInfo);
          }
        },
      });
    }
  }
}

const request = (config, type) => {
  uni.showLoading({
    title: "加载中",
  });
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

  getToken();

  let promise = new Promise(function (resolve, reject) {
    uni
      .request(config)
      .then((responses) => {
        uni.hideLoading();
        // 异常
        if (responses[0]) {
          uni.showToast({
            title: "网络超时",
            icon: "none",
          });
        } else {
          let response = responses[1].data;
          resolve(response);
        }
      })
      .catch((error) => {
        uni.hideLoading();
        reject(error);
      });
  });
  return promise;
};

export default request;
