<template>
	<view id="app">
		<image src="/static/activity/zhi1.jpg" mode="widthFix"></image>
		<view class="has_btn" @click.stop="goNext('activity')">参与活动 免费领礼</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow() {
			this.goShare()
			this.goShareCircle()
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
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `中秋国庆放狠价`,
					desc: `双节期间地图标注只需78 更有海量礼品等你来拿`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/58/580a19df160423578b741b96af3f450c.png`
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					this.$jwx.initJssdk(res => {
						let shareData = {
							title: obj.title, // 分享标题
							desc: obj.desc, // 分享描述
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareAppMessage(shareData, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 调用微信分享朋友圈
			goShareCircle() {
				let obj = {
					title: `中秋国庆放狠价`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/58/580a19df160423578b741b96af3f450c.png`
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					let shareData = {
						title: obj.title, // 分享标题
						shareUrl: obj.shareUrl, // 分享链接
						imgUrl: obj.imgUrl, // 分享图标
					}
					this.$jwx.onMenuShareTimeline(shareData, function(response) {
						// console.log('response', response)
					})
				}
				// #endif
			},
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
		bottom: 70rpx;
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
