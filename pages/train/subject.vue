<template>
	<view id="app">
		<view class="header">
			<image class="bg_img" src="/static/train/pic_1.png" mode="widthFix"></image>
			<view class="msg_block">
				<view class="title">直通车累计为<text>{{randomObj.client}}</text>位用户提供了</view>
				<view class="train_data">
					<view class="item">
						<view>人脉</view>
						<view>{{randomObj.friendShip}}</view>
					</view>
					<view class="item">
						<view>需求</view>
						<view>{{randomObj.demand}}</view>
					</view>
					<view class="item">
						<view>订单</view>
						<view>{{randomObj.orders}}</view>
					</view>
				</view>
				<!-- 公告 -->
				<view class="notice">
					<image class="icon_l" src="/static/train/icon_lb.png" mode=""></image>
					<view class="cont">
						<swiper vertical="true" autoplay="true" circular="true" class="notice_swiper" @change="goRandom">
							<swiper-item v-for="(item, index) in noticeList" :key="index">
								<view><text>{{item.nickname}}</text>{{randomTime}}分钟前成功开通直通车</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
		<view class="container">
			<view class="train_block">
				<view class="title">搜搜直通车简介</view>
				<view class="content">
					<view class="text">搜搜集团旗下搜搜直通车，于2015年起，已累计为17万客户提供了<text>2500多万客源</text>，以及超过5亿人次的品牌曝光。与<text>百度</text>、<text>360</text>、<text>搜狗</text>建立稳定持续的战略合作关系。搜索引擎代理投放产业发起者，树立了行业品牌标杆持续引领行业发展。</view>
				</view>
			</view>
			<view class="train_block">
				<view class="title">每日签单真实案例</view>
				<view class="content">
					<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll">
						<view class="scroll-view-item" v-for="(item, index) in showList" :key="index" @click="fullImg">
							<image :src="item" mode="widthFix"></image>
						</view>
                	</scroll-view>
				</view>
			</view>
			<view class="train_block">
				<view class="title">直通车投放效果展示</view>
				<view class="content">
					<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll_video">
						<view class="video_block" v-for="(item, index) in videoList" :key="index">
							<video 
								id="myVideo"
								:src="item.video"
								:poster="item.poster"
								:muted="true"
								:show-fullscreen-btn="true"
								:enable-progress-gesture="false"
								:object-fit="index == 0 ? 'contain' : 'fill'"
								@error="videoErrorCallback"
								controls
							>
							</video>
						</view>
                	</scroll-view>
				</view>
			</view>
			<view class="icon_block">
				<view class="item" v-for="(item,index) in icon_list" :key="index">
					<image :src="item.icon" mode="widthFix"></image>
					<view>{{item.title}}</view>
				</view>
			</view>
			<view class="train_block">
				<view class="title">直通车获客流程</view>
				<view class="content">
					<image src="/static/train/pic_2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="train_block">
				<view class="title">三大服务助您获客</view>
				<view class="content">
					<image src="/static/train/pic_3.png?v=7" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="confim_btn" @click="goNext()">
			<view>点击立即开启直通车</view>
			<text>无限量自动领取精准客户</text>
			<image class="finger" src="/static/train/finger.gif" mode="widthFix">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				randomObj: {  //随机数对象
					client: 170360,
					friendShip: 25013580,
					demand: 23645894,
					orders: 15261843,
				},
				randomTime: 0, //随机时间
				old: {
					scrollTop: 0
				},
				videoList: [
					{
						video: 'http://qe9i29b4d.bkt.clouddn.com/video/e7/e71468eca4550533548846b5f85bd8ba.mp4',
						poster: 'http://qe9i29b4d.bkt.clouddn.com/image/2b/2bd5f6fab5ab32b24998be5b8f6f636a.png'
					},
					{
						video: 'http://qe9i29b4d.bkt.clouddn.com/video/73/7309a5c693660ea4071fe5613733db98.mp4',
						poster: 'http://qe9i29b4d.bkt.clouddn.com/image/e5/e5f74955ab746c7c561243eff0ad7dfd.png'
					},
					{
						video: 'http://qe9i29b4d.bkt.clouddn.com/video/f3/f3469a54e71d0b9e953f9b4250f07845.mp4',
						poster: 'http://qe9i29b4d.bkt.clouddn.com/image/e5/e5f74955ab746c7c561243eff0ad7dfd.png'
					},
					{
						video: 'http://qe9i29b4d.bkt.clouddn.com/video/f4/f4766f3383374a9764b5721517ac8a72.mp4',
						poster: 'http://qe9i29b4d.bkt.clouddn.com/image/ca/ca51a428173f57d46205933c8ec53d2d.png'
					}
				],
				noticeList: [
					{nickname: '彭万*'},
					{nickname: '林*'},
					{nickname: '范长*'},
					{nickname: '王*'},
					{nickname: '范长*'},
					{nickname: '洪学*'},
					{nickname: '吴国*'},
					{nickname: '张*'},
					{nickname: '孙杵*'},
					{nickname: '孙书*'},
					{nickname: '郝爱*'},
				],
				icon_list: [
					{
						icon: '/static/train/icon_jzdw.png',
						title: '精准定位'
					},
					{
						icon: '/static/train/icon_zjxz.png',
						title: '专家协助'
					},
					{
						icon: '/static/train/icon_xgjf.png',
						title: '效果计费'
					},
					{
						icon: '/static/train/icon_lhkk.png',
						title: '灵活可控'
					}
				],
				showList: [
					'/static/train/page02.png',
					'/static/train/page03.png',
					'/static/train/page04.png',
					'/static/train/page05.png',
					'/static/train/page06.png',
					'/static/train/zsal_1.png',
					'/static/train/zsal_2.png',
					'/static/train/page01.png',
				]
			};
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: "搜搜直通车快速获客"
			})
			this.setRandom()
			this.goRandom()
			this.goShare()
			this.goShareCircle()
		},
		methods: {
			scroll(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			scroll_video(e) {

			},
			// 全屏展示图片
			fullImg(url) {
				uni.previewImage({
					urls: this.showList,
					current: 0
				})
			},
			//首页随机数
			setRandom() {
				let plus = Math.floor(Math.random()*(100-10))+10
				let randomObj = uni.getStorageSync('randomObjV2')
                if (randomObj) {
					randomObj.client = randomObj.client*1 + plus
					randomObj.friendShip = randomObj.friendShip*1 + plus
					randomObj.demand = randomObj.demand*1 + plus
					randomObj.orders = randomObj.orders*1 + plus
					uni.setStorage({
						key: "randomObjV2",
						data: randomObj
					})
					this.randomObj = randomObj
                } else {
                    uni.setStorage({
						key: "randomObjV2",
						data: this.randomObj
					})
				}
			},
			// 随机数
			goRandom() {
				this.randomTime = Math.floor(Math.random()*(30-5))+5
			},
			goNext() {
				uni.navigateTo({
					url: '/pages/train/train'
				})
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `搜搜直通车快速获客`,
					desc: `精准获取本地人脉 开启无限获客新模式`,
					shareUrl: window.location.href,
					imgUrl: 'http://qe9i29b4d.bkt.clouddn.com/image/ed/ed3413bfbcb35385ee657537d71a98ab.png'
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
					title: `搜搜直通车快速获客`,
					shareUrl: window.location.href,
					imgUrl: 'http://qe9i29b4d.bkt.clouddn.com/image/ed/ed3413bfbcb35385ee657537d71a98ab.png'
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
			// 视频报错回调
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 230rpx;
	background: #DBEDFF;

	.header {
		position: relative;

		.bg_img {
			display: block;
			width: 100%;
		}

		.msg_block {
			position: absolute;
			bottom: 0;
			width: 100%;

			.title {
				width: 86%;
				padding: 9rpx 0;
				margin: 0 auto;
				color: #fff;
				font-size: 30rpx;
				letter-spacing: 1px;
				text-align: center;
				border-radius: 40rpx;
				background: rgba(0,0,0,.5);

				>text {
					color: #FF1616;
					font-size: 32rpx;
					padding: 0 10rpx;
				}
			}

			.train_data {
				display: flex;
				align-items: center;
				justify-content: space-around;

				.item {
					color: #fff;
					padding: 16rpx 0 16rpx;
					font-size: 32rpx;
					letter-spacing: 1px;
					text-align: center;

					>:first-child {
						color: #F9EF78;
						text-shadow: 1px 2px 5px #00478f;
					}
				}
			}
		}

		.notice {
			display: flex;
			align-items: center;
			background: rgba(0, 0, 0, 0.5);
			padding: 4rpx 12rpx;

			.icon_l {
				width: 28rpx;
				height: 24rpx;
				margin-left: 16rpx;
			}

			.cont {
				flex: 1;
				margin-left: 16rpx;
			}

			.notice_swiper {
				width: 100%;
				height: 60rpx;
				line-height: 24rpx;

				view {
					width: 100%;
					color: #fff;
					display: inline-block;
					font-size: 24rpx;
					line-height: 60rpx;
					letter-spacing: 1px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					>text {
						margin-right: 8rpx;
					}
				}
			}
		}
	}

	.container {
		padding: 0 36rpx;

		.train_block {
			position: relative;
			margin: 74rpx auto 0;
			border-radius: 20rpx;
			background: #B9DCFF;

			.title {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80%;
				margin: 0 auto;
				color: #fff;
				font-size: 34rpx;
				line-height: 70rpx;
				text-align: center;
				letter-spacing: 1px;
				border-radius: 12rpx;
				background: linear-gradient(90deg, #7BBCFF, #2F97FF);
				z-index: 1;

				&::before,
				&::after {
					content: '';
					display: block;
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background: #fff;
				}

				&::before {
					margin-right: 30rpx;
				}

				&::after {
					margin-left: 30rpx;
				}
			}

			&:first-child {
				.content {
					padding: 60rpx 40rpx 28rpx;
				}	
			}

			.content {
				padding: 78rpx 40rpx 40rpx;

				.text {
					color: #004E77;
					font-size: 28rpx;
					line-height: 56rpx;

					>text {
						color: #FF1616;
					}
				}

				.scroll-view {
					white-space: nowrap;
					
					.scroll-view-item {
						color: #fff;
						display: inline-block;
						width: 360rpx;

						&:not(:last-child) {
							margin-right: 20rpx;
						}

						>image {
							display: block;
							width: 100%;
							height: 100%;
						}
					}
				}

				>image {
					display: flex;
					width: 100%;
				}

				.video_block {
					width: 510rpx;
					height: 370rpx;
					display: inline-block;

					&:not(:last-child) {
						margin-right: 20rpx;
					}

					#myVideo {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.icon_block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30rpx;

			.item {
				display: flex;
				align-items: center;
				flex-direction: column;
				color: #446382;
				font-size: 26rpx;

				>image {
					display: block;
					width: 98rpx;
				}
			}
		}
	}

	.confim_btn {
		position: fixed;
		left: 7.5%;
		bottom: 60rpx;
		z-index: 2;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 85%;
		height: 120rpx;
		color: #fff;
		text-align: center;
		letter-spacing: 1px;
		text-shadow: 2px 4px 2px #FF6134;
		border-radius: 20rpx;
		background: linear-gradient(180deg, #FF9F65, #FF6134);
		animation: mymove 5s infinite;
		animation-direction: alternate;
		animation-timing-function: ease-in-out;

		@keyframes mymove {
			0% {
				transform: scale(1);
				/*开始为原始大小*/
			}

			25% {
				transform: scale(1.1);
				/*放大1.1倍*/
			}

			50% {
				transform: scale(1);
			}

			75% {
				transform: scale(1.1);
			}
		}

		>view {
			display: flex;
			align-items: center;
			font-size: 38rpx;
			margin-top: 12rpx;

			&::after,
			&::before {
				content: "";
				width: 100rpx;
				height: 1px;
				opacity: 0.75;
			}

			&::before {
				margin-right: 14rpx;
				background: linear-gradient(-90deg, #FFDCCC, #FF8B56);
			}

			&::after {
				margin-left: 14rpx;
				background: linear-gradient(90deg, #FFDCCC, #FF8B56);
			}
		}

		>text {
			font-size: 24rpx;
			margin-top: 2rpx;
		}

		.finger {
			position: absolute;
			top: -28rpx;
			right: 10rpx;
			width: 200rpx;
		}
	}
}
</style>
