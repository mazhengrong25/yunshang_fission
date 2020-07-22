<!--
 * @Description: 公告详情
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 17:53:13
 * @LastEditTime: 2020-07-22 11:48:57
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="notice_details">
		<view class="title">
			<text>关于系统升级通知</text>
		</view>
		<view class="content">
			<text>
				亲爱的各位合作伙伴：
				      为了更好的为大家提供便捷高效系统及服务，公司决定在2020年3月12日对系统进行升级更新，此次更新全面支持国际票在线查询预定支付，大家在更新后使用过程中遇到的问题，欢迎给我们反馈，我们会及时处理，感谢各位的大力支持！！
				
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
	}
</script>

<style scoped lang="less">
	.notice_details{
		padding: 70upx 40upx;
		.title{
			text-align: center;
			font-size: 30upx;
			font-weight:bold;
			color:rgba(51,51,51,1);
			letter-spacing:5upx;
			margin-bottom: 70upx;
		}
		.content{
			font-size: 28upx;
			font-weight:400;
			line-height:48upx;
			color:rgba(51,51,51,1);
		}
	}
</style>
