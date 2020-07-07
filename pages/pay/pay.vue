<template>
	<view id="app">
		<view class="header">
			<view class="user">
				<image :src="user.headimgurl" mode=""></image>
				<view class="right">
					<view class="nickname">{{ user.nickname }}</view>
					<view class="icon_block" v-for="(item, index) in user.icon" :key="index">
						<image :src="item.image" mode=""></image>
					</view>
				</view>
			</view>
			<view class="message">
				<view>联系电话：{{ getMsg.phone }}</view>
				<view>商户名称：{{ getMsg.message }}</view>
				<view>商户地址：{{ getMsg.address }}</view>
			</view>
		</view>
		<view class="content">
            <!-- 优惠 -->
			<view class="cash_block">
				<view class="title">限时优惠</view>
				<view class="number">
					<view>地图批量标注</view>
					<view><text>￥</text>1299</view>
				</view>
			</view>
			<view class="coupon_block">
				<view>优惠券</view>
				<view><text>{{ -1000 }}</text>元</view>
			</view>
            <!-- 支付方式 -->
			<view class="payway_block">
				<view class="title">
					<view>支付方式</view>
				</view>
				<view class="pay_list">
                    <view class="item">
                        <view class="left">
						    <image src="/static/pay/wx.png" alt="" />
						    <view>微信支付</view>
					    </view>
                        <image src="/static/pay/pay_check.png" mode=""></image>
                    </view>
				</view>
			</view>
            <!-- 展示 -->
			<view class="show_block">
				<view class="item" v-for="(item, index) in showlist" :key="index">
					<image :src="item.image" alt="" />
					<view class="title">{{ item.title }}</view>
					<view class="text">{{ item.text }}</view>
					<view class="text">{{ item.msg }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: {},
				getMsg: {
					phone: 13023367769,
					message: "大庆书店",
					address: "哈尔滨北大街28号",
				},
				showlist: [
                    {
						image: "/static/pay/address.png",
						title: "地图标注",
						text: "亿万用户",
						msg: "海量曝光"
					},
					{
						image: "/static/pay/client.png",
						title: "获取客源",
						text: "一键搜索",
						msg: "提升知名度"
					},
					{
						image: "/static/pay/card.png",
						title: "名片解锁",
						text: "电子名片",
						msg: "带信息带地图,易传播"
					},
					{
						image: "/static/pay/data.png",
						title: "人脉市集",
						text: "广泛人脉",
						msg: "添加人脉不限量"
					},
					{
						image: "/static/pay/personal.png",
						title: "自主管理",
						text: "自主填写您的地点",
						msg: "方便用户查询"
					},
					{
						image: "/static/pay/prove.png",
						title: "权威认证",
						text: "权威认证",
						msg: "多年行业资深经验"
					}
				]
			};
		},
		onShow() {
			this.user = uni.getStorageSync("userMsg");
		},
		methods: {},
	};
</script>

<style lang="scss">
	#app {
		.header {
			color: #fff;
			padding: 30rpx 50rpx;
			background: linear-gradient(180deg, #518bf7, #5064f7);

			.user {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				>image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 30rpx;
				}

				.right {
					flex: 1;

					.icon_block {}
				}
			}

			.message {
				font-size: 28rpx;
				line-height: 50rpx;
				padding: 20rpx 40rpx;
				background: #518bf7;
				border-radius: 26rpx;
				border: 1px solid rgba(158, 183, 251, 0.1);
			}
		}

		.content {
			padding: 40rpx 40rpx;

			.cash_block {
				position: relative;
				padding: 80rpx 30rpx 40rpx;
				border-radius: 30rpx;
				border: 1px solid #E3CBB6;
				background: linear-gradient(-12deg, #F7EDD1, #FCF4DD);

				.title {
					position: absolute;
					top: 0;
					left: 0;
					color: #fff;
					font-size: 26rpx;
					padding: 12rpx 24rpx;
					border-radius: 30rpx 0 30rpx 0;
					background: linear-gradient(90deg, #FF5664, #FF3D2F);
				}

				.number {
					display: flex;
					align-items: baseline;
					justify-content: space-between;

					>:first-child {
						color: #603814;
						font-size: 32rpx;
						font-weight: bold;
					}

					>:last-child {
						color: #FF423A;
						font-size: 44rpx;

						text {
							font-size: 34rpx;
						}
					}
				}
			}

			.coupon_block {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;
				margin: 38rpx auto 48rpx;
				padding: 30rpx 20rpx;
				border: 1px solid #f5f5f5;
				border-radius: 22rpx;

				text {
					color: #FF423A;
					padding-right: 10rpx;
				}
			}

			.payway_block {

				.title {
					padding-bottom: 24rpx;
					border-bottom: 1px solid #f0f0f0;

					>view {
						font-size: 36rpx;
						line-height: 36rpx;
						padding-left: 16rpx;
						border-left: 8rpx solid #FF6A0C;
					}
				}

                .pay_list {

                    .item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20rpx 18rpx;

                        .left {
                            display: flex;
                            align-items: center;

                            >image {
                                width: 60rpx;
                                height: 60rpx;
                                border-radius: 50%;
                                margin-right: 20rpx;
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

            .show_block {
                display: flex;
                flex-wrap: wrap;
                background: #FEF9F3;

                .item {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: 33.3%;
                    padding: 30rpx 0;

                    >image {
                        width: 90rpx;
                        height: 90rpx;
                        border-radius: 50%;
                        margin-bottom: 10rpx;
                    }
                    
                    .title {
                        color: #BC7A50;
                        font-size: 30rpx;
                    }

                    .text {
                        color: #A09F9C;
                        font-size: 24rpx;
                    }
                }
            }
		}
	}
</style>
