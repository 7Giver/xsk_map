<template>
	<view id="app">
		<image src="/static/activity/con01.jpg?v=7" mode="widthFix"></image>
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
			this.goShare()
			this.goShareCircle()
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
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `喜迎中秋 欢度国庆`,
					desc: `双节期间地图标注只需78 更有海量礼品等你来拿`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/2b/2b649970ee9be11aa0c00c343588c623.png`
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
					title: `喜迎中秋 欢度国庆`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/2b/2b649970ee9be11aa0c00c343588c623.png`
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
