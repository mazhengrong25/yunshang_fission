<!--
 * @Description: 
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:53:03
 * @LastEditTime: 2022-04-18 10:18:30
 * @LastEditors: wish.WuJunLong
-->
<script>
export default {
  onLaunch: function() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },
  onLoad() {
    uni.showShareMenu({
      title: this.$$globalType + "机票分销",
      path: "/pages/index/index",
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
};
</script>

<style lang="less">
/*每个页面公共css */
</style>
