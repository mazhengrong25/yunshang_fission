<!--
 * @Description: 首页轮播图组件
 * @Author: wish.WuJunLong
 * @Date: 2020-06-15 13:57:57
 * @LastEditTime: 2021-11-11 11:35:38
 * @LastEditors: wish.WuJunLong
--> 
<template>
	<view class="model_swiper">
		<swiper autoplay circular class="model_swiper_box" @change="change">
			<swiper-item v-for="(item, index) in swiperList" :key="index" class="swiper_item">
				<img :src="(item.swiper_type?'':'https://fxxcx.ystrip.cn')+item.path" class="swiper_image" mode="aspectFit" :title="item.title" />
			</swiper-item>
		</swiper>

		<view class="swiper_dot">
			<view 
			:class="['swiper_dot_list',{'is_active': current === index}]"
			 v-for="(item, index) in swiperList"
			 :key="index"></view> 
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				current: 0
			};
		},
		methods: {
			change(e) {
				this.current = e.detail.current
			},
		},
		onShow(){
			console.log('swipt',this.swiperList)
		}
	}
</script>

<style scoped lang="less">
	.model_swiper {
		.model_swiper_box {
			height: 240upx;
			box-shadow:0 12upx 64upx rgba(0,0,0,0.1);

			.swiper_item {
				width: 100%;
				height: 100%;

				.swiper_image {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.swiper_dot {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20upx;

			.swiper_dot_list {
				width: 10upx;
				height: 10upx;
				background: rgba(102, 102, 102, .31);
				border-radius: 50%;
				&:not(:last-child){
					margin-right: 8upx;
				}
				&.is_active{
					width: 28upx;
					height: 10upx;
					background:rgba(0,112,226,1);
					border-radius:5px;
				}
			}
		}

	}
</style>
