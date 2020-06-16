<template>
	<view class="modal_notice">
		<view class="notice_header" v-if="modelType">
			<view class="title"><image class="title_icon" src="../static/notice.png"></image>最新公告</view>
			<view class="notice_more" @click="jumpNotice()">查看更多...</view>
		</view>
		
		
		<view class="notice_list">
			<view class="notice_box" v-for="(item, index) in noticeList" :key="index" @click="jumpNoticeDetails(item)">
				<view class="notice_content">
					<view class="notice_title">
						<text class="title">{{item.title}}</text>
						<view class="time">{{item.time}}</view>
					</view>
					<view class="notice_text">{{item.message}}</view>
				</view>
				<image class="notice_btn" src="../static/arrow.png" />
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			modelType: {
				type: Boolean,
				default: () => false
			}
		},
		data() {
			return {
				noticeList: [{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				},{
					title: '4月29日',  // 公告时间
					time: '周三',  // 公告星期
					message: '关于强调正确录入旅客电话号码通知' // 公告标题
				}]
			};
		},
		methods: {
			// 跳转更多公告页
			jumpNotice(){
				uni.navigateTo({
					url: '/pages/notice/notice',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			
			// 跳转详情页
			jumpNoticeDetails(val){
				uni.navigateTo({
					url: '/pages/notice/noticeDetails',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
		},
	}
</script>

<style scoped lang="less">
	.modal_notice{
		.notice_header{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 32upx 40upx 0;
			.title{
				font-size: 32upx;
				font-weight:bold;
				color:rgba(42,42,42,1);
				display: inline-flex;
				align-items: center;
				.title_icon{
					width: 32upx;
					height: 32upx;
					object-fit: contain;
					margin-right: 12upx;
				}
			}
			.notice_more{
				font-size: 24upx;
				font-weight:400;
				color:rgba(175,185,196,1);
			}
		}
		.notice_list{
			padding: 0 50upx;
			.notice_box{
				border-bottom: 1px solid #F1F3F5;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 14upx;
				margin-top: 50upx;
				.notice_content{
					
					.notice_title{
						display: flex;
						align-items: center;
						margin-bottom: 14upx;
						.title{
							font-size: 28upx;
							font-weight:bold;
							line-height: 38upx;
							color:rgba(42,42,42,1);
						}
						.time{
							padding: 4upx 8upx;
							background:rgba(175,185,196,1);
							opacity:0.61;
							font-size: 20upx;
							font-weight:400;
							color:rgba(255,255,255,1);
							margin-left: 16upx;
						}
					}
					
					.notice_text{
						font-size: 24upx;
						font-weight:400;
						color:rgba(102,102,102,1);
					}
				}
				
				.notice_btn{
					width: 12upx;
					height: 20upx;
					object-fit: contain;
				}
			}
		}
		
	}
</style>
