<!--
 * @Description: 往返日期状态栏组件
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 16:57:25
 * @LastEditTime: 2020-09-16 18:30:52
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="roundTrip_header" @click.stop="jumpDatePage('all')">
		<view class="time_box start_time" @click.stop="jumpDatePage('start')">
			<view class="tiem">{{timeData.toTime.month}}</view>
			<view class="week">{{timeData.toTime.week}}</view>
		</view>
		<view class="time_line">
			{{timeData.jetLag}}天
		</view>
		<view class="time_box end_time" @click.stop="jumpDatePage('end')">
			<view class="tiem">{{timeData.fromTime.month}}</view>
			<view class="week">{{timeData.fromTime.week}}</view>
		</view>
		<view class="jump_time_btn"></view>
	</view>
</template>

<script>
	export default {
		props: {
			timeData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			// 跳转日历
			jumpDatePage(type){
				this.timeData['type'] = type
				uni.navigateTo({
					 url: '/pages/dateSelect/dateSelect?roundDate='+ JSON.stringify(this.timeData)
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.roundTrip_header{
		border-radius: 52upx;
		background:rgba(30,139,249,.9);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70upx;
		position: relative;
		.time_box{
			display: inline-flex;
			align-items: flex-end;
			.tiem{
				font-size: 28upx;
				font-weight:bold;
				color:rgba(255,255,255,1);
				margin-right: 8upx;
			}
			.week{
				font-size: 22upx;
				font-weight:500;
				color:rgba(255,255,255,.8);
			}
		}
		.time_line{
			font-size:9px;
			font-weight:500;
			color:rgba(255,255,255,.6);
			display: inline-flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin: 0 36upx;
			&::after{
				content: '';
				display: block;
				border: 3upx dashed rgba(255,255,255,.6);
				width: 120upx;
				margin-top: 10upx;
			}
		}
		.jump_time_btn{
			width: 30upx;
			height: 30upx;
			position: absolute;
			right: 20upx;
			background: url(@/static/jump_time_btn.png) no-repeat center center;
			background-size: contain;
		}
	}
</style>
