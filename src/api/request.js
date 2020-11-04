/*
 * @Description: 封装uniapp request
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 18:36:20
 * @LastEditTime: 2020-11-04 13:39:54
 * @LastEditors: Please set LastEditors
 */

const request = (config, type) => {
  let loginInfo = uni.getStorageSync('loginInfo');
  let currentTime = new Date().getTime();
  let loginTime = new Date(loginInfo.loginTime).getTime();
  if (!config.status) {
    uni.showLoading({
      title: '加载中',
      mask: true,
    });
  }

  // 处理 apiUrl
  let baseUrl;
  if (type === 'user') {
    // 调用用户信息地址
    baseUrl = 'http://192.168.0.187/user';
  } else {
    baseUrl = 'http://192.168.0.187';
  }
  config.url = baseUrl + config.url;

  if (uni.getStorageSync('loginInfo').token) {
    // 判断token 在header中加入token信息
    config['header'] = {
      Authorization: 'Bearer ' + uni.getStorageSync('loginInfo').token,
    };
  }
  if (!config.data) {
    config.data = {};
  }

  let promise = new Promise((resolve, reject) => {
    if (currentTime > loginTime) {
      uni.request({
        method: 'POST',
        url: 'https://fxxcx.ystrip.cn/api/login',
        data: {
          login_name: loginInfo.account,
          password: loginInfo.password,
        },
        success: (res) => {
          if (res.data.errorcode === 10000) {
            let loginInfo = {
              account: uni.getStorageSync('loginInfo').account,
              password: uni.getStorageSync('loginInfo').password,
              token: res.data.data.access_token,
              loginTime: new Date(new Date().getTime() + 3600 * 1000),
            };
            uni.setStorageSync('loginInfo', loginInfo);

            config['header'] = {
              Authorization: 'Bearer ' + uni.getStorageSync('loginInfo').token,
            };

            uni
              .request(config)
              .then((responses) => {
                uni.hideLoading();
                // 异常
                if (responses[0]) {
                  uni.showToast({
                    title: '网络超时',
                    icon: 'none',
                    duration: 3000
                  });
                } else {
                  let response = responses[1].data;
                  resolve(response);
                }
              })
              .catch((error) => {
                uni.hideLoading();
                uni.showToast({
                  title: error.data || '数据错误，请联系客服重试',
                  icon: 'none',
                  duration: 3000
                });
                reject(error);
              });
          }
        },
      });
    } else {
      uni
        .request(config)
        .then((responses) => {
          uni.hideLoading();
          // 异常
          if (responses[0]) {
            uni.showToast({
              title: '网络超时',
              icon: 'none',
              duration: 3000
            });
          } else {
            let response = responses[1].data;
            resolve(response);
          }
        })
        .catch((error) => {
          uni.showToast({
            title: error.data || '数据错误，请联系客服重试',
            icon: 'none',
            duration: 3000
          });
          uni.hideLoading();
          reject(error);
        });
    }
  });
  return promise;
};

export default request;
