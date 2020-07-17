<script>
	// import Vue from 'vue'
	export default {
		onLaunch: function() {
		    // var that = this;
		    //     wx.getSystemInfo({
		    //       success(res) {
		    //         that.globalData.statusBarHeight = res.statusBarHeight;
		    //         console.log(res.statusBarHeight, 'statusBarHeight')
		    //       }
		    //     })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="less">
	/*每个页面公共css */
	.box-shadow-style{
		background:rgba(255,255,255,1);
		box-shadow: 0 12upx 18upx rgba(0,0,0,0.04);
		border-radius: 20upx;
		margin: 0 20upx;
		padding: 30upx 20upx;
		.title_text{
			font-size: 28upx;
			font-weight:bold;
			color:rgba(42,42,42,1);
			display: inline-flex;
			align-items: center;
			.title_icon{
				width: 30upx;
				height: 34upx;
				margin-right: 12upx;
			}
		}
		.title_required::after{
			content: '*';
			font-size: 28upx;
			font-weight:bold;
			color:rgba(255,0,0,1);
			margin-left: 6upx;
			position: relative;
			top: 4upx;
		}
	}
</style>
