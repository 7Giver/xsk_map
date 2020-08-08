<template>
	<view id="app">
		<uni-nav-bar :title="guest.name+'的电子微名片'||'搜搜名片'" left-icon="back" @clickLeft="goNext('mine')"></uni-nav-bar>
		<view class="header">
			<image class="background" :src="guest.bg_image || background" mode="widthFix">
			<view class="card">
				<view class="avatar">
					<image :src="guest.avatar || setObj.headimgurl" mode="">
				</view>
				<view class="content">
					<view class="nickname">{{guest.name}}</view>
					<view class="title">{{guest.sign || '大众消费的导航，为您需求指方向。'}}</view>
					<view class="message">
						<view class="item">
							<view class="left">商户名<text>{{guest.company || '尚未完善'}}</text></view>
							<view class="right" @click="goNext('edit')" v-if="!guest.company">去完善</view>
							<view class="right" @click="uniCopy(guest.company)" v-else>复制</view>
						</view>
						<view class="item">
							<view class="left">手机号<text>{{guest.mobile || '尚未完善'}}</text></view>
							<view class="right" @click="goNext('edit')" v-if="!guest.mobile">去完善</view>
							<view class="right" @click="goCall(guest.mobile)" v-else>拨打</view>
						</view>
						<view class="item" v-if="guest.wechat_id">
							<view class="left">微信号<text>{{guest.wechat_id || '尚未完善'}}</text></view>
							<view class="right" @click="goNext('edit')" v-if="!guest.wechat_id">去完善</view>
							<view class="right" @click="uniCopy(guest.wechat_id)" v-else>复制</view>
						</view>
						<view class="item" @click="showMap(guest.map_url)">
							<view class="left">地址<a>{{guest.address || '尚未完善'}}</a></view>
							<view class="address" v-if="guest.map_url">
								<image src="/static/mine/card/address.png" mode="widthFix">
							</view>
							<view class="right" @click="goNext('edit')" v-else>去完善</view>
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
			<view class="banner" v-if="!guest.show_pics.length" @click="goNext('card')">
				<image src="/static/mine/card/banner.png" mode="widthFix">
			</view>
			<view class="banner_block" v-else>
				<view class="faded" v-if="!guest.is_mark">
					<view @click="goNext('home')">地图标注后可显示</view>
				</view>
				<view v-if="!showMore">
					<view class="item" v-for="(item, index) in guest.show_pics.slice(0,3)" :key="index" @click="fullImg()">
						<image :src="item" mode=""></image>
					</view>
				</view>
				<view v-else>
					<view class="item" v-for="(item, index) in guest.show_pics" :key="index" @click="fullImg()">
						<image :src="item" mode=""></image>
					</view>
				</view>
				<view class="more" @click="showmore" v-if="!showMore && guest.show_pics.length>3">展示更多</view>
			</view>
			<!-- <view class="swiper_block" v-else>
				<view class="faded" v-if="!guest.is_mark">
					<view @click="goNext('home')">地图标注后可显示</view>
				</view>
				<swiper class="show_swiper" :current="current">
					<swiper-item class="item" v-for="(item, index) in guest.show_pics" :key="index" @click="fullImg()">
						<image :src="item" mode=""></image>
					</swiper-item>
				</swiper>
			</view> -->
		</view>
		<view class="showPoster" @click="goShowPoster()" v-if="showPosterBtn">生成海报</view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="connect_tip">
				<view class="title">温馨提示</view>
				<view class="content">
					<view class="main">您尚未开通此功能</view>
					<view class="message">此功能需要开通地图标注服务</view>
				</view>
				<view class="bottom">
					<view class="cancel" @click="cancel">取消</view>
					<view class="submit" @click="goNext('home')">去标注</view>
				</view>
			</view>
		</uni-popup>
		<!-- 展示海报 -->
		<uni-popup :show="showPoster" type="center" :animation="true" :custom="true" :mask-click="true" @change="posterChange">
			<view class="poster_block">
				<canvas canvas-id="canvas" id="canvas" v-show="canvasShow" style="width:1050;height:1400;"></canvas>
				<image :src="canvas_img" mode="" v-if="canvas_img"></image>
				<view class="tips">
					<view>长按海报下载保存</view>
					<image src="/static/train/close.png" mode="" @click="posterCancel"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	import h5Copy from '@/js_sdk/junyi-h5-copy/junyi-h5-copy.js'
	import Json from '@/Json';
	export default {
		components: {
			uniNavBar,
			UniPopup
		},
		data() {
			return {
				setObj: {},
				guest: {
					show_pics: []
				},
				current: 0, // 轮播index
				background: '/static/mine/card/background.png',
				showMore: false, // 显示更多
				showDailog: false, // 弹窗显示隐藏
				showPoster: false, //海报展示弹窗
				showPosterBtn: true, // 生成海报按钮显示
				canvasShow: true, // 隐藏canvas
				canvas_img: '', // 输出的canvas图片
				showItems: [],  //商户风采数组
				mapList: [] // 选中地图
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onShow() {
			this.setObj = uni.getStorageSync('userMsg')
			this.getMineInfo()
		},
		methods: {
			open() {
				this.showDailog = true
			},
			// 获取本人信息
			getMineInfo() {
                let value = uni.getStorageSync('userMsg').wxid || this.userInfo.wxid
				if (value) {
					this.$test
						.post(`/?r=api/user/card`, {
							id: '',
							wxid: value
						})
						.then(response => {
							// console.log(response)
							if (response.code === 200) {
								let value = response.data
								this.guest = value
								if (!value.is_mark) {
									let list = value.show_pics.slice(0,1)
									this.guest.show_pics = list
								}
								uni.setNavigationBarTitle({
									title: `${this.guest.name}的电子微名片`
								})
								this.getMap()
								this.goShare()
								this.goShareCircle()
							}
						})
				}
			},
			// 监听展示弹窗状态
			change(e) {
				if (!e.show) {
					this.showDailog = false
				}
			},
			posterChange(e) {
				if (!e.show) {
					this.showPoster = false
				}
			},
			// 关闭信息弹窗
			cancel() {
				this.showDailog = false;
			},
			// 关闭海报弹窗
			posterCancel() {
				this.showPoster = false;
				this.showPosterBtn = true
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
				if(!this.guest.is_mark) {
					this.showDailog = true
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
					case 'home':
						uni.switchTab({
							url: '/pages/home/home'
						})
						break;
					case 'mine':
						uni.switchTab({
							url: '/pages/mine/mine'
						})
						break;
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
			},
			// 调用微信自定义分享
			goShare() {
				let url = window.location.href.split('#')[0]
				let obj = {
					title: `${this.userInfo.name}的名片请惠存`,
					desc: `姓名：${this.userInfo.name}  商户：${this.userInfo.company}`,
					shareUrl: `${url}#/pages/mine/card?id=${this.guest.id}&share=1`,
					imgUrl: this.guest.avatar
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
				let url = window.location.href.split('#')[0]
				let obj = {
					title: `${this.userInfo.name}的电子微名片`,
					shareUrl: `${url}#/pages/mine/card?id=${this.guest.id}&share=1`,
					imgUrl: this.guest.avatar
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					this.$jwx.initJssdk(res => {
						let shareData = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.updateTimelineShareData(shareData, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 展示更多
			showmore() {
				this.showMore = true
			},
			// 展示海报
			goShowPoster() {
				this.showPoster = true
				this.showPosterBtn = false
				this.$nextTick(() => {
					this.drawCanvas()
				})
			},
			// 渲染canvas
			drawCanvas() {
				const { windowWidth, windowHeight } = uni.getSystemInfoSync();
				let bg_width = windowWidth * 0.8
				let bg_height = 385
				this.$nextTick(() => {
					const ctx = uni.createCanvasContext('canvas', this)
					// 设置背景色
					ctx.fillStyle = "#fff"
					ctx.fillRect(0, 0, bg_width, bg_height)
					// 商户信息
					ctx.fillStyle = "#ABABAB"
					ctx.font = "15px Arial"
					ctx.fillText("店名：", 20, 210)
					ctx.fillText("手机：", 20, 235)
					ctx.fillText("微信：", 20, 260)
					ctx.fillStyle = "#333537"
					ctx.fillText(this.guest.company||'尚未完善', 60, 210)
					ctx.fillText(this.guest.mobile||'尚未完善', 60, 235)
					ctx.fillText(this.guest.wechat_id||'尚未完善', 60, 260)
					// 绘制直线
					ctx.beginPath()
					ctx.moveTo(16,280);
					ctx.lineTo(bg_width-16, 280);
					ctx.setLineWidth(1)
					ctx.strokeStyle = "#e5e5e5"
					ctx.stroke()
					// 二维码
					ctx.drawImage(this.guest.qrcode, 15, 290, 70, 70)
					// 右侧信息
					const grd = ctx.createLinearGradient(0, 0, 200, 0)
					grd.addColorStop(0, '#66CCFF')
					grd.addColorStop(1, '#9999FF')
					ctx.fillStyle = grd;
					ctx.font = "italic bold 14px Arial"
					ctx.fillText("长按识别快速定位我的位置", 95, 308)
					// 地址自动换行
					ctx.fillStyle = "#B4BAB8"
					ctx.font = "14px Arial"
					let text = this.guest.address
					canvasTextAutoLine(text, 95, 335, 18)
					// 自定义背景
					ctx.drawImage(this.guest.bg_image||this.background, 0, 0, bg_width, 150)
					// 用户头像
					ctx.drawImage(drawRoundedImg(20, 120, 60, 60, 30, this.guest.avatar))
					ctx.draw()
					// 转为base64图片
					setTimeout(() => {
						this.canvasToImg()
					}, 400)
					
					/*
					* 圆角矩形
					* @parama int/float x            矩形位置x坐标
					* @parama int/float y            矩形位置y坐标
					* @parama int/float w            矩形宽度
					* @parama int/float h            矩形高度
					* @parama int/float r            圆角半径
					* @parama object <img>           矩形背景图
					*/
					function drawRoundedImg(x,y,w,h,r,bgimg){
						ctx.strokeStyle = "transparent";
						ctx.save();
						ctx.beginPath();
						ctx.moveTo(x+r,y);
						ctx.arcTo(x+w,y,x+w,y+h,r);
						ctx.arcTo(x+w,y+h,x,y+h,r);
						ctx.arcTo(x,y+h,x,y,r);
						ctx.arcTo(x,y,x+w,y,r);
						ctx.stroke();
						ctx.clip();
						ctx.drawImage(bgimg, x, y, w, h);
						ctx.restore();
						ctx.closePath();
					}

					/*
					str: 要绘制的字符串
					initX: 绘制字符串起始x坐标
					initY: 绘制字符串起始y坐标
					lineHeight: 字行高，自己定义个值即可
					*/
					function canvasTextAutoLine(str,initX,initY,lineHeight){
						var lineWidth = 0;
						var canvasWidth = bg_width-20; 
						var lastSubStrIndex= 0; 
						for (let i=0; i<str.length; i++) { 
							lineWidth += ctx.measureText(str[i]).width; 
							if (lineWidth > canvasWidth - initX) {//减去initX,防止边界出现的问题
								ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
								initY += lineHeight;
								lineWidth = 0;
								lastSubStrIndex = i;
							} 
							if (i==str.length-1) {
								ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
							}
						}
					}
				})
			},
			// canvas转图片
			canvasToImg() {
				const { windowWidth, windowHeight } = uni.getSystemInfoSync();
				let bg_width = windowWidth * 0.8
				let bg_height = 385
				this.$nextTick(() => {
					uni.canvasToTempFilePath({
						width: bg_width,
						height: bg_height,
						destWidth: bg_width*4,
						destHeight: bg_height*4,
						quality: 1,
						canvasId: 'canvas',
						success: (res) => {
							// 在H5平台下，tempFilePath 为 base64
							// console.log(res.tempFilePath)
							this.canvas_img = res.tempFilePath
							this.canvasShow = false
						} 
					})
				})
			},
			
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 180rpx;
	background: linear-gradient(70deg, #50637C, #303641);

	.header {
		padding: 0 0 40rpx;
		// background: url('/static/mine/card/background.png') no-repeat top / 100%;

		.background {
			display: block;
			width: 100%;
		}

		.card {
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 90%;

			.avatar {
				display: flex;
				justify-content: center;
				margin-bottom: -80rpx;
				
				>image {
					display: block;
					width: 160rpx;
					height:160rpx;
					border: 12rpx solid #fff;
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
		margin: 330rpx auto 0;
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

		.banner_block {
			position: relative;

			.faded {
				position: absolute;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 1;
				background: rgba(0, 0, 0, .7);
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 20rpx;

				>view {
					color: #C59A5A;
					width: 46%;
					font-size: 28rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: 6rpx;
					background: linear-gradient(-80deg, #F9E0AF, #FAEDD2);
				}
			}

			.item {
				height: 380rpx;
				margin-bottom: 30rpx;

				>image {
					display: block;
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
		}

		.more {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #5169F7;
			font-size: 28rpx;
			text-align: center;
			letter-spacing: 1px;

			&::after {
				content: "";
				width: 12rpx;
				height: 12rpx;
				border-top: 1px solid #5169F7;
				border-right: 1px solid #5169F7;
				transform: rotate(135deg);
				margin-left: 10rpx;
				margin-bottom: 12rpx;
			}
		}

		.swiper_block {
			position: relative;

			.faded {
				position: absolute;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 1;
				background: rgba(0, 0, 0, .7);
				z-index: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 20rpx;

				>view {
					color: #C59A5A;
					width: 46%;
					font-size: 28rpx;
					line-height: 50rpx;
					text-align: center;
					border-radius: 6rpx;
					background: linear-gradient(-80deg, #F9E0AF, #FAEDD2);
				}
			}

			.show_swiper {
				width: 100%;
				position: relative;
			
				.item {
			
					image {
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
					}
				}
			}
		}
	}

	// 提示弹窗
	::v-deep.uni-popup__wrapper-box {
		width: 80%;
	}

	.connect_tip {
		margin: 0 auto;
		text-align: center;
		overflow: hidden;
		border-radius: 32rpx;
		background: url('/static/sousou/bg.png') no-repeat center / 100% 100%;

		.title {
			color: #fff;
			font-size: 34rpx;
			line-height: 80rpx;
			letter-spacing: 1px;
		}

		.content {
			padding: 56rpx 30rpx 60rpx;

			.main {
				color: #208EFF;
				font-size: 34rpx;
				margin-bottom: 40rpx;
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
			display: flex;
			align-items: center;
			font-size: 32rpx;
			line-height: 76rpx;

			>view {
				flex: 1;
			}

			.submit {
				width: 80%;
				color: #fff;
				margin: 0 auto;
				background: linear-gradient(90deg, #1482FD, #3FA9FF);
			}

			.cancel {
				color: #2996FF;
			}
		}
	}

	.showPoster {
		position: fixed;
		left: 50%;
		bottom: 30rpx;
		width: 50%;
		color: #fff;
		font-size: 34rpx;
		text-align: center;
		padding: 10rpx 0;
		border-radius: 40rpx;
		background: linear-gradient(90deg,rgba(153,153,255,1) 0%, rgba(102,204,255,1) 100%);
		transform: translate(-50%, -50%);
	}

	.poster_block {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 770rpx;

		>canvas {
			width: 100%;
			height: 100%;
		}

		>image {
			display: block;
			width: 100%;
			height: 100%;
		}

		.tips {
			position: absolute;
			left: 50%;
			bottom: -210rpx;
			transform: translate(-50%, -50%);
			display: flex;
			align-items: center;
			flex-direction: column;

			>view {
				color: #fff;
				font-size: 32rpx;
				text-align: center;
				padding: 0 20rpx;
				margin-bottom: 20rpx;
			}

			>image {
				display: block;
				width: 65rpx;
				height: 65rpx;
			}
		}
	}
}
</style>