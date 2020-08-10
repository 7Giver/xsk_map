<template>
	<view id="app">
		<view class="header">
			<image class="bg_img" src="/static/train/pic_1.png" mode="widthFix"></image>
			<view class="msg_block">
				<view class="title">直通车累计为<text>{{336897}}</text>位用户提供了</view>
				<view class="train_data">
					<view class="item">
						<view>人脉</view>
						<view>{{9987455}}</view>
					</view>
					<view class="item">
						<view>需求</view>
						<view>{{9987455}}</view>
					</view>
					<view class="item">
						<view>订单</view>
						<view>{{9987455}}</view>
					</view>
				</view>
				<!-- 公告 -->
				<view class="notice">
					<image class="icon_l" src="/static/train/icon_lb.png" mode="widthFix"></image>
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
				<view class="title">每日签单真实案例</view>
				<view class="content">
					<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll" scroll-left="120">
						<view class="scroll-view-item" v-for="(item, index) in showList" :key="index" @click="fullImg">
							<image :src="item" mode="widthFix"></image>
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
					<image src="/static/train/pic_3.png" mode="widthFix"></image>
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
				randomTime: 5, //随机时间
				old: {
					scrollTop: 0
				},
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
			this.goRandom()
		},
		methods: {
			scroll(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			// 全屏展示图片
			fullImg(url) {
				uni.previewImage({
					urls: this.showList,
					current: 0
				})
			},
			// 随机数
			goRandom() {
				this.randomTime = Math.floor(Math.random()*(30-5))+5
			},
			goNext() {
				uni.navigateTo({
					url: '/pages/train/train'
				})
			}
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
				padding: 10rpx 0;
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
					padding: 24rpx 0 38rpx;
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
			padding-bottom: 24rpx;
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

			.content {
				padding: 80rpx 40rpx 20rpx;

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
