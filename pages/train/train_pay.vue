<template>
	<view id="app">
		<uni-nav-bar title="支付页" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<view class="banner">
			<image src="/static/train/border.png" mode="widthFix">
		</view>
		<view class="top_block">
			<image :src="userInfo.avatar" mode="widthFix">
			<view class="right">
				<view class="item">
					<view class="left">商户名称：
						<text>{{userInfo.company}}</text>
					</view>
				</view>
				<view class="item">
					<view class="left">联系电话：
						<text>{{userInfo.mobile}}</text>
					</view>
				</view>
				<view class="item">
					<view class="left">商户地址：
						<text>{{userInfo.address}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">您选择的投放区域</view>
			<view class="area_block">
				<view class="item" v-for="(item, index) in result.putInList" :key="index">
					<view class="main">
						<text v-if="index == 0">区域一</text>
						<text v-else-if="index == 1">区域二</text>
						<text v-else>区域三</text>
						<view>{{item.address}}</view>
					</view>
				</view>
			</view>
			<view class="title">您选择的客源数量</view>
			<view class="tip_block">
				<view>{{result.client}}+</view>
			</view>
			<view class="title">您选择的投放时长</view>
			<view class="tip_block">
				<view>{{result.time}}个月</view>
			</view>
		</view>
		<!-- 协议 -->
		<view class="agreement" @click="checkagree">
			<view class="checked">
				<image v-if="agreement" src="/static/pay/check.png" mode=""></image>
				<image v-else src="/static/pay/nocheck.png" mode=""></image>
			</view>
			<view>我已阅读并同意<text>《直通车投放服务协议》</text></view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">实付:<text>￥{{total_cash}}</text></view>
			<view class="right" @click="submit">立即支付</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				agreement: true, // 同意协议
				total_cash: 1699, // 总价
				result: {
					putInList: [
						{address: '江苏 无锡'},
						{address: '江苏 苏州'},
						{address: '江苏 南京'},
					],
					client: 100,
					time: 3
				}
			};
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad() {

		},
		methods: {
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement
			},
			// 返回我的页面
			back() {
				uni.redirectTo({
					url: '/pages/train/train'
				})
			},
			// 调用支付
			submit() {

			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 150rpx;

	.banner {
		width: 100%;
		overflow: hidden;

		image {
			display: block;
			width: 100%;
		}
	}

	.top_block {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;

		>image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 12rpx;
		}
		
		.right {
			flex: 1;
			padding-left: 30rpx;

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				line-height: 64rpx;

				.left {
					flex: 1;
					display: flex;
					white-space: nowrap;
					font-weight: bold;

					>text {
						color: #9CA1B4;
						font-weight: normal;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						word-break: break-all;
						overflow: hidden;
						white-space: normal;
					}
				}

				&:last-child {
					.left {
						>text {
							line-height: 40rpx;
							margin-top: 12rpx;
						}
					}
				}
			}
		}
	}

	.block {
		height: 20rpx;
		background: #F5F5F5;
	}

	.content {
		padding: 26rpx 38rpx;

		.title {
			display: flex;
			align-items: center;
			color: #403C3F;
			font-size: 34rpx;

			>text {
				color: #999999;
				font-size: 30rpx;
				padding-left: 10rpx;
			}

			&::before {
				content: "";
				display: block;
				width: 8rpx;
				height: 32rpx;
				margin-right: 18rpx;
				background: #4B7EF6;
			}
		}

		.area_block {

			.item {
				margin: 26rpx auto;

				.main {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border: 1px solid #F0F0F0;
					font-size: 28rpx;
					padding: 16rpx 20rpx;
					border-radius: 10rpx;

					>view {
						display: flex;
						align-items: center;
						color: #4B7EF6;

						>image {
							display: block;
							width: 22rpx;
							margin-left: 20rpx;
						}
					}
				}
			}
		}

		.tip_block {
			display: flex;
			align-items: center;
			padding: 40rpx 0;

			>view {
				color: #fff;
				width: 150rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 50rpx;
				border-radius: 8rpx;
				background: #4B7EF6;
			}
		}
	}

	.agreement {
		display: flex;
		align-items: center;
		justify-content: center;

		.checked {
			padding-right: 10rpx;

			image {
				display: block;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
			}
		}

		>view {
			color: #333;
			font-size: 24rpx;

			>text {
				color: #4B7EF6;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		line-height: 120rpx;
		background: #fff;
		border-top: 1px solid #F0F0F0;

		.left {
			flex: 2;
			font-size: 32rpx;
			padding-left: 40rpx;
			
			>text {
				color: #FF423A;
			}
		}

		.right {
			flex: 1;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			background: linear-gradient(90deg, #FF5664, #FF3D2F);
		}
	}
}
</style>
