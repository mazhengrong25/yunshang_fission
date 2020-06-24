<template>
	<view class="flight_reservation">
		<flight-header :flightInfo="true" :flightData="flightData"></flight-header>
	</view>
</template>

<script>
	import flightHeader from '@/components/flight_header.vue'
	export default {
		components: {
			flightHeader
		},
		data() {
			return {
				flightData: { // 航班头部信息
					flightType: '单程', // 航程类型
					time: '2020-4-18 周六', // 航程日期
					fromTime: '08:00', // 出发时间
					fromAddress: '重庆江北机场T3', // 出发机场
					duration: '2h30m', // 飞行时长
					toTime: '10:32', // 到达时间
					toAddress: '北京首都机场T3', // 到达机场
					airline: '南航', // 航司
					model: '空客A320(中)', // 机型
					food: '有早餐', // 餐饮
				},
			};
		}
	}
</script>

<style scoped lang="less">
	.flight_reservation{
		padding-top: 20upx;
		background:rgba(243,245,247,1);
		height: 100vh;
		overflow-y: auto;
	}
</style>
