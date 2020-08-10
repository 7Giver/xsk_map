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
						<swiper vertical="true" autoplay="true" circular="true" class="notice_swiper">
							<swiper-item v-for="(item, index) in noticeList" :key="index">
								<view><text>{{item.nickname}}</text>5分钟前成功开通直通车</view>
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
		<view class="confim_btn" @click="goNext()"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				old: {
					scrollTop: 0
				},
				noticeList: [
					{nickname: '周梦梦'},
					{nickname: 'ARIT'},
					{nickname: '嘎嘣脆'},
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
					'/static/train/zsal_1.png',
					'/static/train/zsal_2.png',
					'/static/train/page01.png',
					'/static/train/page02.png',
					'/static/train/page03.png',
					'/static/train/page04.png',
					'/static/train/page05.png',
					'/static/train/page06.png',
				]
			};
		},
		onShow() {

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
	padding-bottom: 50rpx;
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
		width: 90%;
		height: 120rpx;
		margin: 50rpx auto 0;
		background: url('/static/train/button.png') no-repeat center / 100% 100%;
	}
}
</style>
