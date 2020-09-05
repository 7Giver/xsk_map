<template>
	<view id="app">
		<uni-load-more v-if="loadingMore" :status="loadingType"></uni-load-more>
		<view class="page" v-show="!loadingMore">
			<view class="header">
				<view>搜搜地图标注中心</view>
				<view>增加客源：<text>{{5600}}万人次</text></view>
			</view>
			<view class="banner">
				<image src="/static/guest/banner.png" mode="widthFix"></image>
				<!-- 公告 -->
				<view class="notice">
					<image class="icon_l" src="/static/index/icon_notice.png" mode=""></image>
					<view class="cont">
						<swiper vertical="true" autoplay="true" circular="true" class="notice_swiper">
							<swiper-item v-for="(item, index) in noticeList" :key="index">
								<view>恭喜<text>{{ item.title }}</text>成功开通了地图定位标注</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="message">
				<view class="top">顾客在消费前，习惯通过地图搜索关键词查找周边门店。地图标注以后，用户可以搜索到您的门店，给您<text>增加客源</text>，大大<text>增加进店量</text>，<text>提升品牌知名度</text>。</view>
				<view class="icon_list">
					<view class="item" v-for="(item,index) in iconItems" :key="index">
						<image :src="item.image" mode=""></image>
						<text>{{item.title}}</text>
						<text>{{item.text}}</text>
					</view>
				</view>
			</view>
			<view class="content">
				<image class="title" src="/static/guest/title.png" mode="widthFix"></image>
				<view class="show_box">
					<swiper class="show_swiper" :current="current" v-if="showItems.length>1">
						<swiper-item class="item" v-for="(item, index) in showItems" :key="index" @click="fullImg()">
							<image :src="item.cover" mode="widthFix"></image>
						</swiper-item>
					</swiper>
					<swiper class="show_swiper1" :current="current" v-else>
						<swiper-item class="item1" v-for="(item, index) in showItems" :key="index" @click="fullImg()">
							<image :src="item.cover" mode="widthFix"></image>
						</swiper-item>
					</swiper>
					<view class="swiper-btn left" @click="prev">
						<image src="/static/guest/left.png" mode=""></image>
					</view>
					<view class="swiper-btn right" @click="next">
						<image src="/static/guest/right.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="my_btn" @click="_checkItem('all')">一键标注地图 领先同行一步</view>
			<view class="load_order" @click="getOrder" v-if="hasOrder">
				<view>待支付</view>
				<view>{{count}}</view>
			</view>
			<!-- 信息弹窗 -->
			<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
				<view class="uni-tip">
					<view class="notice">
						<image class="icon_l" src="/static/index/icon_notice.png" mode=""></image>
						<view class="cont">
							<swiper vertical="true" autoplay="true" circular="true" class="notice_swiper">
								<swiper-item v-for="(item, index) in noticeList" :key="index">
									<view>恭喜<text>{{ item.title }}</text>成功开通了地图定位标注</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
					<view class="input-content">
						<!-- <view class="my_item">
							<view class="label">真实姓名</view>
							<input type="text" v-model="guest.name" maxlength="16" placeholder="请填写真实有效姓名" />
						</view> -->
						<view class="my_item">
							<view class="label">手机号码</view>
							<input id="tel" type="number" v-model="guest.tel" @input="saveMsg" maxlength="11" placeholder="电话（预留在地图的电话）" />
						</view>
						<view class="my_item">
							<view class="label">店铺/公司名称</view>
							<input type="text" v-model="guest.company_name" @input="saveMsg" placeholder="店名（招牌名称）" />
						</view>
						<view class="my_item">
							<view class="label">店铺/公司地址</view>
							<input type="text" v-model="guest.address" @input="saveMsg" placeholder="地址（x省x市x区x镇x街x号）" />
						</view>
						<view class="form-btn1" @click="submit">立即标注地图 客户轻松上门</view>
						<!-- <view class="form-btn" @click="submit">
							<view class="left">
								<view>限时优惠<br>￥299</view>
								<view>剩余9个名额</view>
							</view>
							<view class="right">
								<view>立即标注地图</view>
								<view>客户轻松上门</view>
							</view>
						</view> -->
						<!-- <view class="form-btn2" @click="submit">
							<view>立即标注地图</view>
							<view>客户轻松上门</view>
						</view> -->
					</view>
					<image class="close" src="/static/index/close.png" mode="" @click="cancel"></image>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	import lodash from '@/common/lodash.js';
	import Json from '@/Json';
	export default {
		components: {
			UniPopup,
			uniLoadMore
		},
		data() {
			return {
				setObj: {}, // 授权后用户信息对象
				guest: {},  // 表单信息对象
				loadingType: "loading",
				order_sn: '', // 待支付单号
				timer: null, // 定时器
				count: '', // 倒计时
				hasOrder: false, //延迟订单显示
				loadingMore: true, // 加载更多
				showDailog: false, // 是否显示信息弹窗
				current: 0, // 轮播index
				noticeList: [],
				iconItems: [{
						image: '/static/guest/guest.png',
						title: '客户',
						text: '导航上门'
					},
					{
						image: '/static/guest/address.png',
						title: '精准',
						text: '位置信息'
					},
					{
						image: '/static/guest/save.png',
						title: '增加',
						text: '顾客流量'
					},
					{
						image: '/static/guest/cup.png',
						title: '提升',
						text: '品牌知名度'
					},
				],
				showItems: [],
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onShow() {
			this.loadingMore = false
			this.noticeList = Json.noticeList
			this.getUserdata()
			this.getShow()
			this.getloadingOrder()
			this.goShare()
			this.goShareCircle()
		},
		onTabItemTap() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 0
			})
		},
		methods: {
			// 获取用户信息
			getUserdata() {
				var value = uni.getStorageSync('userMsg')
				if (value.wxid) {
					this.setObj = value
					console.log('has value!+++++++++')
					console.log(value)
					console.log('has value!+++++++++')
					this.getloadingOrder()
				} else {
					console.log('no value!+++++++++')
					// this.getUserMsg()
				}
				setTimeout(() => {
					let obj = this.userInfo
					if (obj.mobile !== undefined) {
						this.guest.tel = obj.mobile,
						this.guest.company_name = obj.company,
						this.guest.address = obj.address
					}
				})
			},
			// 上传合法手机号
			postMobile(tel) {
				this.$test
					.post(`/?r=api/index/mobile`, {
						wxid: this.setObj.wxid,
						mobile: tel
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let result = response.data
							this.$set(this.guest, 'company_name', result.company)
							this.$set(this.guest, 'address', result.address)
						}
					})
			},
			// 获取banner图
			getShow() {
				// this.$http
				// 	.post(`/api/getBanner`, {})
				// 	.then(response => {
				// 		if (response.code === 200) {
				// 			// console.log(response)
				// 			this.showItems = response.data
				// 		}
				// 	});

				this.$test
					.post(`/?r=api/index/banner`, {})
					.then(response => {
						if (response.code === 200) {
							// console.log(response)
							this.showItems = response.data
						}
					});
			},
			// 获取进行中订单
			getloadingOrder() {
				let value = this.setObj
				if (value) {
					this.$test
						.post(`/?r=api/index/index`, {
							wxid: value.wxid
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
				let obj = {
					title: `增加客源`,
					desc: `立即标注 给您增加海量客源`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/16/16b244d0c4094b003e8f412f8ac8013d.png`
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
				let obj = {
					title: `增加客源`,
					shareUrl: window.location.href,
					imgUrl: `${this.$dataURL}/image/16/16b244d0c4094b003e8f412f8ac8013d.png`
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
			// 全屏展示图片
			fullImg() {
				let arr = []
				this.showItems.forEach(item => {
					arr.push(item.cover)
				})
				uni.previewImage({
					urls: arr,
					current: 0
				})
			},
			// 上一张
			prev() {
				let showItems = this.showItems;
				this.current = this.current > 0 ? this.current - 1 : showItems.length - 1;
			},
			// 下一张
			next() {
				let showItems = this.showItems;
				this.current = this.current < (showItems.length - 1) ? this.current + 1 : 0;
			},
			// 点击按钮
			_checkItem() {
				var value = uni.getStorageSync('userMsg')
				value.wxid ? this.showDailog = true : this.$getAuthorize()
			},
			/** 回退弹窗取消方法 */
			cancel() {
				this.showDailog = false
			},
			/** 监听弹窗状态是否打开 */
			change(e) {
				if (!e.show) {
					this.showDailog = false
				}
			},
			// 监听input输入
			saveMsg(e) {
				let type = e.target.id
				if (type == 'tel') {
					if (!(/^1[3456789]\d{9}$/.test(this.guest.tel))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
							duration: 1000
						});
						return false
					}
					this.postMobile(this.guest.tel)
				} else {
					let obj = {
						tel: this.guest.tel,
						company_name: this.guest.company_name,
						address: this.guest.address
					}
					uni.setStorage({
						key: "postMsg",
						data: obj
					});
				}
				this.uniteUserMsg()
			},
			// 节流同步
			uniteUserMsg: lodash.debounce(function() {
				let obj = {
					tel: this.guest.tel,
					company_name: this.guest.company_name || '',
					address: this.guest.address || ''
				}
				let value = uni.getStorageSync('userMsg')
				if(value.wxid) {
					this.$test
						.post(`/?r=api/user/part`, {
							wxid: value.wxid,
							company: obj.company_name,
							address: obj.address
						})
						.then(response => {
							// console.log(response)
							if (response.code === 200) {
							}
						});
				}
			}, 800),
			// 提交信息
			submit() {
				let str = uni.getStorageSync('mapStr')
				if (str == "") {
					uni.showToast({
						title: '地图至少选择一项！',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.tel) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.tel))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return false
				}
				// if (!this.guest.company_name) {
				// 	uni.showToast({
				// 		title: '请输入店铺名称',
				// 		icon: 'none'
				// 	});
				// 	return false
				// }
				// if (!this.guest.address) {
				// 	uni.showToast({
				// 		title: '请输入详细地址',
				// 		icon: 'none'
				// 	});
				// 	return false
				// }
				this.getMapUserInfo()
			},
			// 获取用户信息
			getMapUserInfo() {
				let obj = {
					tel: this.guest.tel,
					company_name: this.guest.company_name || '',
					address: this.guest.address || '',
				}
				uni.setStorage({
					key: "postMsg",
					data: obj
				});
				let str = uni.getStorageSync('mapStr')
				let result = {
					wxid: this.setObj.wxid,
					name: this.guest.company_name,
					tel: this.guest.tel,
					map: str,
					address: this.guest.address
				}
				// console.log(result)
				this.$test
					.post(`/?r=api/order/map-submit`, result)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.navigateTo({
								url: '/pages/pay/pay?order_sn=' + response.data.order_sn
							})
						}
					})
			}
		}
	}
</script>

<style lang="scss">
	#app {
		padding-bottom: 180rpx;
		background: #9ECBEE;

		.header {
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			color: #115AA4;
			padding: 0 30rpx;
			font-size: 28rpx;
			line-height: 70rpx;
			background: rgba(255, 255, 255, 0.3);

			view {
				opacity: 0.8;

				>text {
					color: #FF2D13;
				}
			}
		}

		.banner {
			position: relative;

			>image {
				width: 100%;
				vertical-align: middle;
			}

			.notice {
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1;
				width: 75%;
				display: flex;
				align-items: center;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 50rpx;
				padding: 4rpx 12rpx;

				.icon_l {
					width: 24rpx;
					height: 24rpx;
					margin-left: 16rpx;
				}

				.cont {
					margin-left: 16rpx;
					flex: 1;
				}

				.notice_swiper {
					width: 100%;
					height: 50rpx;
					line-height: 24rpx;

					view {
						width: 100%;
						display: inline-block;
						font-size: 24rpx;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

						>text {
							color: #F75347;
						}
					}
				}
			}
		}

		.message {
			height: 490rpx;
			margin: 0 30rpx 50rpx;
			padding: 60rpx 50rpx 30rpx;
			background: url('/static/guest/bg.png') no-repeat center / 100% 100%;

			.top {
				font-size: 30rpx;
				line-height: 44rpx;
				margin-bottom: 20rpx;

				text {
					color: #FD5943;
				}
			}

			.icon_list {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item {
					display: flex;
					align-items: center;
					flex-direction: column;

					>image {
						width: 110rpx;
						height: 110rpx;
						margin-bottom: 6rpx;
					}

					>text {
						color: #666;
						font-size: 24rpx;
					}
				}
			}
		}

		.content {
			margin: 0 30rpx;
			height: 1200rpx;
			padding-top: 80rpx;
			border-radius: 20rpx;
			background: #D6ECFF;
			position: relative;

			.title {
				position: absolute;
				left: 50%;
				top: 16rpx;
				transform: translate(-50%, -50%);
				width: 45%;
			}

			.show_box {
				height: 100%;
				position: relative;

				.show_swiper {
					width: 100%;
					height: 100%;
					padding-left: 30rpx;

					.item {
						width: 80% !important;
						padding-right: 30rpx;

						image {
							width: 100%;
							border-radius: 26rpx;
						}
					}

					&::after {
						content: '';
						position: absolute;
						right: 0;
						top: 0;
						display: block;
						width: 150rpx;
						height: 1080rpx;
						background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2));
					}
				}
				
				.show_swiper1 {
					width: 100%;
					height: 100%;
					margin: 0 auto;
				
					.item1 {
						padding: 0rpx 90rpx;
				
						image {
							width: 100%;
							border-radius: 26rpx;
						}
					}
				
				}

				.swiper-btn {
					position: absolute;
					top: 40%;
					padding: 16rpx 0;

					>image {
						width: 70rpx;
						height: 70rpx;
					}

				}

				.left {
					left: -20rpx;
				}

				.right {
					right: -20rpx;
				}
			}
		}

		::v-deep.uni-popup__wrapper.center {
			height: 87%;
		}

		.uni-tip {
			padding: 50rpx 30rpx 30rpx;
			background: #83C7FC;
			border-radius: 20rpx;

			.close {
				display: block;
				position: absolute;
				left: 50%;
				bottom: -115rpx;
				transform: translate(-50%, -50%);
				width: 60rpx;
				height: 60rpx;
			}

			.notice {
				display: flex;
				align-items: center;
				background: rgba(255, 255, 255, 0.5);
				border-radius: 50rpx;
				padding: 4rpx 12rpx;

				.icon_l {
					width: 24rpx;
					height: 24rpx;
					margin-left: 16rpx;
				}

				.cont {
					margin-left: 16rpx;
					flex: 1;
				}

				.notice_swiper {
					width: 100%;
					height: 50rpx;
					line-height: 24rpx;

					view {
						width: 100%;
						display: inline-block;
						font-size: 24rpx;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;

						>text {
							color: #F75347;
						}
					}
				}
			}

			.input-content {
				margin-top: 28rpx;
				padding: 20rpx 30rpx;
				background: #fff;
				border-radius: 20rpx;

				.my_item {
					padding-bottom: 30rpx;

					.label {
						color: #597A96;
						font-size: 32rpx;
						padding-left: 6rpx;
						margin-bottom: 12rpx;
					}

					input {
						color: #777;
						height: 80rpx;
						font-size: 28rpx;
						text-indent: 30rpx;
						background: #EEF2F4;
						border-radius: 20rpx;
					}

					.uni-input-placeholder {
						color: #C8D3DC;
						font-size: 28rpx;
					}
				}

				.form-btn1 {
					color: #fff;
					font-size: 32rpx;
					text-align: center;
					line-height: 80rpx;
					border-radius: 40rpx;
					margin: 30rpx auto 20rpx;
					background: linear-gradient(90deg, #FF586E, #FF7D60);
				}

				.form-btn2 {
					width: 80%;
					color: #fff;
					font-size: 30rpx;
					padding: 10rpx 0;
					text-align: center;
					border-radius: 20rpx;
					margin: 16rpx auto 20rpx;
					background: #D92D1C;

					.right {
						flex: 1;
						font-size: 30rpx;
						text-align: center;
						letter-spacing: 1px;
						line-height: 50rpx;
					}
				}

				.form-btn {
					display: flex;
					align-items: center;
					color: #fff;
					font-size: 34rpx;
					text-align: center;
					border-radius: 20rpx;
					margin: 30rpx auto 20rpx;
					background: #D92D1C;

					.left {
						text-align: center;
						margin: 20rpx auto;
						padding: 0 20rpx;
						border-right: 1px solid rgba(255, 255, 255, 0.6);

						&:first-child {
							color: #FFEA00;
							font-size: 26rpx;
						}

						:last-child {
							font-size: 22rpx;
						}
					}

					.right {
						flex: 1;
						font-size: 30rpx;
						text-align: center;
						letter-spacing: 1px;
						line-height: 50rpx;
					}
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
