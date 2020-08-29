<template>
	<view id="app">
		<view class="banner">
			<image src="/static/train/introduce/banner.png" mode="widthFix"></image>
		</view>
		<view class="content_block">
			<view class="title">搜搜科技集团 现代化科技公司</view>
			<view class="top_block">
				<view class="pic1">
					<image src="/static/train/introduce/pic1.png" mode="widthFix"></image>
				</view>
				<view class="text_block">
					<image class="one" src="/static/train/introduce/01.png" mode="widthFix"></image>
					<image class="about" src="/static/train/introduce/about us.png" mode="widthFix"></image>
					<view>搜搜科技集团成立于2009年，注册资本1500万，公司致力于互联网科技研发服务与一体的现代化科技公司，公司有160人团队全身心投入地图标注、商家直通车业务服务，将以专业、周到、值得信赖的服务为宗旨，立志成为中国企业的强壮翅膀，专业的团队为您提供优质商业服务！</view>
					<image class="bottom" src="/static/train/introduce/banner1.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="title">企业荣誉</view>
			<view class="swiper_block">
				<swiper class="swiper" :current="current" :circular="true" :autoplay="true" @change="swiperChange">
					<swiper-item v-for="(item, index) in honourList" :key="index" @click="fullImg(1,index)">
						<image :src="item" mode="widthFix"></image>
					</swiper-item>
				</swiper>
				<!-- <view class="swiper-btn left" v-if="honourList.length>1" @click="prev">
					<image src="/static/train/introduce/left.png" mode=""></image>
				</view>
				<view class="swiper-btn right" v-if="honourList.length>1" @click="next">
					<image src="/static/train/introduce/right.png" mode=""></image>
				</view> -->
			</view>
			<view class="title">团队风采</view>
			<view class="swiper_block">
				<swiper class="swiper" autoplay="true" circular="true" :interval="6000">
					<swiper-item v-for="(item, index) in teamShow" :key="index">
						<image :src="item" v-if="index !== 3" @click="fullImg(2,index)"></image>
						<video 
							:src="item"
							:show-fullscreen-btn="true"
							:enable-progress-gesture="false"
							:muted="true"
							object-fit="contain"
							controls
							v-else
						>
						</video>
					</swiper-item>
				</swiper>
			</view>
			<view class="title">联系我们</view>
			<view class="bottom_block">
				<view class="item">
					<image src="/static/train/introduce/tel.png" mode="widthFix"></image>
					<view class="right">
						<view class="label">电话：</view>
						<text>4000-929-777</text>
					</view>
				</view>
				<view class="item">
					<image src="/static/train/introduce/address.png" mode="widthFix"></image>
					<view class="right">
						<view class="label">地址：</view>
						<view class="clamp_two">江西省上饶市广丰区上广公路南侧鑫城大厦6-7楼</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				honourList: [
					'http://cdn.tuku658.com/image/8e/8e9b9e98c7d0d5d61978677c5190e206.jpg',
					'http://cdn.tuku658.com/image/ef/ef054bd0968ce3543d3805795e356a70.jpg',
					'http://cdn.tuku658.com/image/38/38551ebf149cb584a72f186164439183.jpg',
					'http://cdn.tuku658.com/image/c1/c1b611158fb7a7cc47500f2f6b0f0a06.jpg',
					'http://cdn.tuku658.com/image/43/43318ad53fa5376fabba0b11884ec170.jpg',
					'http://cdn.tuku658.com/image/f9/f9649d1e29fc947d4bdbd6f83aafca47.jpg',
					'http://cdn.tuku658.com/image/f0/f0500a776129c1de434d377dd9be4453.jpg',
					'http://cdn.tuku658.com/image/cd/cd1abf2f957d328ccbde3442ebca5a22.jpg',
					'http://cdn.tuku658.com/image/57/57c6623cacc3e61cda14a001a5f9a127.jpg',
					'http://cdn.tuku658.com/image/78/78c51423409aafc2b5f82cb1b6edc1f2.jpg'
				],
				teamShow: [
					'http://cdn.tuku658.com/image/a8/a8df7e38b5e02128dec3eaac99220c53.png',
					'http://cdn.tuku658.com/image/cc/cc78ea5a805c47c0641e2af39e2c1a8f.jpg',
					'http://cdn.tuku658.com/image/7b/7bd827879be57d5bb062352c79995076.jpg',
					'http://cdn.tuku658.com/video/18/187d961eec107eb1fc8c67bb89290f8c.mp4'
				]
			};
		},
		onLoad() {

		},
		methods: {
			// 监听轮播事件
			swiperChange(e) {
				// console.log(e.detail.current);
				this.current = e.detail.current
			},
			// 全屏展示图片
			fullImg(type, index) {
				let arr = []
				switch(type) {
					case 1:
						arr = this.honourList
						break;
					case 2:
						let newArr = Object.assign([], this.teamShow)
						newArr.pop()
						arr = newArr
						break;
				}
				uni.previewImage({
					urls: arr,
					current: index
				})
			},
			// 上一张
			prev() {
				// let showItems = this.honourList;
				// this.current = this.current > 0 ? this.current - 1 : showItems.length - 1;
				let num = this.honourList.length - 1
				if (this.current <= 0) {
					// console.log('<=0',this.current);
					this.current = num
				} else {
					// console.log('>0',this.current);
					this.current--
				}
			},
			// 下一张
			next() {
				// let showItems = this.honourList;
				// this.current = this.current < (showItems.length - 1) ? this.current + 1 : 0;
				let num = this.honourList.length - 1
				if (this.current >= num) {
					this.current = 0
				} else {
					this.current++
				}
			},
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 120rpx;
	.banner {
		>image {
			display: block;
			width: 100%;
		}
	}
	.content_block {
		padding: 0 36rpx;
		image {
			display: block;
			width: 100%;
		}
		.top_block {
			.pic1 {
				width: 400rpx;
				float: right;
			}
			.text_block {
				position: relative;
				clear: both;
				padding-right: 110rpx;
				.one {
					position: absolute;
					top: -85rpx;
					left: 76rpx;
					width: 120rpx;
				}
				.about {
					position: absolute;
					top: -30rpx;
					right: 60rpx;
					width: 220rpx;
				}
				.bottom {
					position: absolute;
					bottom: -16rpx;
					left: -16rpx;
					width: 656rpx;
				}
				>view {
					color: #343434;
					font-size: 32rpx;
					line-height: 55rpx;
					padding: 0 30rpx;
					padding-top: 110rpx;
					padding-bottom: 160rpx;
					background: #DDEBF7;
				}
			}
		}
		.title {
			font-size: 32rpx;
			line-height: 32rpx;
			letter-spacing: 1rpx;
			padding-left: 16rpx;
			margin: 35rpx auto;
			border-left: 4px solid #2E95DE;
		}
		.bottom_block {
			padding: 46rpx 30rpx;
			padding-right: 180rpx;
			background: url('/static/train/introduce/bg.png') no-repeat center / 100% 100%;
			.item {
				display: flex;
				align-items: baseline;
				image {
					width: 36rpx;
					margin-right: 14rpx;
				}
				&:last-child {
					align-items: flex-start;
					image {
						width: 30rpx;
					}
				}
				&:first-child {
					margin-bottom: 20rpx;
					.right {
						&:last-child {
							color: #FD8E16;
						}
					}
				}
				.right {
					flex: 1;
					display: flex;
					font-size: 30rpx;
					.label {
						color: #343638;
						font-weight: bold;
						white-space: nowrap;;
					}
					&:last-child {
						color: #666666;
					}
				}
			}
		}
		.swiper_block {
			height: 500rpx;
			position: relative;
			.swiper {
				width: 100%;
				height: 100%;
				image {
					display: block;
					width: 100%;
					height: 100%;
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
				left: -6rpx;
			}
			.right {
				right: -6rpx;
			}
			video {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
