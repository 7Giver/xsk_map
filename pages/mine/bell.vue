<template>
	<view id="app">
		<uni-nav-bar title="企业彩铃" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<view class="banner">
			<image src="/static/mine/bell/banner.png?v=11" mode="widthFix">
		</view>
		<view class="content">
			<view class="nav_block">
				<view
					:class="{'on': titleIndex == index}"
					v-for="(item, index) in titleList"
					:key="index"
					@click="navCheck(index)"
				>
					{{item}}
				</view>
			</view>
			<view class="list_block">
				<view
					class="item"
					v-for="(item, index) in ringList"
					:key="index"
				>
					<view :class="[item.play ? 'left on' : 'left']">
						<image :src="item.avatar" mode="widthFix">
						<view class="">
							<view class="title">{{item.title}}</view>
							<view class="tips">{{item.profession}}</view>
						</view>
					</view>
					<view class="right">
						<view @click="goPlayAudio(item)" v-if="!item.play">
							<image src="/static/mine/bell/listen.png" mode="widthFix" >
							<text>试听</text>
						</view>
						<view @click="goStopAudio(item)" v-else>
							<image src="/static/mine/bell/play.gif" mode="widthFix">
							<text>停止</text>
						</view>
					</view>
				</view>
			</view>
			<view class="more_btn" @click="goShowMore" v-if="!showMore">
				<image src="/static/mine/bell/load_more.png" mode="widthFix">
				<text>加载更多</text>
			</view>
		</view>
		<div class="block"></div>
		<view class="poster_block">
			<image src="/static/mine/bell/con01.png" mode="widthFix">
			<image src="/static/mine/bell/con02.png" mode="widthFix">
			<image src="/static/mine/bell/con03.png" mode="widthFix">
			<image src="/static/mine/bell/con04.png" mode="widthFix">
			<view class="submit_btn" @click="goApply">立即申请</view>
		</view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="dialog_block" v-if="diaIndex == 0">
				<image src="/static/mine/bell/dialog_img.png" mode="widthFix">
				<view class="inline_block">
					<view class="title after">联系电话</view>
					<input id="tel" type="number" v-model="guest.phone" @input="getDetail" maxlength="11" placeholder="请填写真实有效的电话" />
					<view class="submit" @click="toNext">下一步</view>
				</view>
			</view>
			<view class="dialog_block" v-if="diaIndex == 1">
				<image src="/static/mine/bell/dialog_img.png" mode="widthFix">
				<view class="inline_block">
					<view class="title">彩铃广告内容<text>（可不填）</text></view>
					<textarea v-model="guest.mark" placeholder="可联系客服为您量身设计制作哦" style="height: 130rpx" />
					<view class="submit" @click="submit">免费申请</view>
				</view>
			</view>
			<image class="close" src="/static/index/close.png" @click="cancel"></image>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	export default {
		components: {
			uniNavBar,
			UniPopup
		},
		data() {
			return {
				guest: {},  //用户信息对象
				innerAudioContext: {}, //音频对象
				titleIndex: 0, //导航切换
				diaIndex: 0, //弹窗切换
				showMore: false, //显示更多
				showDailog: false, //弹窗显示
				titleList: ['全部','房产','餐饮','装修','汽修','其他'],
				bellList: [], //数据数组
				ringList: [] //显示数组
			};
		},
		computed: {
    		...mapState(['wxid', 'userInfo'])
  		},
		onLoad() {
			this.getBellList()
			this.goShare()
		},
		onUnload() {
			this.ringList.forEach(item => {
				item.innerAudioContext.destroy()
			})
		},
		methods: {
			// 获取用户信息
			getBellList() {
				let type = 0
				switch (this.titleIndex) {
					case 1:
						type = 14
						break;
					case 2:
						type = 2
						break;
					case 3:
						type = 1
						break;
					case 4:
						type = 3
						break;
					case 5:
						type = 20
						break;
					default:
						type = 0
				}
				this.$http
					.post(`/?r=api/index/ring-list`, {
						type: type
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.bellList = this.methodArr(response.data)
							this.bellList.forEach((item, index) => {
								let avatar = this.goRandom(index)
								this.$set(item, 'avatar', avatar)
								this.$set(item, 'innerAudioContext', uni.createInnerAudioContext())
							})
							this.bellList.slice(0,5).forEach(item => {
								this.ringList.push(item)
							})
						}
					})
			},
			// 随机数组排序
			methodArr(arr){
				arr.sort(function(){
					return Math.random()-0.5;
				});
				return arr
			},
			//获取循环头像
			goRandom(index) {
				let plus = index%11+1
				let avatar = '/static/mine/bell/kf'+plus+'.png'
				return avatar
			},
			// 返回我的页面
			back() {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
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
				this.diaIndex = 0
			},
			// 导航切换
			navCheck(index) {
				this.titleIndex = index
				this.bellList = []
				this.ringList = []
				this.getBellList()
			},
			// 加载更多
			goShowMore() {
				let ring = this.ringList.length
				let bell = this.bellList.length
				// console.log(this.bellList.slice(ring,ring+5))
				if (ring<bell) {
					this.bellList.slice(ring,ring+5).forEach(item => {
						this.ringList.push(item)
						// console.log(item)
					})
				} else {
					this.showMore = true
				}
			},
			// 音频播放
			goPlayAudio(item) {
				this.bellList.forEach(i => {
					i.innerAudioContext.pause();
				})
				item.innerAudioContext.autoplay = true;
				item.innerAudioContext.src = item.url;
				item.innerAudioContext.onPlay(() => {
					// console.log('开始播放');
					this.ringList.forEach(i => {
						this.$set(i, 'play', false)
					})
					this.$set(item, 'play', true)
				})
				
				item.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
			// 暂停音频
			goStopAudio(item) {
				item.innerAudioContext.pause();
				item.innerAudioContext.onPause(() => {
					// console.log('暂停');
					this.$set(item, 'play', false)
				})

				item.innerAudioContext.onError((res) => {
					console.log(res.errMsg);
					console.log(res.errCode);
				});
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `订制您的专属商务彩铃`,
					desc: `每一次通话都是一次广告收益 给客户带来美的听觉享受`,
					shareUrl: this.$common.WxShareUrl(),
					imgUrl: `${this.$dataURL}/image/01/019a1ba2b70fabd8631ee9905824cbf6.jpg`
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
						//朋友圈分享
						let shareData1 = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareTimeline(shareData1, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 保存号码
			getDetail() {

			},
			// 立即申请
			goApply() {
				this.showDailog = true
			},
			// 下一步
			toNext() {
				if (!this.guest.phone) {
					uni.showToast({
						title: '请填写电话',
						icon: 'none',
					});
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.phone))) {
					uni.showToast({
						title: '请填写正确的电话',
						icon: 'none',
					});
					return false
				}
				this.$http
					.post(`/?r=api/index/mobile`, {
						wxid: this.wxid || uni.getStorageSync('wxid'),
						mobile: this.guest.phone,
						type: 1
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let result = response.data
							this.guest.id = result.id
							this.diaIndex = 1
						}
					})
			},
			// 提交
			submit() {
				this.$http
					.post(`/?r=api/index/ring`, {
						wxid: this.wxid || uni.getStorageSync('wxid'),
						mobile: this.guest.phone,
						mark: this.guest.mark || '',
						id: this.guest.id
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.showToast({
								title: '提交成功',
								icon: 'none',
							});
							this.showDailog = false
						}
					})
			}
		}
	}
</script>

<style lang="scss">
#app {

	.banner {
		position: relative;
		z-index: -1;
		margin-bottom: -1.8rem;

		>image {
			display: block;
			width: 100%;
		}
	}

	.content {
		border-radius: 1.2rem 1.2rem 0 0;
		background: #fff;

		.nav_block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #B0B0B2;
			font-size: 30rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			padding: 50rpx 90rpx;

			.on {
				position: relative;
				color: #3A3A3E;

				&::after {
					content: "";
					position: absolute;
					left: 50%;
					bottom: -24rpx;
					transform: translate(-50%, -50%);
					display: block;
					width: 2rem;
					height: 6rpx;
					border-radius: 2rem;
					background: #1F54D8;
					box-shadow: 1px 4px 8px #1F54D8;
				}
			}
		}

		.list_block {
			background: #f5f5f5;

			.item {
				display: flex;
				align-items: center;
				padding: 20rpx 40rpx;
				background: #fff;
				
				&:not(:last-child) {
					margin-bottom: 20rpx;
				}

				.left {
					flex: 1;
					display: flex;
					position: relative;

					>image {
						
						display: block;
						width: 130rpx;
						height: 130rpx;
					}

					>view {
						flex: 1;
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						flex-direction: column;
						padding: 0 20rpx 0 30rpx;

						.title {
							color: #3A3A3E;
							font-size: 26rpx;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							word-break: break-all;
							overflow: hidden;
							white-space: normal;
						}

						.tips {
							color: #8E97AC;
							font-size: 24rpx;
							padding: 3rpx 16rpx;
							border: 1px solid #8E97AC;
							border-radius: 60rpx;
						}
					}
				}

				.on::after {
					content: "";
					position: absolute;
					top: -40rpx;
					left: 62rpx;
					width: 70rpx;
					height: 70rpx;
					background: url('/static/mine/bell/play.gif') no-repeat center / 100% 100%;
				}

				.right {
					padding: 3.6rpx;
					border-radius: 60rpx;
					background: linear-gradient(90deg, #FFD69D, #FF6A38);

					>view {
						display: flex;
						align-items: center;
						padding: 8rpx 20rpx;
						background: #fff;
						border-radius: 60rpx;

						>image {
							display: block;
							width: 40rpx;
							margin-right: 10rpx;
						}

						>text {
							color: #FF7B4C;
							font-size: 26rpx;
						}
					}
				}
			}
		}

		.more_btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 80%;
			margin: 40rpx auto;
			color: rgba(53,96,223,.65);
			font-size: 30rpx;
			line-height: 80rpx;
			letter-spacing: 2rpx;
			text-align: center;
			background: #F1F0F4;
			border-radius: 10rpx;

			>image {
				display: block;
				width: 26rpx;
				margin-right: 14rpx;
			}
		}
	}

	.block {
		height: 20rpx;
		background: #F5F5F5;
	}

	.poster_block {
		background: #9BB3FD;
		padding-bottom: 220rpx;

		>image {
			display: block;
			width: 100%;
		}

		.submit_btn {
			position: fixed;
			left: 50%;
			bottom: 28rpx;
			transform: translate(-50%,-50%);
			width: 80%;
			color: #FFF;
			text-align: center;
			font-size: 34rpx;
			line-height: 100rpx;
			letter-spacing: 1px;
			border-radius: 80rpx;
			background: linear-gradient(90deg, #FF4735, #FE8248);
		}
	}

	// 弹窗

	.dialog_block {

		>image {
			display: block;
			width: 100%;
		}

		.inline_block {
			padding: 30rpx 50rpx 60rpx;
			border-radius: 0 0 26rpx 26rpx;
			background: #fff;

			.title {
				color: #3A3A3E;
				font-size: 32rpx;
				font-weight: bold;
				margin-left: 20rpx;
				margin-bottom: 30rpx;

				>text {
					color: #FE6E41;
					font-size: 30rpx;
					font-weight: normal;
				}
			}

			.after:after{
				content: "*";
				color: #FE6E41;
				font-size: 34rpx;
				font-weight: normal;
				margin-left: 10rpx;
			}

			input {
				height: 80rpx;
				font-size: 30rpx;
				text-indent: 30rpx;
				margin-bottom: 60rpx;
				caret-color: #FE6E41;
				border-radius: 14rpx;
				background: #F0F0F0;
			}

			textarea {
				width: 100%;
				color: #666;
				font-size: 28rpx;
				padding: 18rpx 36rpx;
				margin: 20rpx auto 40rpx;
				border-radius: 16rpx;
				background: #f5f5f5;
			}

			.submit {
				color: #FFF;
				text-align: center;
				font-size: 34rpx;
				line-height: 100rpx;
				letter-spacing: 4rpx;
				border-radius: 90rpx;
				background: linear-gradient(90deg, #FF4735, #FE8248);
			}
		}
	}

	// 关闭按钮

	.close {
		display: block;
		position: absolute;
		left: 50%;
		bottom: -150rpx;
		transform: translate(-50%, -50%);
		width: 68rpx;
		height: 68rpx;
	}
}
</style>
