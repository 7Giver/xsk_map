<template>
	<view id="app">
		<image src="/static/activity/zhi1.png" mode="widthFix"></image>
		<image src="/static/activity/zhi2.png" mode="widthFix"></image>
		<image src="/static/activity/zhi3.png" mode="widthFix"></image>
		<image src="/static/activity/zhi4.png" mode="widthFix"></image>
		<image src="/static/activity/zhi5.png" mode="widthFix"></image>
		<image src="/static/activity/zhi6.png" mode="widthFix"></image>
		<image src="/static/activity/zhi7.png" mode="widthFix"></image>
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
				switch (type) {
					case 'activity':
						uni.redirectTo({
							url: '/pages/train/train'
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
		bottom: 60rpx;
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
}
</style>
