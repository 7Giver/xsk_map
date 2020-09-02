<template>
	<view id="app" v-show="pageShow">
		<uni-nav-bar title="支付页" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<view class="banner">
			<image src="/static/train/border.png" mode="widthFix">
		</view>
		<view class="top_block">
			<image :src="guest.avatar" mode="widthFix">
			<view class="right">
				<view class="item">
					<view class="left">商户名称：
						<text>{{guest.company}}</text>
					</view>
				</view>
				<view class="item">
					<view class="left">联系电话：
						<text>{{guest.company_tel}}</text>
					</view>
				</view>
				<view class="item" v-if="guest.company_address">
					<view class="left">商户地址：
						<text>{{guest.company_address || '尚未完善'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">您选择的投放区域</view>
			<view class="area_block">
				<view class="item" v-for="(item, index) in guest.area" :key="index">
					<view class="main">
						<text v-if="index == 0">区域一</text>
						<text v-else-if="index == 1">区域二</text>
						<text v-else>区域三</text>
						<view>
							<text>{{item.province}}</text>
							<text>{{item.city}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="title">您选择的客源数量</view>
			<view class="tip_block">
				<view>{{guest.customer_num}}+</view>
			</view>
			<view class="title">您选择的投放时长</view>
			<view class="tip_block">
				<view>{{guest.market_type}}个月</view>
			</view>
			<view class="title">支付方式</view>
			<view class="pay_list">
				<view class="item" @click="checkPay(1)">
					<view class="left">
						<image src="/static/pay/wx.png" alt="" />
						<view>微信支付</view>
					</view>
					<image src="/static/pay/pay_check.png" mode="" v-if="payType==1"></image>
					<image src="/static/pay/pay_nocheck.png" mode="" v-else></image>
				</view>
				<view class="item" @click="checkPay(2)">
					<view class="left">
						<image src="/static/pay/alipay.png" alt="" />
						<view>支付宝支付</view>
					</view>
					<image src="/static/pay/pay_check.png" mode="" v-if="payType==2"></image>
					<image src="/static/pay/pay_nocheck.png" mode="" v-else></image>
				</view>
			</view>
		</view>
		<!-- 协议 -->
		<view class="agreement" @click="checkagree">
			<view class="checked">
				<image v-if="agreement" src="/static/pay/check.png" mode=""></image>
				<image v-else src="/static/pay/nocheck.png" mode=""></image>
			</view>
			<view>我已阅读并同意<text @click.stop="goTrainService">《直通车投放服务协议》</text></view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">实付:<text>￥{{guest.amount}}</text></view>
			<view class="right" @click="submit">立即支付</view>
		</view>
		<!-- 提示遮罩 -->
		<view class="mask_block" v-if="showMask">
			<image class="arrow" src="/static/pay/pic_2.png" mode="widthFix"></image>
			<image class="title" src="/static/pay/pic_1.png" mode="widthFix"></image>
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
				guest: {
					area: []
				}, //用户信息对象
				order_sn: '', // 订单号
				payType: 1, // 支付方式
				pageShow: false, // 页面显示
				showMask: false, // 提示遮罩
				agreement: true, // 同意协议
			};
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad(option) {
			this.order_sn = option.order_sn || ''
			if (option.order_sn) {
				let ua = navigator.userAgent.toLowerCase()
				this.getOrderDetail(option.order_sn)
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					// console.log('微信浏览器')
					this.pageShow = true
				}else{
					// console.log('普通浏览器')
					window.location.href = `${this.$testURL}?r=api/alipay/pay&order_sn=${this.order_sn}`  //支付宝
				}
			}
		},
		onHide() {
			this.showMask = false
		},
		methods: {
			// 获取订单详情
			getOrderDetail(order) {
				this.$test
					.post(`/?r=api/order/direct-info`, {
						order_sn: order
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.guest = response.data
						}
					})
			},
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement
			},
			// 返回上级页面
			back() {
				uni.redirectTo({
					url: '/pages/train/train'
				})
			},
			// 直通车协议
			goTrainService() {
				uni.navigateTo({
					url: '/pages/train/train_service?order_sn='+this.order_sn
				})
			},
			// 切换支付方式
			checkPay(type) {
				type == 1 ? this.payType = 1 : this.payType = 2
			},
			// 调用支付
			submit() {
				if (!this.agreement) {
					uni.showToast({
						title: '请同意服务协议',
						icon: 'none'
					});
					return false
				}
				if (this.order_sn) {
					this.payType == 1
						? window.location.href = `${this.$testURL}?r=api/order/go&order_sn=${this.order_sn}`  //微信支付
						: this.showMask = true //支付宝 显示遮罩
				} else {
					uni.showToast({
						title: '下单失败',
						icon: 'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 180rpx;

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
		padding: 26rpx 38rpx 60rpx;

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

						>text:first-child {
							margin-right: 20rpx;
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

		.pay_list {
			margin: 26rpx auto 0;
			border-top: 1px solid #F0F0F0;

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 16rpx 18rpx;
				
				&:not(:last-child) {
					border-bottom: 1px solid #F0F0F0;
				}

				.left {
					display: flex;
					align-items: center;

					>image {
						width: 60rpx;
						height: 60rpx;
						margin-right: 12rpx;
					}

					>view {
						font-size: 32rpx;
						padding-bottom: 8rpx;
					}
				}

				>image {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
				}
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

	.mask_block {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 998;
		background: rgba(0, 0, 0, .6);
		display: flex;
		align-items: flex-end;
		flex-direction: column;

		>image {
			display: block;
			
		}

		.arrow {
			width: 80rpx;
			margin-top: 26rpx;
			margin-right: 90rpx;
		}

		.title {
			width: 480rpx;
			margin-top: 10rpx;
			margin-right: 50rpx;
		}
	}
}
</style>
