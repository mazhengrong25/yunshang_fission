<!--
 * @Description: 外部链接网页页面
 * @Author: wish.WuJunLong
 * @Date: 2020-09-09 15:50:49
 * @LastEditTime: 2020-09-09 16:05:42
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="web_view">
    <web-view class="view" :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: '',
      title: '',
      webviewStyles: {
        // 外部链接进度条样式
        progress: {
          color: "#FF3333",
        },
      },
    };
  },
  onLoad(data){
    this.url = data.url
    this.title = data.title
  }
};
</script>
<style lang="less" scoped>
.web_view{
  display: flex;
  flex-direction: column;
  .view{
    flex: 1;
    overflow-y: auto;
  }
}
</style>