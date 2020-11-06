<!--
 * @Description: 公告详情
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 17:53:13
 * @LastEditTime: 2020-09-21 17:31:35
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="notice_details">
		<view class="title">
			<text>{{noticeDetail.title}}</text>
		</view>
		<view class="info">
			<text>{{noticeDetail.author}}</text>
			<text>{{noticeDetail.created_at}}</text>
		</view>
		<view class="content">
			<rich-text :nodes="noticeContent"></rich-text>
		</view>
	</view>
</template>

<script>
import noticeApi from "@/api/notice"; // 公告api
	export default {
		data() {
			return {
				noticeDetail: {},
				noticeContent: ''
			};
		},
		methods: {
			// 获取公告详情
			getNoticeDetails(id){
				noticeApi.getNotice(id).then((res) => {
        if (res.errorcode === 10000) {
					let content = res.data.content
					this.noticeContent = content.indexOf('scr="http') >= 0 ? content:content.replace(/src[^=]*?=[^"]*?"/,'src="https://fxxcx.ystrip.cn')
					this.noticeDetail = res.data;
        }
      }); 
			},
		},
		onLoad(data){
			this.getNoticeDetails(data.data)
		}
	}
</script>

<style scoped lang="less">
	.notice_details{
		padding: 40upx 40upx 70upx;
		.title{
			text-align: center;
			font-size: 30upx;
			font-weight:bold;
			color:rgba(51,51,51,1);
			letter-spacing:5upx;
			margin-bottom: 30upx;
		}
		.info{
			font-size: 24upx;
			color:rgba(51,51,51,.7);
			margin-bottom: 40upx;
			text{
				margin-right: 40upx;
			}
		}
		.content{
			font-size: 28upx;
			font-weight:400;
			line-height:48upx;
			color:rgba(51,51,51,1);
		}
	}
</style>
