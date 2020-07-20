<!--
 * @Description: 往返日期状态栏组件
 * @Author: wish.WuJunLong
 * @Date: 2020-07-20 16:57:25
 * @LastEditTime: 2020-07-20 17:09:20
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="roundTrip_header">
		<view class="time_box start_time">
			<view class="tiem">06月10日</view>
			<view class="week">周三</view>
		</view>
		<view class="time_line">
			4天
		</view>
		<view class="time_box end_time">
			<view class="tiem">06月14日</view>
			<view class="week">周日</view>
		</view>
		<view class="jump_time_btn"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
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
			background: url(../static/jump_time_btn.png) no-repeat center center;
			background-size: contain;
		}
	}
</style>
