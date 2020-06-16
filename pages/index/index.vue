<template>
	<view class="index">
		<view class="header">
			<model-swiper :swiperList="swiperList"></model-swiper>
			<view class="index_interval" style="margin-top: 50upx;"></view>
			<model-tabs></model-tabs>
		</view>

		<view class="notice">
			<model-notice :modelType="true"></model-notice>
		</view>

		<uni-popup ref="childPopup" type="bottom" class="child_dialog" @change="childPopupStatus">
			<view class="child_dialog_mian">
				<view class="title">
					<view class="close" @click="closeChildDialog">取消</view>
					<view class="submit" @click="submitChildDialog">确定</view>
				</view>
				<view class="dialog_main">
					<view class="child_main">
						<view class="number_name">成人</view>
						<view class="number_box">
							<view :class="['remove_number number_icon',{active: chilidForm.adultNumber > 0}]" @click="editTicketNumber('remove','adult')"></view>
							<view class="number">{{chilidForm.adultNumber}}</view>
							<view class="add_number number_icon" @click="editTicketNumber('add','adult')"></view>
						</view>
					</view>
					<view class="child_main">
						<view class="number_name">儿童<text class="number_name_message">（2-12岁）</text></view>
						<view class="number_box">
							<view :class="['remove_number number_icon',{active: chilidForm.childNumber > 0}]" @click="editTicketNumber('remove','child')"></view>
							<view class="number">{{chilidForm.childNumber}}</view>
							<view class="add_number number_icon" @click="editTicketNumber('add','child')"></view>
						</view>
					</view>
					<view class="child_main">
						<view class="number_name">婴儿<text class="number_name_message">（小于2岁）</text></view>
						<view class="number_box">
							<view :class="['remove_number number_icon',{active: chilidForm.babyNumber > 0}]" @click="editTicketNumber('remove','baby')"></view>
							<view class="number">{{chilidForm.babyNumber}}</view>
							<view class="add_number number_icon" @click="editTicketNumber('add','baby')"></view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
		
		

		
		
		
		
	</view>
</template>

<script>
	import modelSwiper from '@/components/model_swiper.vue' // 轮播图
	import modelTabs from '@/components/modal_tabs.vue' // 标签页
	import modelNotice from '@/components/modal_notice.vue' // 公告版块
	export default {
		components: {
			modelSwiper,
			modelTabs,
			modelNotice
		},
		data() {
			return {
				swiperList: [{ // 轮播图数据
						url: require('@/static/header_swiper.png')
					},
					{
						url: require('@/static/header_swiper.png')
					},
					{
						url: require('@/static/header_swiper.png')
					},
					{
						url: require('@/static/header_swiper.png')
					},
				],
				
				chilidForm: {
					adultNumber: 0,
					childNumber: 0,
					babyNumber: 0,
				},
				chilidFormBack: {}
			}
		},
		onLoad() {},
		methods: {
			// 乘机人数弹窗导航栏状态
			childPopupStatus(e){
				if(e.show){
					uni.hideTabBar({
						animation: true
					})
				}else{
					setTimeout(() =>{
						uni.showTabBar({
							animation: true
						})
					},300)
				}
			},
			// 关闭乘机人数弹窗
			closeChildDialog(){
				this.$refs.childPopup.close()
				this.chilidForm = this.chilidFormBack
			},
			// 修改乘机人数
			editTicketNumber(status,type){
				if(status === 'add'){
					this.chilidForm[type + 'Number'] = this.chilidForm[type + 'Number'] + 1
				}else{
					if(this.chilidForm[type + 'Number'] > 0){
						this.chilidForm[type + 'Number'] = this.chilidForm[type + 'Number'] - 1
					}
				}
			},
			// 提交乘机人数数据
			submitChildDialog(){
				uni.$emit('saveChild', this.chilidForm)
				this.closeChildDialog()
			},
			
			
		},
		mounted() {
			// 打开乘机人数选择弹窗
			uni.$on('openChild', (e) => {
				this.chilidForm = JSON.parse(JSON.stringify(e))
				this.chilidFormBack = JSON.parse(JSON.stringify(e))
				this.$refs.childPopup.open()
			})

		}
	}
</script>

<style scoped lang="less">
	.index {
		background: #F3F5F7;

		.header {
			padding: 20upx;
			background: #fff;
		}

		.notice {
			margin-top: 30upx;
			background: #fff;
		}
		
		
		
		
		.child_dialog{
			.child_dialog_mian{
				background: #fff;
				border-radius: 80upx 80upx 0 0;
				.title{
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 120upx;
					border-bottom: 2upx solid rgba(217,225,234,1);
					padding: 0 40upx;
					font-size: 28upx;
					font-weight:bold;
					.close{
						color:rgba(102,102,102,1);
					}
					.submit{
						color:rgba(0,112,226,1);
					}
				}
				.dialog_main{
					padding: 66upx 40upx;
					.child_main{
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-bottom: 30upx;
						border-bottom: 2upx solid rgba(241,243,245,1);
						&:not(:first-child){
							margin-top: 66upx;
						}
						.number_name{
							font-size: 30upx;
							font-weight:bold;
							color:rgba(51,51,51,1);
							.number_name_message{
								font-size: 30upx;
								font-weight:400;
								color:rgba(175,185,196,1);
							}
						}
						.number_box {
							display: inline-flex;
							align-items: center;
							
							.number{
								font-size: 28upx;
								font-weight:500;
								color:rgba(42,42,42,1);
								margin: 0 10upx;
								min-width: 40upx;
								text-align: center;
							}
						
							.number_icon {
								width: 36upx;
								height: 36upx;
						
								&.remove_number {
									background: url(../../static/number_remove_btn.png) no-repeat;
									background-size: contain;
									&.active{
										background: url(../../static/number_remove_btn_active.png) no-repeat;
										background-size: contain;
									}
								}
								&.add_number{
									background: url(../../static/number_add_btn.png);
									background-size: contain;
								}
							}
						}	
					}
				}
			}
		}
		
		
		
		
	}
</style>
