<template>
	<view id="app">
		<view class="header">
			<view class="card">
				<view class="avatar">
					<image src="/static/sousou/user.png" mode="">
				</view>
				<view class="content">
					<view class="nickname">江苏海底捞火锅店</view>
					<view class="title">正是这些平凡的人生，却构成了伟大的历史.前面的路还很远,但是一定要走下去...</view>
					<view class="message">
						<view class="item">
							<view class="left">商户名<text>江苏海底捞火锅店</text></view>
							<view class="right">复制</view>
						</view>
						<view class="item">
							<view class="left">手机号<text>18701891906</text></view>
							<view class="right">拨打</view>
						</view>
						<view class="item">
							<view class="left">微信号<text>Hello huio1906</text></view>
							<view class="right">复制</view>
						</view>
						<view class="item">
							<view class="left">地址<a>无锡市梁溪区广益路208号崇安 电子商务园区9号808室</a></view>
							<view class="right">
								<image src="/static/mine/card/address.png" mode="widthFix">
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="show_block">
			<view class="title">
				<image src="/static/mine/card/title.png" mode="widthFix">
				<text>已获得地图标注</text>
			</view>
			<view class="map_block">
				<view class="item" v-for="(item, index) in 5" :key="index">
					<image src="/static/index/gaode.png" mode="widthFix">
					<view class="right">高德地图</view>
				</view>
			</view>
			<view class="title">
				<image src="/static/mine/card/title.png" mode="widthFix">
				<text>商户风采</text>
			</view>
			<view class="banner">
				<image src="/static/mine/card/banner.png" mode="widthFix">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 40rpx;
	background: linear-gradient(70deg, #50637C, #303641);

	.header {
		padding: 230rpx 0 38rpx;
		background: url('/static/mine/card/background.png') no-repeat top / 100%;

		.card {
			width: 90%;
			margin: 0 auto;

			.avatar {
				display: flex;
				justify-content: center;
				margin-bottom: -80rpx;
				
				>image {
					display: block;
					width: 160rpx;
					height:160rpx;
					border: 18rpx solid #fff;
					border-radius: 50%;
				}
			}

			.content {
				background: #fff;
				padding: 90rpx 34rpx 30rpx;
				border-radius: 20rpx;

				.nickname {
					font-size: 34rpx;
					text-align: center;
					margin-bottom: 16rpx;
				}

				.title {
					position: relative;
					color: #999;
					font-size: 26rpx;
					text-indent: 40rpx;
					margin-bottom: 30rpx;
					
					&::before {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						width: 30rpx;
						height: 30rpx;
						background: url('/static/mine/card/pencil.png') no-repeat center / 100% 100%;
					}
				}

				.message {
					background: #FAFAFA;

					.item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 16rpx 26rpx;

						.left {
							font-size: 30rpx;

							>text {
								color: #9CA1B4;
								font-size: 28rpx;
								margin-left: 20rpx;
							}

							>a {
								color: #557FEE;
								font-size: 26rpx;
								margin-left: 20rpx;
								text-decoration: underline;
							}
						}

						.right {
							color: #5169F7;
							font-size: 28rpx;
							padding: 6rpx 20rpx;
							background: #E3E8FC;
							border-radius: 10rpx;

							>image {
								display: block;
								width: 40rpx;
							}
						}

						&:last-child {
							.left {
								letter-spacing: 30rpx;

								a {
									margin-left: -10rpx;
									letter-spacing: 0px;
								}
							}

							.right {
								padding: 0;
								margin: 0 36rpx;
								background: transparent;

								image {
									width: 28rpx;
									// padding: 20rpx;
								}
							}
						}
					}
				}
			}
		}
	}

	.show_block {
		width: 90%;
		margin: 0 auto;
		padding: 30rpx 34rpx;
		background: #fff;
		border-radius: 20rpx;

		.title {
			position: relative;
			padding: 20rpx 0;

			>image {
				width: 320rpx;
			}

			>text {
				position: absolute;
				left: 1.6rem;
				top: 24rpx;
				font-size: 38rpx;
			}
		}

		.map_block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 20rpx;
			padding-bottom: 30rpx;

			.item {
				font-size: 28rpx;
				text-align: center;

				>image {
					width: 70rpx;
					margin-bottom: 10rpx;
				}
			}
		}

		.banner {
			width: 100%;
			padding-top: 20rpx;

			>image {
				display: block;
				width: 100%;
			}
		}
	}
}
</style>
