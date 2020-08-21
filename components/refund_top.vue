<template>
	<view class="refund_top">
		<view class="top_message">退票信息</view>
		<view class="middle_message">
			<view class="message_first">是否自愿</view>
			<view class="message_bottom">
				<radio-group class="uni-list" @change="radioChange" >
					<label class="radio" v-for="(item,index) in radioItems" :key="index">
						<radio :color="'#0070E2'" :checked="item.checked"></radio>
						<text>{{item.value}}</text>
					</label>
				</radio-group>
			</view>
		</view>
		<view style="border-top: 2upx solid rgba(241, 243, 245, 1);"></view>
		<view class="middle_message">
			<view class="message_first">退票理由</view>
			<view class="message_bottom">
				<text>特殊订票退票，已提供相关证明，申请...</text>
			</view>
		</view>
	 </view> 
</template>

<script>
	export default {
		props: {
			dataList: {
				type: Array,
				default: () => []
			},
			dataList: {
				type: Boolean,
				default: () => false
			},
		},
		data() {
			return {
				/* 单选框*/
				radioItems: [{
							 
							  value: '是',
							  checked: 'true',
						  },
						  {
							  value: '否',
						  }
				],
				
			};
		},
		methods:{
			submit(){
				this.$emit('submitBtn', true)
			},
		},
	}
</script>

<style lang="less" scoped>
	
	.refund_top{
		border-radius: 20upx;
		background: rgba(255, 255, 255, 1);
		margin: 20upx 20upx 20upx;
		padding: 24upx 20upx 20upx;
		
		.top_message{
			display: flex;
			align-items: center;
			margin-bottom: 14upx;
			padding-top: 24upx;
			color: rgba(42, 42, 42, 1);
			font-size: 32upx;
			font-weight: Bold;
		}
		.middle_message {
			margin-top: 32upx;
			padding-top: 34upx;
			display: flex;
			align-items: center;
			.message_first{
				font-size: 28upx;
				color: rgba(153, 153, 153, 1);
				display: flex;
				justify-content: start;
				margin-right: 40upx;
			}
			.message_bottom{
				font-size: 28upx;
				font-weight: bold;
				color: rgba(42, 42, 42, 1)
			}
		}
			
	}

</style>
