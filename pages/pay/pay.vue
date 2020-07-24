<template>
	<view id="app">
		<view class="header">
			<view class="user">
				<image :src="user.headimgurl" mode=""></image>
				<view class="right">
					<view class="nickname">{{ user.nickname }}</view>
					<view class="icon_block">
						<view class="item" v-for="(item, index) in user.icon" :key="index">
							<image :src="item.image" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="message">
				<view>联系电话：{{ getMsg.tel }}</view>
				<view>商户名称：{{ getMsg.company_name }}</view>
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
			<!-- 赠品 -->
			<view class="gift_block" @click="_showItem">
				<view class="left">赠品</view>
				<view class="right">
					<view class="item">
						<image src="/static/pay/p_card.png" mode="widthFix"></image>
						<view class="text">
							<view>电子名片</view>
							<view>（点击预览）</view>
						</view>
					</view>
					<view class="and"></view>
					<view class="item">
						<image src="/static/pay/c_card.png" mode="widthFix"></image>
						<view class="text">
							<view>潜在客源</view>
							<view>（点击预览）</view>
						</view>
					</view>
				</view>
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
			<!-- 协议 -->
			<view class="agreement" @click="checkagree">
				<view class="checked">
					<image v-if="agreement" src="/static/pay/check.png" mode=""></image>
					<image v-else src="/static/pay/nocheck.png" mode=""></image>
				</view>
				<view>我已阅读并同意《地图标注支付服务协议》</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">
				<view>实付:<text>￥299</text></view>
				<view>当前名额仅剩 6 名</view>
			</view>
			<view class="right" @click="submit">立即支付</view>
		</view>
		<!-- 展示弹窗 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="container">
				<view class="show_box">
					<swiper class="show_swiper" indicator-dots="false" circular="true" indicator-active-color="#6E7FD2" :current="current">
						<swiper-item class="item" v-for="(item, index) in showItems" :key="index">
							<image :src="item.cover" mode=""></image>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	import Json from '@/Json';
	export default {
		components: {
			UniPopup
		},
		data() {
			return {
				user: {},
				getMsg: {},
				current: 0, // 轮播index
				showDailog: false, // 展示弹窗
				agreement: true, // 同意协议
				checkItems: [],  // 选中地图
				showItems: [],  // 展示数据
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
						msg: "带信息地图易传播"
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
			this.getMsg = uni.getStorageSync("postMsg");
			this.checkItems = Json.checkItems;
			this.getMap()
			console.log('user', this.user)
			console.log('getMsg', this.getMsg)
		},
		methods: {
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement;
			},
			// 获取选中地图
			getMap() {
				let str = uni.getStorageSync('mapStr')  // '1,3,4'
				let arr = str.split(',')
				let newArr = []
				arr.forEach(item => {
					let result = Json.checkItems.filter(val => {
						return val.id == item
					})
					newArr.push(result)
				});
				this.user.icon = newArr.flat(2)
			},
			// 监听展示弹窗状态
			change(e) {
				if (!e.show) {
					this.showDailog = false;
					this.current = 0;
					this.showItems = []
				}
			},
			// 展示效果图事件
			_showItem() {
				this.$http
					.post(`/api/getPoster`, {
						type: 1
					})
					.then(response => {
						if (response.code === 200) {
							// console.log(response)
							this.showItems = response.data
							this.showDailog = true
						}
					});
			},
			// 点击支付
			submit() {
				if (!this.agreement) {
					uni.showToast({
						title: '请阅读服务协议',
						icon: 'none'
					});
					return false
				}
				// 4.0下单
				this.creatMapOrder()
				// 3.0下单
				// this.postMapUserInfo()
			},
			// 提交用户信息
			postMapUserInfo() {
				let str = uni.getStorageSync('mapStr')
				this.$http
					.post(`/api/saveMapMember`, {
						wxid: this.user.wxid,
						name: this.user.nickname,
						tel: this.getMsg.tel,
						company_name: this.getMsg.company_name,
						address: this.getMsg.address
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.showToast({
								title: '提交成功',
								icon: 'none'
							});
							var query = {
								mid: response.data,
								money: 299,
								map: str,
								nickname: this.user.nickname,
								openid: this.user.openid,
								address: this.getMsg.address
							}
							this.creatMapOrder(query)
							this.user = {}
							this.getMsg = {}
						}
					});
			},
			// 创建订单
			creatMapOrder(query) {
				this.$http
					.post(`/api/createMapOrder`, query)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							var a = response.data.jsApiParameters
							var b = response.data.order_sn
							this.goPay(a, b)
						}
					});
			},
			//跳转支付
			goPay(a, b) {
				window.location.href = `${this.$baseURL}/api/go?jsApiParameters=${a}&order_sn=${b}`
			},
			// 地图标注下单
			creatMapOrder() {
				let str = uni.getStorageSync('mapStr')
				let obj = {
					wxid: this.user.wxid,
					name: this.getMsg.company_name,
					tel: this.getMsg.tel,
					map: str,
					address: this.getMsg.address
				}
				this.$test
					.post(`/?r=api/order/map-submit`, obj)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							window.location.href = `${this.$testURL}?r=api/order/go&order_sn=${response.data.order_sn}`
						}
					});
			}
		},
	};
</script>

<style lang="scss">
	#app {
		padding-bottom: 120rpx;

		.header {
			color: #fff;
			padding: 30rpx 50rpx;
			background: linear-gradient(180deg, #518bf7, #5064f7);

			.user {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				>image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					margin-right: 22rpx;
				}

				.right {
					flex: 1;

					.nickname {
						font-size: 36rpx;
					}

					.icon_block {
						display: flex;
						margin-top: 10rpx;

						.item {
							margin-right: 10rpx;

							image {
								display: block;
								width: 50rpx;
								height: 50rpx;
							}
						}
					}
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
			padding: 40rpx 40rpx 30rpx;

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
				margin: 36rpx auto;
				padding: 30rpx 20rpx;
				border: 1px solid #f5f5f5;
				border-radius: 22rpx;

				text {
					color: #FF423A;
					padding-right: 10rpx;
				}
			}

			.gift_block {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 40rpx;
				padding: 30rpx 20rpx;
				border-radius: 22rpx;
				border: 1px solid #f5f5f5;

				.left {
					flex: 1;
					font-size: 34rpx;
				}

				.right {
					flex: 4;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.item {
						display: flex;
						align-items: center;

						>image {
							width: 60rpx;
						}

						.text {
							font-size: 24rpx;
							line-height: 30rpx;
							text-align: center;

							>:last-child {
								color: #249BFA;
							}
						}
					}

					.and {
						width: 20px;
						height: 20px;
						margin-right: 24rpx;
						position: relative;

						&::before,
						&::after {
							content: "";
							position: absolute;
							height: 26rpx;
							width: 1px;
							top: 2px;
							left: 50%;
							background: #8D8D8F;
						}

						&::after {
							transform: rotate(90deg);
						}
					}
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

			.agreement {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 40rpx;

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
				}
			}
		}

		.bottom {
			position: fixed;
			bottom: 0;
			display: flex;
			width: 100%;
			text-align: center;
			line-height: 120rpx;
			background: #fff;
			border-top: 1px solid #F0F0F0;

			.left {
				flex: 2;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 30rpx 0 40rpx;

				>:first-child {
					font-size: 32rpx;

					text {
						color: #FF423A;
						padding-left: 8rpx;
					}
				}

				>:last-child {
					color: #FF423A;
					font-size: 25rpx;
				}
			}

			.right {
				flex: 1;
				color: #fff;
				font-size: 32rpx;
				background: linear-gradient(90deg,#FF5664,#FF3D2F);
			}
		}

		// 展示弹窗
		
		.container {
			height: 1040rpx;
			border-radius: 20rpx;
			// background: #D6ECFF;
			position: relative;

			.show_box {
				height: 100%;
				position: relative;

				.show_swiper {
					width: 100%;
					height: 100%;
					padding-top: 40rpx;

					.item {
						padding: 0rpx 42rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 26rpx;
						}
					}

				}
			}
		}
	}
</style>
