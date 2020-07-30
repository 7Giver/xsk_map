<template>
	<view id="app">
		<view class="banner">
			<image src="/static/about/banner.png" mode="widthFix"></image>
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
					<view class="num"><text>3</text></view><text>联系我们</text>
				</view>
				<image src="/static/about/connect.png" mode="widthFix"></image>
				<view class="message" @click="goCall(tel)">客服热线：{{tel}}</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				tel: '4000-929-777'
			}
		},
		onTabItemTap() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
		},
		methods: {
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				});
			}
		}
	}
</script>
<style lang="scss">
	#app {
		padding-bottom: 160rpx;

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
					text-align: center;
					font-size: 32rpx;
				}
			}
		}
	}
</style>
