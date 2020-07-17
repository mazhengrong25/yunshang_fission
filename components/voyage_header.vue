<template>
	<view class="voyage_header" :style="{paddingTop: statusHeight + 'px',marginBottom: headerBottom + 'px'}">
		<view class="go_back" @click.native="goBack"></view>
		<view class="title">
			<view class="title_left">重庆</view>
			<view class="title_icon"></view>
			<view class="title_right">北京</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			statusHeight: {
				type: Number,
				default: () => 25
			},
			headerBottom: {
				type: Number,
				default: () => 0
			}
		},
		data() {
			return {
				iStatusBarHeight: 0, // 状态栏高度
			};
		},
		methods: {
			goBack(){
				uni.navigateBack({
				    delta: 1,
				    animationType: 'pop-out',
				    animationDuration: 200
				});
			},
		}
	}
</script>

<style scoped lang="less">
	.voyage_header{
		background:rgba(0,112,226,1);
		width: 100vw;
		height: 88upx;
		display: flex;
		align-items: center;
		padding-top: var(--status-bar-height);
		z-index: 999;
		
		.go_back{
			background: url(../static/go_back.png) no-repeat;
			background-size: contain;
			width: 50upx;
			height: 50upx;
			position: absolute;
			left: 20upx;
		}
		.title{
			font-size: 36upx;
			font-weight:bold;
			color:rgba(255,255,255,1);
			letter-spacing:10upx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			.title_icon{
				background: url(../static/ticket_header_path.png) no-repeat;
				background-size: contain;
				width: 35upx;
				height: 8upx;
				margin: 0 25upx;
			}
		}
	}
</style>
