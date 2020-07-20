/**
 * @Description: 公告列表
 * @Date: 2020-07-20 16:22:16
 * @Author: wish.WuJunLong
 */
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
	}
</script>

<style scoped lang="less">

</style>
