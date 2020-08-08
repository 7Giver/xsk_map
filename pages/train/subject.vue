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
					<image class="icon_l" src="/static/train/icon_lb.png" mode=""></image>
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
						<view id="demo1" class="scroll-view-item_H uni-bg-red">A</view>
						<view id="demo2" class="scroll-view-item_H uni-bg-green">B</view>
						<view id="demo3" class="scroll-view-item_H uni-bg-blue">C</view>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [
					{nickname: '周梦梦'},
					{nickname: 'ERIC'},
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
				]
			};
		},
		onShow() {

		},
		methods: {
			scroll(e) {
				console.log(e)
			},
		}
	}
</script>

<style lang="scss">
#app {

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
					padding: 20rpx 0;
					font-size: 32rpx;
					letter-spacing: 1px;
					text-align: center;

					>:first-child {
						color: #F9EF78;
					}
				}
			}
		}
	}

	.notice {
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
</style>
