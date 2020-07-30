<template>
	<view id="app" v-show="true">
		<view class="header">
			<view>搜搜地图标注中心</view>
			<view>标注商户：<text>{{39.6}}万户</text></view>
		</view>
		<view class="banner">
			<image src="/static/index/banner.png" mode="widthFix"></image>
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
		<view class="content">
			<view class="top">
				<image class="address" src="/static/index/address.png" mode="widthFix"></image>
				<image class="main_title" src="/static/index/main_title.png" mode="widthFix"></image>
			</view>
			<view class="list_box">
				<view class="let_item" v-for="(item,index) in checkItems" :key="index" @click="_checkItem(index)">
					<view class="checked">
						<image v-if="item.checked" src="/static/index/checked.png" mode=""></image>
						<image v-else src="/static/index/circle.png" mode=""></image>
					</view>
					<view class="right">
						<view class="left">
							<image :src="item.image" mode=""></image>
							<text>{{item.value}}</text>
						</view>
						<view class="next" @click.stop="_showItem(item.id)">
							<text>效果预览</text>
							<image src="/static/index/next.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="my_btn" @click="_checkItem('all')">一键批量标注 获得海量曝光</view>
		<view class="load_order" @click="getOrder" v-if="hasOrder">
			<view>待支付</view>
			<view>10:00:00</view>
		</view>
		<!-- <view @tap="goNext">跳转</view> -->
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
						<input id="tel" type="number" v-model="guest.tel" @blur="saveMsg" maxlength="11" placeholder="请填写真实有效的手机号码" />
					</view>
					<view class="my_item">
						<view class="label">店铺/公司名称</view>
						<input type="text" v-model="guest.company_name" @blur="saveMsg" placeholder="请填写真实有效店铺/公司名称" />
					</view>
					<view class="my_item">
						<view class="label">店铺/公司地址</view>
						<input type="text" v-model="guest.address" @blur="saveMsg" placeholder="请填写真实有效店铺/公司地址" />
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
		<!-- 展示弹窗 -->
		<uni-popup :show="showDailog1" type="center" :animation="true" :custom="true" :mask-click="true" @change="change1">
			<view class="container">
				<!-- <image class="title" src="/static/guest/title.png" mode="widthFix"></image> -->
				<view class="show_box">
					<swiper class="show_swiper" indicator-dots="true" circular="true" indicator-active-color="#6E7FD2" :current="current" v-if="showItems.length>1">
						<swiper-item class="item" v-for="(item, index) in showItems" :key="index">
							<image :src="item.cover" mode=""></image>
						</swiper-item>
					</swiper>
					<swiper class="show_swiper1" :current="current" v-else>
						<swiper-item class="item1" v-for="(item, index) in showItems" :key="index">
							<image :src="item.cover" mode=""></image>
						</swiper-item>
					</swiper>
					<!-- <view class="swiper-btn left" v-if="showItems.length>1" @click="prev">
						<image src="/static/guest/left.png" mode=""></image>
					</view>
					<view class="swiper-btn right" v-if="showItems.length>1" @click="next">
						<image src="/static/guest/right.png" mode=""></image>
					</view> -->
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
				order_sn: '',  // 待支付订单号
				setObj: {}, // 授权后用户信息对象
				showDailog: false, // 是否显示信息弹窗
				showDailog1: false, // 是否显示展示弹窗
				hasOrder: false, // 控制进行中订单显示
				current: 0, // 轮播index
				guest: {},  // 表单信息
				showItems: [],  // 展示轮播数组
				noticeList: [], // 公告信息
				checkItems: []  // 地图数组
			}
		},
		onShow() {
			// uni.hideTabBar()
			this.noticeList = Json.noticeList
			this.checkItems = Json.checkItems
			this.getUserdata()
			// 设置选中地图
			uni.setStorage({
				key: "mapStr",
				data: '1,2,3,4,5,6'
			});
		},
		// 点击tabbar切换事件
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
				if (value) {
					this.setObj = value
					console.log('has value!+++++++++')
					console.log(value)
					console.log('has value!+++++++++')
					// this.getloadingOrder()
				} else {
					console.log('no value!+++++++++')
					this.getUserMsg()
				}
				let obj = uni.getStorageSync('postMsg')
				let open = uni.getStorageSync('openPost')
				obj ? this.guest = obj : false
				// 根据编辑信息控制弹窗显示
				if (open) {
					this.$nextTick(() => {
						this.showDailog = true;
					})
					uni.removeStorageSync('openPost');
				}
			},
			// 根据url获取参数
			getUserMsg() {
				var href = window.location.href;
				var temp = href.split("?")[1]; // 通过拆分链接判断是否获取参数存储
				if (temp) {
					let url = decodeURIComponent(window.location.href)
					uni.setStorage({
						key: "userMsg",
						data: getUrlparam(url),
					});
					this.setObj = uni.getStorageSync('userMsg');
					this.$nextTick(() => {
						this.showDailog = true;
					})
					// this.getloadingOrder()
					// console.log(uni.getStorageSync('userMsg'))
				}

				function getUrlparam(url) {
					let askText = url.split('?')[1];
					let result = {};
					let askAry = askText.split("&");
					askAry.forEach((item) => {
						let n = item.split("=");
						let key = n[0];
						let value = n[1];
						result[key] = value;
					});
                	return result;
            	}
			},
			// 获取进行中订单
			getloadingOrder() {
				this.$test
					.post(`/?r=api/index/index`, {
						wxid: this.setObj.wxid
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							if (response.data.order_sn) {
								this.order_sn = response.data.order_sn
								this.hasOrder = true
							}
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
						}
					})
			},
			// 获取进行中订单信息并下单
			getOrder() {
				if (this.order_sn) {
					window.location.href = `${this.$testURL}?r=api/order/go&order_sn=${this.order_sn}`
				} else {
					uni.showToast({
						title: '下单失败',
						icon: 'none'
					})
				}
			},
			// 多选点击事件 展示信息弹窗
			_checkItem(index) {
				let checkList = this.checkItems;
				if (index === 'all') {
					// checkList.forEach(item => {
					// 	item.checked = true
					// })
					var value = uni.getStorageSync('userMsg')
					value ? this.showDailog = true : this.$getAuthorize()
				} else {
					checkList[index].checked ?
						checkList[index].checked = false :
						checkList[index].checked = true
					let arr = this.checkItems.filter(item => {
						return item.checked
					})
					let newArr = [];
					arr.forEach(item => {
						newArr.push(item.id)
					})
					let str = newArr.join(',');
					uni.setStorage({
						key: "mapStr",
						data: str
					});
				}
			},
			// 关闭信息弹窗
			cancel() {
				this.showDailog = false;
			},
			// 监听信息弹窗状态
			change(e) {
				// console.log(e.show)
				if (!e.show) {
					this.showDailog = false
				}
			},
			// 展示效果图事件
			_showItem(id) {
				// this.$http
				// 	.post(`/api/getPoster`, {
				// 		type: id
				// 	})
				// 	.then(response => {
				// 		if (response.code === 200) {
				// 			// console.log(response)
				// 			this.showItems = response.data
				// 			this.showDailog1 = true
				// 		}
				// 	});

				this.$test
					.post(`/?r=api/index/poster`, {
						type: id
					})
					.then(response => {
						if (response.code === 200) {
							// console.log(response)
							this.showItems = response.data
							this.showDailog1 = true
						}
					});
			},
			// 监听展示弹窗状态
			change1(e) {
				if (!e.show) {
					this.showDailog1 = false;
					this.current = 0;
					this.showItems = []
				}
			},
			// 全屏展示图片
			fullImg(url) {
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
					if (!(/^1[3456789]\d{9}$/.test(this.guest.tel))) {
						return false
					}
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
			},
			// 提交信息
			submit() {
				let checkAdult = this.checkItems.every(item => {
					return item.checked === false
				})
				if (checkAdult) {
					uni.showToast({
						title: '至少选择一项！',
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
				if (!this.guest.company_name) {
					uni.showToast({
						title: '请输入店铺名称',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.address) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					});
					return false
				}
				this.postMapUserInfo()
			},
			// 提交用户信息
			postMapUserInfo() {
				let obj = {
					tel: this.guest.tel,
					company_name: this.guest.company_name,
					address: this.guest.address
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
			},
			goNext() {
				uni.navigateTo({
					url: '/pages/outweb/outweb'
				})
			}
		}
	}
</script>

<style lang="scss">
	#app {
		position: relative;
		background: #9ECBEE;
		padding-bottom: 180rpx;

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
				bottom: -6rpx;
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

		.content {
			margin: 0 20rpx;
			padding: 0 0 40rpx;
			border-radius: 24rpx;
			background: #fff;

			.top {
				display: flex;
				align-items: center;
				flex-direction: column;
				padding-top: 20rpx;
				background: url('/static/index/background.png') no-repeat center / 100% 100%;

				.address {
					width: 60rpx;
				}

				.main_title {
					width: 90%;
					margin: 30rpx 0;
				}
			}

			.list_box {
				padding: 0 32rpx;

				.let_item {
					display: flex;
					align-items: center;
					padding: 24rpx 0;

					&:not(:last-child) {
						border-bottom: 1px solid #E9EAEF;
					}

					.checked {
						height: 60rpx;
						margin-right: 26rpx;

						>image {
							width: 60rpx;
							height: 60rpx;
						}
					}

					.right {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.left {
							display: flex;
							align-items: center;
							font-size: 32rpx;
							color: #5B5B5B;

							>image {
								width: 60rpx;
								height: 60rpx;
								margin-right: 20rpx;
							}
						}

						.next {
							display: flex;
							align-items: center;
							font-size: 30rpx;
							color: #5B68AC;

							>image {
								width: 32rpx;
								height: 32rpx;
								margin-left: 12rpx;
							}
						}
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
			background: url('/static/index/clock.png') no-repeat center / 100% 100%;

			>view {
				color: #FC585B;
				font-size: 24rpx;
			}
		}

		::v-deep.uni-popup__wrapper.center {
			height: 86%;
		}

		.uni-tip {
			padding: 30rpx 30rpx 30rpx;
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

		// 展示弹窗
		
		.container {
			height: 1040rpx;
			border-radius: 20rpx;
			// background: #D6ECFF;
			position: relative;

			.title {
				position: absolute;
				left: 50%;
				top: 12rpx;
				transform: translate(-50%, -50%);
				width: 45%;
			}

			.show_box {
				height: 100%;
				position: relative;

				.show_swiper {
					width: 100%;
					height: 100%;
					padding-top: 78rpx;

					.item {
						width: 80% !important;
						padding-right: 40rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 26rpx;
						}
					}

					// &::after {
					// 	content: '';
					// 	position: absolute;
					// 	right: 0;
					// 	top: 0;
					// 	display: block;
					// 	width: 132rpx;
					// 	height: 926rpx;
					// 	background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2));
					// }
				}

				.show_swiper1 {
					width: 100%;
					height: 100%;
					padding-top: 40rpx;

					.item1 {
						padding: 0rpx 42rpx;

						image {
							width: 100%;
							height: 100%;
							border-radius: 26rpx;
						}
					}

				}

				.swiper-btn {
					position: absolute;
					top: 40%;
					padding: 20rpx;

					>image {
						width: 70rpx;
						height: 70rpx;
					}

				}

				.left {
					left: -56rpx;
				}

				.right {
					right: -56rpx;
				}
			}
		}
	}
</style>

