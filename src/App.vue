<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:53:03
 * @LastEditTime: 2020-09-21 17:45:54
 * @LastEditors: wish.WuJunLong
--> 
<script>
// import Vue from 'vue'
export default {
  onLaunch: function () {
    // var that = this;
    //     wx.getSystemInfo({
    //       success(res) {
    //         that.globalData.statusBarHeight = res.statusBarHeight;
    //         console.log(res.statusBarHeight, 'statusBarHeight')
    //       }
    //     })

    const updateManager = uni.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
    });

    updateManager.onUpdateReady(function (res) {
      uni.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });

    updateManager.onUpdateFailed(function (res) {
      // 新的版本下载失败
    });
  },
  onLoad() {
    uni.showShareMenu({
      title: "云上航空机票分销",
      path: "/pages/index/index",
    });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="less">
/*每个页面公共css */
</style>
