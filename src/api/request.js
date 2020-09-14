/*
 * @Description: 封装uniapp request
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:36:20
 * @LastEditTime: 2020-09-14 10:11:23
 * @LastEditors: wish.WuJunLong
 */


async function getToken() {
  let loginInfo = uni.getStorageSync("loginInfo");
  await uni.request({
    method: "POST",
    url: "https://fxxcx.ystrip.cn/api/login",
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

const request = async (config, type) => {
  let loginInfo = uni.getStorageSync("loginInfo");
  let currentTime = new Date().getTime();
  let loginTime = new Date(loginInfo.loginTime).getTime();
  if (currentTime > loginTime) {
    console.log("时间", currentTime, loginTime, currentTime > loginTime);
    await getToken();
  }
  if(!config.status){
    uni.showLoading({
      title: "加载中",
      mask: true,
    });
  }
  
  // 处理 apiUrl
  let baseUrl;
  if (type === "user") {
    // 调用用户信息地址
    baseUrl = "https://fxxcx.ystrip.cn/user";
  } else {
    baseUrl = "https://fxxcx.ystrip.cn";
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

  let promise = await new Promise((resolve, reject) => {
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
  return await promise;
};

export default request;
