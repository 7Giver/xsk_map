<template>
	<view id="app" v-show="pageShow">
		<uni-nav-bar title="支付页" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<view class="header">
			<view class="user">
				<image :src="userInfo.avatar" mode=""></image>
				<view class="right">
					<view class="nickname">{{ userInfo.nick_name }}</view>
					<view class="icon_block">
						<view class="item" v-for="(item, index) in map" :key="index">
							<image :src="item.image" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="message">
				<view>联系电话：{{ getMsg.tel }}</view>
				<view>商户名称：{{ getMsg.company || '尚未完善' }}</view>
				<view>商户地址：{{ getMsg.address || '尚未完善' }}</view>
			</view>
		</view>
		<view class="content">
      <!-- 优惠 -->
			<view class="cash_block">
				<view class="title">限时抢购</view>
				<view class="number">
					<view class="left">地图批量标注<text>（套餐钜惠）</text></view>
					<view class="right">
						<view class="payment"><text>￥</text>{{payment}}</view>
						<view class="orgin_cost"><text>￥</text>{{origin_cost}}</view>
					</view> 
				</view>
			</view>
			<view class="mytips"><text>*</text>可联系客服标注单个地图价值88元哦~</view>
			<view class="coupon_block">
				<view>优惠券</view>
				<view><text>{{-coupon}}</text>元</view>
			</view>
			<!-- 赠品 -->
			<view class="gift_block">
				<view class="left">赠品</view>
				<view class="right">
					<view class="item" @click="_showItem(0)">
						<image src="/static/pay/p_card.png" mode="widthFix"></image>
						<view class="text">
							<view>电子名片</view>
							<view>（点击预览）</view>
						</view>
					</view>
					<view class="and"></view>
					<view class="item" @click="_showItem(1)">
						<image src="/static/pay/ring.png" mode="widthFix" style="width: 40rpx"></image>
						<view class="text">
							<view>企业彩铃</view>
							<view>（点击预览）</view>
						</view>
					</view>
					<view class="and"></view>
					<view class="item" @click="_showItem(2)">
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
				<view>我已阅读并同意<text @click.stop="goPayService">《地图标注服务协议》</text></view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">
				<view>实付:<text>￥{{payment}}</text></view>
				<view>当前名额仅剩 6 名</view>
			</view>
			<view class="right" @click="submit">立即支付</view>
		</view>
		<!-- 展示弹窗 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="container">
				<swiper class="show_swiper" :current="current">
					<swiper-item class="item" v-for="(item, index) in showItems" :key="index">
						<image :src="item.cover" mode="widthFix"></image>
					</swiper-item>
				</swiper>
			</view>
		</uni-popup>
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
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	import Json from '@/Json';
	export default {
		components: {
			uniNavBar,
			UniPopup
		},
		data() {
			return {
				getMsg: {},
				map: [], // 选择地图
				order_sn: '', // 支付订单号
				current: 0, // 轮播index
				origin_cost: 0, //原价
				coupon: 0, //优惠价
				payment: 0, //支付价格
				payType: 1, // 支付方式
				pageShow: false, // 页面显示
				showMask: false, // 提示遮罩
				showDailog: false, // 展示弹窗
				agreement: true, // 同意协议
				checkItems: [],  // 选中地图
				showItems: [
					{cover: '/static/pay/mycard.png'},
					{cover: '/static/pay/ring_show.png'},
					{cover: '/static/pay/people.png'},
				],  // 展示数据
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
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad(option) {
			this.checkItems = Json.checkItems;
			this.order_sn = option.order_sn
			if (option.order_sn) {
				let ua = navigator.userAgent.toLowerCase()
				this.getOrderDetail()
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					// console.log('微信浏览器')
					this.pageShow = true
				} else {
					// console.log('普通浏览器')
					window.location.href = `${this.$baseURL}?r=api/alipay/pay&order_sn=${this.order_sn}`  //支付宝
				}
			}
		},
		onHide() {
			this.showMask = false
		},
		methods: {
			doNothing() {
				console.log('111')
			},
			// 返回我的页面
			back() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement;
			},
			// 直通车协议
			goPayService() {
				uni.navigateTo({
					url: '/pages/pay/pay_service?order_sn='+this.order_sn
				})
			},
			// 获取选中地图
			getMap() {
				let str = this.getMsg.map  // '1,3,4'
				let arr = str.split(',')
				let newArr = []
				arr.forEach(item => {
					let result = Json.checkItems.filter(val => {
						return val.id == item
					})
					newArr.push(result)
				});
				this.map = newArr.flat(2)
			},
			// 监听展示弹窗状态
			change(e) {
				if (!e.show) {
					this.showDailog = false;
					this.current = 0;
					// this.showItems = []
				}
			},
			// 切换支付方式
			checkPay(type) {
				type == 1 ? this.payType = 1 : this.payType = 2
			},
			// 展示效果图事件
			_showItem(index) {
				// this.$http
				// 	.post(`/api/getPoster`, {
				// 		type: 1
				// 	})
				// 	.then(response => {
				// 		if (response.code === 200) {
				// 			// console.log(response)
				// 			this.showItems = response.data
				// 			this.showDailog = true
				// 		}
				// 	});

				this.showDailog = true
				this.current = index
			},
			// 根据单号获取详情
			getOrderDetail() {
				this.$http
					.post(`/?r=api/order/map-detail`, {
						order_sn: this.order_sn
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.getMsg = response.data
							this.origin_cost = response.data.origin_price
							this.coupon = response.data.sub_price
							this.payment = response.data.price
							this.getMap()
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
				if (this.order_sn) {
					this.payType == 1
						? window.location.href = `${this.$baseURL}?r=api/order/go&order_sn=${this.order_sn}`  //微信支付
						: this.showMask = true //支付宝 显示遮罩
				} else {
					uni.showToast({
						title: '下单失败',
						icon: 'none'
					})
				}
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
				padding: 65rpx 30rpx 30rpx;
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
					align-items: center;
					justify-content: space-between;

					.left {
						color: #603814;
						font-size: 32rpx;
						font-weight: bold;
						>text {
							color: #FF9029;
							font-size: 29rpx;
						}
					}

					.right {
						.payment {
							color: #FF423A;
							font-size: 42rpx;
							text {
								font-size: 30rpx;
							}
						}
						.orgin_cost {
							color: #C5BDA5;
							font-size: 30rpx;
							text-align: right;
    					text-decoration: line-through;
							text {
								font-size: 24rpx;
							}
						}
					}
				}
			}

			.mytips {
				color: #603814;
				font-size: 28rpx;
				text-align: right;
				margin-top: 16rpx;
				text {
					color: #FF3F33;
				}
			}

			.coupon_block {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32rpx;
				margin: 24rpx auto 36rpx;
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
					display: flex;
					align-items: center;
					justify-content: space-between;

					.item {
						display: flex;
						align-items: center;
						flex-direction: column;

						>image {
							display: block;
							width: 50rpx;
							margin-bottom: 10rpx;
						}

						.text {
							font-size: 24rpx;
							line-height: 30rpx;
							text-align: center;
							white-space: nowrap;

							>:last-child {
								color: #249BFA;
							}
						}
					}

					.and {
						width: 20px;
						height: 20px;
						margin-right: 10rpx;
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

            .show_block {
                display: flex;
				flex-wrap: wrap;
				margin-top: 10rpx;
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

					>text {
						color: #4B7EF6;
					}
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
						font-size: 38rpx;
						font-weight: bold;
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
		::v-deep.uni-popup__wrapper.center {
			height: 94%;
		}
		
		.container {
			height: 1066rpx;
			border-radius: 20rpx;
			position: relative;

			.show_swiper {
				width: 100%;
				height: 100%;
				border-radius: 26rpx;
				overflow: hidden;

				.item {
					overflow: scroll;

					image {
						display: block;
						width: 100%;
					}
				}

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
