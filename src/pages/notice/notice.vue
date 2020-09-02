<!--
 * @Description: 公告列表
 * @Author: wish.WuJunLong
 * @Date: 2020-06-16 17:21:22
 * @LastEditTime: 2020-07-22 11:48:49
 * @LastEditors: wish.WuJunLong
--> 
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
