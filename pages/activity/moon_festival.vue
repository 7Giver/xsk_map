<template>
	<view id="app">
		<image src="/static/activity/con01.png" mode="widthFix"></image>
		<image src="/static/activity/con02.png" mode="widthFix"></image>
		<image class="turnUp" src="/static/activity/con03.png" mode="widthFix"></image>
		<image src="/static/activity/con04.png" mode="widthFix"></image>
		<image src="/static/activity/con05.png" mode="widthFix"></image>
		<view class="has_btn" @click.stop="goNext('activity')">立即标注 免费领礼</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow() {

		},
		methods: {
			// 跳转页面
			goNext(type) {
				let value = uni.getStorageSync('userMsg')
				if (!value.hasOwnProperty('wxid')) {
					this.$getAuthorize()
					return false
				}
				switch (type) {
					case 'activity':
						uni.switchTab({
							url: '/pages/home/home',
							success: e => {
								uni.setStorageSync('openPost', true);
							}
						})
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
#app {
	image {
		display: block;
		width: 100%;
	}

	.has_btn {
		position: fixed;
		left: 50%;
		bottom: 30rpx;
		transform: translate(-50%,-50%);
		width: 80%;
		color: #FEEACF;
		font-weight: bold;
		text-align: center;
		font-size: 38rpx;
		line-height: 90rpx;
		letter-spacing: 1rpx;
		border-radius: 130rpx;
		background: linear-gradient(90deg, #DB2848, #E24B36);
	}

	.turnUp {
		margin-top: -2rpx;
	}
}
</style>
