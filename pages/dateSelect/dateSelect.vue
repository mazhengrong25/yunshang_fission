<!--
 * @Description: 日期选择页面
 * @Author: wish.WuJunLong
 * @Date: 2020-08-10 17:46:05
 * @LastEditTime: 2020-08-10 18:33:38
 * @LastEditors: wish.WuJunLong
-->
<template>
  <view class="date_select">
    <yun-header :statusHeight="iStatusBarHeight" centerTitle="选择日期"></yun-header>
    <view class="date_header">
      <view class="hader_list" v-for="item in weekCn" :key="item">{{item}}</view>
    </view>



		<scroll-view :enable-back-to-top="true" :scroll-y="true" class="date_main">
			<view class="date_list">
				<view class="list_title">2020年8月</view>

				<view class="list_item">
					<view class="item_box"></view>


				</view>
			</view>
		</scroll-view>
  </view>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
			iStatusBarHeight: 0,
			weekCn: ['日', '一', '二', '三', '四', '五', '六'], // 中国周列表
			currentDateTitle: '',  // 当前年月
			dateList: [],
			nextIndex: 1,  // 获取下多少个月的时间
    };
	},
	methods: {
		// 日期列表处理
		getDateList(){
			let currentDate = moment().format('YYYY年MM月')  // 当前月份
			let nextDate = moment().add(this.nextIndex, 'M').format('YYYY年MM月');  // 下一月份
			 
			let currentDateNumber = moment().daysInMonth()  // 当前月份天数
			let nextDateNumber = moment().add(this.nextIndex, 'M').daysInMonth()  // 下一月份天数

			let currentLastDateWeek = moment().format('d')  // 当月1号星期
			let nextLastDateWeek = moment().add(this.nextIndex, 'M').format('d')  // 下月1号星期
			console.log(currentDate,currentDateNumber,currentLastDateWeek,'-',nextDate,nextDateNumber,nextLastDateWeek)

			let currentList = []
			let nextList = []
			for(let i= 0; i < currentDateNumber; i++){
				currentList.push({
					day: i + 1,
					type: i === 0? currentLastDateWeek: '',
					active: (i + 1) === Number(moment().format('D')) ,
				})
			}
			console.log(currentList)
		},
	},
  onLoad() {
		this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		this.getDateList()
  },
};
</script>

<style lang="less" scoped>
.date_select {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .date_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70upx;
		background: rgba(244, 249, 255, 1);
		padding: 0 22upx;
    .hader_list {
      width: 82upx;
      text-align: center;
      font-size: 22upx;
      font-weight: 500;
			color: rgba(42, 42, 42, 1);
			&:first-child,
			&:last-child{
				color: #0070E2;
			}
    }
	}
	.date_main{
		flex: 1;
		overflow-y: auto;
	}
}
</style>