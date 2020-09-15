<template>
	<view class="refund_middle">
		<view class="top_message">出行信息</view>
		<view class="select_right">
			<Checkbox
				:indeterminate="indeterminate"
				:value="checkAll"
				:color="'#0070E2'"
				@click.prevent.native="handleCheckAll">全选</Checkbox>
		</view> 
			<CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange" :color="'#0070E2'">
			       <Checkbox label="香蕉"></Checkbox>
			       <Checkbox label="苹果"></Checkbox>
			       <Checkbox label="西瓜"></Checkbox>
			</CheckboxGroup>	
		<!-- 分割线 -->
	    <view style="border-top: 2upx solid rgba(241, 243, 245, 1);"></view>
		<view class="middle_message">
			<view class="message_first">联系人</view>
			<view class="message_bottom">
				<text>马冬梅</text>
			</view>
			<view class="message_first">联系电话</view>
			<view class="message_bottom">
				<text>17600129126</text>
			</view>
			<view class="message_first">已购保险</view>
			<view class="message_bottom">
				<text>众安航意险20元(保额80万）</text>
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
				
				indeterminate: false,
				checkAll: false,
				checkAllGroup: ['香蕉', '西瓜']
				
			};
		},
		  methods: {
				handleCheckAll () {
					if (this.indeterminate) {
						this.checkAll = false;
					} else {
						this.checkAll = !this.checkAll;
					}
					this.indeterminate = false;

					if (this.checkAll) {
						this.checkAllGroup = ['香蕉', '苹果', '西瓜'];
					} else {
						this.checkAllGroup = [];
					}
				},
				checkAllGroupChange (data) {
					if (data.length === 3) {
						this.indeterminate = false;
						this.checkAll = true;
					} else if (data.length > 0) {
						this.indeterminate = true;
						this.checkAll = false;
					} else {
						this.indeterminate = false;
						this.checkAll = false;
					}
				}
			}
	}
</script>

<style lang="less" scoped>
	
	.refund_middle{
		border-radius: 20upx;
		background: rgba(255, 255, 255, 1);
		margin: 20upx 20upx 20upx;
		padding: 24upx 20upx 20upx;
		.top_message{
			display: flex;
			align-items: center;
			justify-content: start;
			margin-bottom: 14upx;
			padding-top: 24upx;
			color: rgba(42, 42, 42, 1);
			font-size: 32upx;
			font-weight: Bold;
			margin-right: 400upx;
		}
		.select_right{
			padding:50upx 50upx;
		}
		.middle_message {
			margin-top: 32upx;
			padding-top: 34upx;
			display: flex;
			align-items: start;
			justify-content: center;
			.message_first{
				font-size: 28upx;
				color: rgba(153, 153, 153, 1);
				display: flex;
				justify-content: center;
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
