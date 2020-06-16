<template>
	<view class="modal_tabs">
		<view class="swiper-tab">
			<view v-for="(item, index) in tabsList" :key="index" :class="['swiper-tab-item',{'active': currentTab === index}]"
			 @click="clickTab(index)">
				{{item}}
			</view>
		</view>

		<swiper class="tabs_main" :current="currentTab" duration="300" :style="{'height':swiperHeight+'px'}" @change="swiperTab">
			<swiper-item v-for="(item, index) in tabsList" :key="index">
				<view class="tabs_center">
					<ticket-input :ticketType="item"></ticket-input>
				</view>
			</swiper-item>
		</swiper>

		<!-- <view class="tabs_main" v-for="(item, index) in tabsList" :key="index">
			<view class="tabs_center" v-if="currentTab === index">
				<ticket-input :ticketType="item"></ticket-input>
			</view>
		</view> -->

	</view>
</template>

<script>
	import ticketInput from '@/components/ticket_input.vue'
	export default {
		components: {
			ticketInput
		},
		data() {
			return {
				currentTab: 1,
				tabsList: ['国内', '国际', '多程'],
				swiperHeight: 0,
			};
		},
		methods: {
			//滑动切换
			swiperTab(e) {
				this.currentTab = e.detail.current
				this.setSwiperHeight()
			},

			//点击切换
			clickTab(index) {
				if (this.currentTab === index) {
					return false;
				} else {
					this.currentTab = index
				}
			},
			
			// 获取当前swiper-item高度
			setSwiperHeight() {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(".tabs_center").boundingClientRect();
				query.exec((res) => {
					this.swiperHeight = res[0][this.currentTab].height;
				})
			}

		},
		created() {
			this.setSwiperHeight()
		},
	}
</script>

<style scoped lang="less">
	.modal_tabs {
		.swiper-tab {
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 68upx;

			.swiper-tab-item {
				width: 160upx;
				height: 50upx;
				border: 2upx solid rgba(0, 112, 226, 1);
				opacity: 0.51;
				border-radius: 20px;
				color: #434343;
				font-size: 28upx;
				font-weight: 400;
				color: rgba(0, 112, 226, 1);
				display: inline-flex;
				align-items: center;
				justify-content: center;

				&:not(:last-child) {
					margin-right: 50upx;
				}

				&.active {
					background: rgba(0, 112, 226, 1);
					border: 2upx solid rgba(0, 112, 226, 1);
					color: #fff;
					opacity: 1;
				}
			}
		}

		swiper {
			height: 328upx
		}

		.tabs_main {

			// min-height: 75upx;
			// height: 328upx !important;
			.tabs_center {
				padding: 0 30upx;

			}
		}


	}
</style>
