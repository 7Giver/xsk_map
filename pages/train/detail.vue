<template>
	<view id="app">
		<view class="banner">
			<image src="/static/train/banner02.png" mode="widthFix">
			<image src="/static/train/border.png" mode="widthFix">
		</view>
		<view class="top_block">
			<image src="/static/index/gaode.png" mode="widthFix">
			<view class="right">
				<view class="item">
					<view class="left">商户名称：<text>无锡哇哈哈哈果乳饮料</text></view>
				</view>
				<view class="item">
					<view class="left">联系电话：<text>18701891906</text></view>
				</view>
				<view class="item">
					<view class="left">商户地址：<text>江苏省无锡市梁溪区广益街道广益路梁溪电子商务园区208号</text></view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">投放的区域</view>
			<view class="area_block">
				<view class="item">
					<view>区域一</view>
					<view class="area">
						<text>江苏</text>
						<text>无锡</text>
					</view>
					<view>13个</view>
				</view>
				<view class="item">
					<view>区域一</view>
					<view class="area">
						<text>江苏</text>
						<text>无锡</text>
					</view>
					<view>13个</view>
				</view>
				<view class="item">
					<view>区域一</view>
					<view class="area">
						<text>江苏</text>
						<text>无锡</text>
					</view>
					<view>13个</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">增加客源进度<text>(100+)</text></view>
			<progress percent="20" activeColor="#FF4948" show-info stroke-width="3" />
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">投放时长进度<text>(3个月)</text></view>
			<progress percent="70" activeColor="#FF4948" show-info stroke-width="3" />
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">客源列表</view>
			<view class="list_block">
				<view class="main_title">
					<text>姓名</text>
					<text>区域</text>
					<text>日期</text>
					<text>电话号码</text>
					<text>拨打</text>
				</view>
				<view class="client_list">
					<view class="item" v-for="(item, index) in clientList" :key="index">
						<text>{{item.name}}</text>
						<text>{{item.city}}</text>
						<text>{{item.date}}</text>
						<text>{{item.tel}}</text>
						<view>
							<image src="/static/train/tel.png" mode="widthFix">
						</view>
					</view>
				</view>
				<view class="more">加载更多</view>
			</view>
		</view>
		<view class="bottom">继续投放</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				clientList: [
					{
						name: '欧阳晨',
						city: '无锡',
						date: '2020/07/18',
						tel: '13023367790'
					},
					{
						name: '王晓华',
						city: '南京',
						date: '2020/07/18',
						tel: '13023367790'
					},
					{
						name: '黄丽娟',
						city: '苏州',
						date: '2020/07/18',
						tel: '13023367790'
					},
					{
						name: '马冬梅',
						city: '上海',
						date: '2020/07/18',
						tel: '13023367790'
					},
					{
						name: '肖华强',
						city: '北京',
						date: '2020/07/18',
						tel: '13023367790'
					},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 100rpx;

	.banner {
		width: 100%;

		image {
			display: block;
			width: 100%;
		}
	}

	.top_block {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;

		>image {
			width: 100rpx;
			height: 100rpx;
		}
		
		.right {
			flex: 1;
			padding-left: 30rpx;

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				line-height: 50rpx;

				.left {
					display: flex;
					white-space: nowrap;
					font-weight: bold;

					>text {
						color: #9CA1B4;
						font-weight: normal;
						line-height: 40rpx;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						word-break: break-all;
						overflow: hidden;
						white-space: normal;
					}
				}
			}
		}
	}

	.block {
		height: 20rpx;
		background: #F5F5F5;
	}

	.content {
		padding: 30rpx 38rpx 10rpx;

		.title {
			display: flex;
			align-items: center;
			color: #403C3F;
			font-size: 36rpx;

			>text {
				color: #999999;
				font-size: 30rpx;
				padding-left: 10rpx;
			}

			&::before {
				content: "";
				display: block;
				width: 8rpx;
				height: 32rpx;
				margin-right: 18rpx;
				background: #4B7EF6;
			}
		}

		.area_block {

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 20rpx auto;
				font-size: 30rpx;
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				border: 1px solid #F0F0F0;

				.area {
					>text:first-child {
						padding-right: 40rpx;
					}
				}

				>view:last-child {
					color: #FF4948;
				}
			}
		}

		>progress {
			padding: 30rpx 0 0;
		}

		.list_block {
			padding-top: 30rpx;

			.main_title {
				display: flex;
				align-items: center;
				justify-content: space-around;
				color: #774B4D;
				font-size: 26rpx;
				line-height: 60rpx;
				background: #F9F1E8;

				>text {
					flex: 1;
					text-align: center;

					&:nth-child(3),
					&:nth-child(4) {
						flex: 1.5;
					}
				}
			}

			.client_list {

				.item {
					display: flex;
					align-items: center;
					justify-content: space-around;
					color: #786566;
					font-size: 26rpx;
					padding: 12rpx 0;
					border-bottom: 1px solid #EEE7E4;

					>* {
						flex: 1;
						text-align: center;

						&:nth-child(3),
						&:nth-child(4) {
							flex: 1.5;
						}
					}

					>view {
						display: flex;
						justify-content: center;

						>image {
							width: 36rpx;
							border-radius: 50%;
						}
					}
				}
			}

			.more {
				display: flex;
				align-items: center;
				justify-content: center;
				color: #4B7EF6;
				font-size: 26rpx;
				line-height: 90rpx;
				text-align: center;
				letter-spacing: 1px;

				&::after {
					content: "";
					width: 12rpx;
					height: 12rpx;
					border-top: 1px solid #4B7EF6;
					border-right: 1px solid #4B7EF6;
					transform: rotate(45deg);
					margin-left: 4rpx;
				}
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		color: #fff;
		font-size: 32rpx;
		line-height: 90rpx;
		text-align: center;
		letter-spacing: 1px;
		background: linear-gradient(90deg, #FF5664, #FF3D2F);
	}
}
</style>
