<template>
	<!-- 他人名片 -->
	<view id="app">
		<view class="header">
			<view class="card">
				<view class="avatar" v-if="guest.avatar">
					<image :src="guest.avatar" mode="">
				</view>
				<view class="content">
					<view class="nickname">{{guest.name}}</view>
					<view class="title">{{guest.sign || '正是这些平凡的人生，却构成了伟大的历史.前面的路还很远,但是一定要走下去...'}}</view>
					<view class="message">
						<view class="item">
							<view class="left">商户名<text>{{guest.company || '尚未完善'}}</text></view>
							<view class="right" @click="uniCopy(guest.company)">复制</view>
						</view>
						<view class="item">
							<view class="left">手机号<text>{{guest.mobile || '尚未完善'}}</text></view>
							<view class="right" @click="goCall(guest.mobile)">拨打</view>
						</view>
						<view class="item" v-if="guest.wechat_id">
							<view class="left">微信号<text>{{guest.wechat_id || '尚未完善'}}</text></view>
							<view class="right" @click="uniCopy(guest.wechat_id)">复制</view>
						</view>
						<view class="item" @click="showMap(guest.map_url)">
							<view class="left">地址<a>{{guest.address || '尚未完善'}}</a></view>
							<view class="address">
								<image src="/static/mine/card/address.png" mode="widthFix">
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="show_block">
			<view class="title" v-if="guest.maps">
				<image src="/static/mine/card/title.png" mode="widthFix">
				<text v-if="!guest.is_mark">获得地图标注</text>
				<text v-else>已获得地图标注</text>
			</view>
			<view class="map_block" v-if="guest.maps">
				<view class="item" v-for="(item, index) in mapList" :key="index">
					<image :src="item.image" mode="widthFix"></image>
					<view>{{item.value}}</view>
				</view>
			</view>
			<view class="title">
				<image src="/static/mine/card/title.png" mode="widthFix">
				<text>商户风采</text>
			</view>
			<view class="banner" v-if="!guest.show_pics.length">
				<image :src="imgUrl" mode="widthFix">
				<view>商家暂无上传</view>
			</view>
			<swiper class="show_swiper" :current="current" v-else>
				<swiper-item class="item" v-for="(item, index) in guest.show_pics" :key="index" @click="fullImg()">
					<image :src="item" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="connect_tip">
				<view class="title">温馨提示</view>
				<view class="content">
					<view class="main">当前用户尚未开通此功能</view>
					<view class="message">您的联系请求已收集</view>
					<view class="message">稍后会通知该用户</view>
				</view>
				<view class="bottom">
					<view class="submit" @click="cancel">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	import h5Copy from '@/js_sdk/junyi-h5-copy/junyi-h5-copy.js'
	import Json from '@/Json';
	export default {
		components: {
			UniPopup
		},
		data() {
			return {
				guest: {
					show_pics: []
				},
				imgUrl: '',
				current: 0, // 轮播index
				showDailog: false, // 弹窗显示隐藏
				showItems: [],  //商户风采数组
				mapList: [] // 选中地图
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad(option) {
			let id = option.id
			id ? this.getClientInfo(id) : false
			this.imgUrl = Json.nodata
			// this.getLocal()
		},
		methods: {
			...mapMutations({
				setUserInfo: 'setUserInfo'
			}),
			// 获取客户信息
			getClientInfo(id) {
				this.$test
					.post(`/?r=api/user/card`, {
						id: id,
						wxid: ''
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.guest = response.data
							this.getMap()
						}
					});
			},
			// 监听展示弹窗状态
			change(e) {
				if (!e.show) {
					this.showDailog = false
				}
			},
			// 关闭信息弹窗
			cancel() {
				this.showDailog = false;
			},
			// 全屏展示图片
			fullImg() {
				let arr = []
				this.guest.show_pics.forEach(item => {
					arr.push(item)
				})
				uni.previewImage({
					urls: arr,
					current: 0
				})
			},
			// 跳转外部地图
			showMap(url) {
				if(!this.guest.is_mark) {
					this.showDailog = true
					return false
				}
				if(url && this.guest.is_mark) {
					window.location.href = url
				}
			},
			// 获取缓存
			getLocal() {
				let obj = uni.getStorageSync('postMsg')
				obj ? this.guest = obj : false
			},
			// 获取选中地图
			getMap() {
				let str = this.guest.maps
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
				if(!tel) {
					return false
				}
				if(!this.guest.is_mark) {
					this.showDailog = true
					return false
				}
				uni.makePhoneCall({
    				phoneNumber: tel
				})
			},
			// 复制到剪贴板
			uniCopy(data) {
				if(!data) {
					return false
				}
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
			},
			// 跳转编辑页
			goNext(type) {
				let url = ''
				switch (type) {
					case 'card':
						url = '/pages/mine/card_management'
						break;
					case 'edit':
						url = '/pages/mine/editmsg'
						break;
					default:
						url = ''	
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 100rpx;
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
						padding: 12rpx 26rpx;

						&:not(:last-child) {
							.left {
								padding-right: 20rpx;
							}
						}

						&:last-child {
							.left {
								letter-spacing: 30rpx;
							}
						}

						.left {
							flex: 1;
							font-size: 30rpx;
							white-space: nowrap;
							display: flex;

							>text {
								color: #9CA1B4;
								font-size: 28rpx;
								margin-left: 20rpx;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								word-break: break-all;
								overflow: hidden;
								white-space: normal;
							}

							>a {
								color: #557FEE;
								font-size: 26rpx;
								margin-left: -12rpx;
								letter-spacing: 0px;
								text-decoration: underline;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								word-break: break-all;
								overflow: hidden;
								white-space: normal;
							}
						}

						.right {
							color: #5169F7;
							font-size: 28rpx;
							white-space: nowrap;
							padding: 6rpx 20rpx;
							background: #E3E8FC;
							border-radius: 10rpx;

							>image {
								display: block;
								width: 40rpx;
							}
						}

						.address {
							padding: 0;
							margin: 0 36rpx;
							background: transparent;

							image {
								width: 28rpx;
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
			display: flex;
			align-items: center;
			flex-direction: column;
			width: 100%;
			padding-top: 20rpx;

			>image {
				display: block;
				width: 200rpx;
				margin-bottom: 10rpx;
			}

			>view {
				color: #333;
				font-size: 28rpx;
				line-height: 60rpx;
			}
		}

		.show_swiper {
			width: 100%;
		
			.item {
		
				image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
		
		}
	}

	// 提示弹窗
	::v-deep.uni-popup__wrapper-box {
		width: 70%;
	}

	.connect_tip {
		text-align: center;
		background: url('/static/sousou/bg.png') no-repeat center / 100% 100%;

		.title {
			color: #fff;
			font-size: 34rpx;
			line-height: 94rpx;
			letter-spacing: 1px;
		}

		.content {
			padding: 34rpx 30rpx 30rpx;

			.main {
				color: #208EFF;
				font-size: 34rpx;
				margin-bottom: 30rpx;
			}

			.off_title {
				color: #4D565E;
				font-size: 32rpx;
				line-height: 86rpx;

				>text {
					color: #1F8FFF;
				}
			}

			.message {
				color: #4D565E;
				font-size: 30rpx;
				padding-bottom: 18rpx;
			}
		}

		.bottom {
			font-size: 34rpx;
			padding-bottom: 40rpx;

			.submit {
				width: 80%;
				color: #fff;
				margin: 0 auto;
				line-height: 76rpx;
				border-radius: 80rpx;
				background: linear-gradient(90deg, #1482FD, #3FA9FF);
			}

			.cancel {
				color: #2996FF;
				line-height: 88rpx;
			}
		}
	}
}
</style>
