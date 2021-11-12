<!--
 * @Description: 公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 17:21:22
 * @LastEditTime: 2021-11-12 11:04:42
 * @LastEditors: mzr
--> 
<template>
  <view class="notice">
    <model-notice :noticeList="noticeList"></model-notice>
  </view>
</template>

<script>
import modelNotice from "@/components/modal_notice.vue"; // 公告版块

import noticeApi from "@/api/notice"; // 公告api
export default {
  components: {
    modelNotice,
  },
  data() {
    return {
			noticeList: [],
		};
  },
  methods: {
    // 获取公告列表
    getNoticeList(val) {
     
      noticeApi.getNotice(val === 0 ? "100":"101").then((res) => {
        if (res.errorcode === 10000) {
          this.noticeList = res.data.data;
          console.log("首页", this.noticeList);
        }
      });
    },
  },
  onLoad(data) {
    this.getNoticeList(data.switchNotice);
  },
};
</script>

<style scoped lang="less">
.notice{
  padding: 40upx 0;
}
</style>
