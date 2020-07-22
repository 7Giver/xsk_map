<template>
	<view id="app">
		<view class="header">
			<view class="card">
				<view class="avatar">
					<image :src="userInfo.avatar" mode="">
				</view>
				<view class="content">
					<view class="nickname">{{userInfo.nick_name}}</view>
					<view class="title">正是这些平凡的人生，却构成了伟大的历史.前面的路还很远,但是一定要走下去...</view>
					<view class="message">
						<view class="item">
							<view class="left">商户名<text>{{guest.company_name}}</text></view>
							<view class="right" @click="uniCopy(guest.company_name)">复制</view>
						</view>
						<view class="item">
							<view class="left">手机号<text>{{guest.tel}}</text></view>
							<view class="right" @click="goCall(guest.tel)">拨打</view>
						</view>
						<!-- <view class="item">
							<view class="left">微信号<text>{{guest.address}}</text></view>
							<view class="right">复制</view>
						</view> -->
						<view class="item">
							<view class="left">地址<a>{{guest.address}}</a></view>
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
				<text v-if="!userInfo.is_mark">获得地图标注</text>
				<text v-else>已获得地图标注</text>
			</view>
			<view class="map_block">
				<view class="item" v-for="(item, index) in mapList" :key="index">
					<image :src="item.image" mode="widthFix"></image>
					<view>{{item.value}}</view>
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
	import { mapState, mapMutations } from 'vuex';
	import h5Copy from '@/js_sdk/junyi-h5-copy/junyi-h5-copy.js'
	import Json from '@/Json';
	export default {
		data() {
			return {
				setObj: {},
				guest: {},
				mapList: [] // 选中地图
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		mounted() {
			this.getLocal()
			this.getMap()
		},
		methods: {
			...mapMutations({
				setUserInfo: 'setUserInfo'
			}),
			// 获取缓存
			getLocal() {
				let obj = uni.getStorageSync('postMsg')
				obj ? this.guest = obj : false
			},
			// 获取选中地图
			getMap() {
				let str = uni.getStorageSync('mapStr')
				let arr = str.split(',')
				let newArr = []
				arr.forEach(item => {
					let result = Json.checkItems.filter(val => {
						return val.id == item
					})
					newArr.push(result)
				})
				this.mapList = newArr.flat(2)
			},
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				})
			},
			// 复制到剪贴板
			uniCopy(data) {
				// #ifdef H5
                const result = h5Copy(data)
				if (result === false) {
					uni.showToast({
						title:'不支持'
					})
				} else {
					uni.showToast({
						title:'复制成功',
						icon:'none'
					})
				}
				// #endif
				// #ifndef H5
				uni.setClipboardData({
					data: data,
					success: function () {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
                		})
					}
				})
				// #endif
			}
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
				font-size: 22rpx;
				text-align: center;

				>image {
					width: 76rpx;
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
