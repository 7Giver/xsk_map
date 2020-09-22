<template>
	<view id="app">
		<view class="banner">
			<image src="/static/about/banner.png?v=7" mode="widthFix"></image>
		</view>
		<view class="content">
			<view class="bg_box">
				<view class="title">
					<view class="num"><text>1</text></view><text>搜搜地图</text>
				</view>
				<view class="message">
					搜搜集团旗下，搜搜地图标注中心，八年地图标注经验，与高德、百度、腾讯等主流公司建立长期战略合作关系，已为30多万客户，实现5000多万人次客源引流，地图标注业务连续六年实现行业第一，<text>好评率99.8%</text>
				</view>
			</view>
			<view class="bg_box1">
				<view class="title">
					<view class="num"><text>2</text></view><text>选择我们 6大优势</text>
				</view>
				<view class="text_box">
					<view class="text_item">
						<view class="tip">01</view>
						<text>累计服务超过10,000个优质商家/公司</text>
					</view>
					<view class="text_item">
						<view class="tip">02</view>
						<text>体系成熟、发展快速</text>
					</view>
					<view class="text_item">
						<view class="tip">03</view>
						<text>市场细分和专业的营销队伍</text>
					</view>
					<view class="text_item">
						<view class="tip">04</view>
						<text>成熟的经营管理体系，为客户带来更优质的服务</text>
					</view>
					<view class="text_item">
						<view class="tip">05</view>
						<text>7年行业资深技术研发团队</text>
					</view>
					<view class="text_item">
						<view class="tip">06</view>
						<text>价格低、速度快、定位精准、公平、公正、公开</text>
					</view>
				</view>
			</view>
			<view class="connect_us">
				<view class="title">
					<view class="num"><text>3</text></view><text>公司荣誉</text>
				</view>
				<view class="swiper_block">
					<swiper class="swiper" :autoplay="true" :interval="5000">
                        <swiper-item v-for="(item, index) in honourList" :key="index" @click="fullImg(index)">
                            <image :src="item" mode="widthFix"></image>
                        </swiper-item>
                    </swiper>
				</view>
			</view>
			<view class="connect_us">
				<view class="title">
					<view class="num"><text>4</text></view><text>联系我们</text>
				</view>
				<image src="/static/about/connect.png" mode="widthFix"></image>
				<view class="message" @click="goCall(tel)">客服热线：{{tel}}</view>
				<view class="message">公司地址：{{address}}</view>
				<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
			</view>
		</view>
		<view class="load_order" @click="getOrder" v-if="hasOrder">
			<view>待支付</view>
			<view>{{count}}</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				order_sn: '', //待支付单号
				count: '', // 倒计时
				timer: null, // 定时器
				hasOrder: false, //延迟订单显示
				tel: '4000-929-777',
				address: '江西省上饶市广丰区上广公路南侧鑫城大厦6-7楼',
				id: 0, // 使用 marker点击事件 需要填写id
				latitude: 28.425898718581525,
				longitude: 118.14973451786041,
				covers: [{
					title: '搜搜科技集团',
					latitude: 28.425898718581525,
					longitude: 118.14973451786041,
				}],
				honourList: [
					`${this.$dataURL}/image/8e/qyry1.png`,
					`${this.$dataURL}/image/8e/qyry2.png`,
					`${this.$dataURL}/image/8e/qyry3.png`,
					`${this.$dataURL}/image/8e/qyry4.png`,
					`${this.$dataURL}/image/8e/qyry5.png`,
					`${this.$dataURL}/image/8e/qyry6.png`,
					`${this.$dataURL}/image/8e/yqry7.png`,
					`${this.$dataURL}/image/8e/qyer8.png`,
					`${this.$dataURL}/image/8e/qyry9.png`,
					`${this.$dataURL}/image/8e/qyry10.png`,
				],
			}
		},
		onTabItemTap() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
		},
		onShow() {
			this.getloadingOrder()
			this.goShare()
			this.goShareCircle()
		},
		methods: {
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				});
			},
			// 全屏展示图片
			fullImg(index) {
				uni.previewImage({
					urls: this.honourList,
					current: index
				})
			},
			// 获取进行中订单
			getloadingOrder() {
				let value = uni.getStorageSync('wxid');
				if (value) {
					this.$http
						.post(`/?r=api/index/index`, {
							wxid: value
						})
						.then(response => {
							// console.log(response)
							if (response.code === 200) {
								if (response.data.order_sn) {
									let endtime = response.data.end_time
									this.order_sn = response.data.order_sn
									if (endtime) {
										this.timer = setInterval(() => {
											this.hasOrder = true
											this.countDown(endtime)
										}, 1000)
									}
								}
							}
						})
				}
			},
			// 调用微信自定义分享
			goShare() {
				let url = location.origin + '/#' + location.href.split('#')[1].split('?')[0]
				let obj = {
					title: `关于我们`,
					desc: `5000多万人次客源引流 连续六年行业第一`,
					shareUrl: url,
					imgUrl: `${this.$dataURL}/image/b6/b64d67cc23b73b2555ddb792822d8391.png`
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
				let url = location.origin + '/#' + location.href.split('#')[1].split('?')[0]
				let obj = {
					title: `关于我们`,
					shareUrl: url,
					imgUrl: `${this.$dataURL}/image/b6/b64d67cc23b73b2555ddb792822d8391.png`
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					this.$jwx.initJssdk(res => {
						let shareData = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareTimeline(shareData, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 计算倒计时
			countDown(endtime) {
				// var endtime = parseInt(new Date('2020/07/31,11:46').getTime()/1000)
				var nowtime = parseInt(new Date().getTime()/1000);
				var lefttime = parseInt(endtime - nowtime);
				var d = parseInt(lefttime / (24*60*60))
				var h = parseInt(lefttime / (60 * 60) % 24);
				var m = parseInt(lefttime / 60 % 60);
				var s = parseInt(lefttime % 60);
				d = addZero(d)
				h = addZero(h);
				m = addZero(m);
				s = addZero(s);
				this.count = `${m}:${s}`;
				this.hasOrder = true
				if (lefttime <= 0) {
					this.hasOrder = false
					clearInterval(this.timer)
					// console.log('clear!')
				}
				//小于10补0
				function addZero(i) {
					return i < 10 ? "0" + i: i + "";
				}
			},
			// 获取进行中订单信息并下单
			getOrder() {
				if (this.order_sn) {
					uni.navigateTo({
						url: '/pages/pay/pay?order_sn='+this.order_sn
					})
				} else {
					uni.showToast({
						title: '下单失败',
						icon: 'none'
					})
				}
			},
		}
	}
</script>
<style lang="scss">
	#app {
		padding-bottom: 120rpx;

		.banner {
			background: #fff;

			&::after {
				content: '';
				display: block;
				position: absolute;
				width: 0;
				height: 0;
				border-right: 20rpx solid transparent;
				border-left: 20rpx solid transparent;
				border-top: 20rpx solid #222841;
				margin-left: 54rpx;
			}

			>image {
				width: 100%;
				vertical-align: middle;
			}
		}

		.content {
			// padding: 50rpx 46rpx 30rpx;
			// background: #fff;

			.bg_box {
				padding: 50rpx 50rpx 0;
				background: url('/static/about/bg.png');
				background-repeat: no-repeat;
				background-size: 80%;
				background-position: -12% 68%;
			}

			.bg_box1 {
				padding: 50rpx 50rpx 0;
				background: url('/static/about/bg.png');
				background-repeat: no-repeat;
				background-size: 80%;
				background-position: -12% 203%;
			}

			.title {
				display: flex;
				align-items: center;
				width: 100%;
				height: 70rpx;
				color: #5B68AC;
				margin-bottom: 30rpx;
				position: relative;

				// &::after {
				// 	content: '';
				// 	display: block;
				// 	position: absolute;
				// 	top: 0;
				// 	left: 0;
				// 	width: 400rpx;
				// 	height: 400rpx;
				// 	background-color: transparent;
				// 	background: url('/static/about/bg.png');
				// 	background-repeat: no-repeat;
				// 	background-size: cover;
				// 	background-position: center;
				// 	z-index: 1;
				// }

				.num {
					width: 60rpx;
					height: 60rpx;
					font-size: 38rpx;
					line-height: 60rpx;
					text-align: center;
					margin-right: 30rpx;
					border: 1px solid #5B68AC;
					border-radius: 14rpx;
					transform: rotate(45deg);

					>text {
						display: block;
						transform: rotate(-45deg);
					}
				}

				>text {
					letter-spacing: 1.5px;
				}
			}

			.message {
				font-size: 30rpx;
				line-height: 48rpx;

				>text {
					color: #FC645F;
				}
			}

			.text_box {

				.text_item {
					display: flex;
					align-items: flex-start;
					position: relative;

					&:not(:last-child) {
						margin-bottom: 50rpx;
					}

					.tip {
						display: flex;
						align-items: center;
						color: #5B68AC;
						font-size: 34rpx;

						&::after {
							content: '';
							display: block;
							width: 12rpx;
							height: 12rpx;
							margin: 0 20rpx;
							background-color: #FC645F;
							transform: rotate(45deg);
						}
					}

					&:not(:last-child)::before {
						content: '';
						position: absolute;
						bottom: -52rpx;
						display: block;
						width: 45rpx;
						height: 45rpx;
						margin: 10rpx 20rpx;
						border-left: 1px solid #5B68AC;
						opacity: 0.3;
					}

					&:nth-child(4)::before {
						content: '';
						height: 96rpx;
					}

					>text {
						color: #333537;
						font-size: 30rpx;
						line-height: 50rpx;
						font-family: PingFangSC-Regular;
					}

				}
			}

			.connect_us {
				padding: 60rpx 50rpx 0;

				>image {
					display: flex;
					justify-content: center;
					width: 60%;
					margin: 0 auto;
				}
				
				.message {
					color: #999;
					font-size: 32rpx;
				}

				.swiper_block {
					height: 500rpx;

					.swiper {
						width: 100%;
						height: 100%;

						image {
							display: block;
							width: 100%;
						}
					}
				}

				uni-map {
					margin-top: 55rpx;
				}
			}
		}

		// 进行中订单浮窗
		.load_order {
			position: fixed;
			right: 30rpx;
			bottom: 280rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			overflow: hidden;
			background: url('/static/index/clock.png') no-repeat center / 100% 100%;

			>view {
				color: #FF4435;
				font-size: 26rpx;
				font-weight: bold;
			}
		}
	}
</style>
