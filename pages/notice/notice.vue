<template>
	<view class="notice">
		<model-notice></model-notice>
	</view>
</template>

<script>
	import modelNotice from '@/components/modal_notice.vue' // 公告版块
	export default {
		components: {
			modelNotice
		},
		data() {
			return {
				
			}; 
		},
		onLoad() {
			uni.setNavigationBarTitle({
			   title: '公告'
			});
		}
	}
</script>

<style lang="less">

</style>
