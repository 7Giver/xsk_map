<template>
	<view id="app">
		<scroll-view class="scroll_content" scroll-y @scrolltolower="getMoreList">
			<view class="banner">
				<image src="/static/train/banner02.png" mode="widthFix">
				<image src="/static/train/border.png" mode="widthFix">
			</view>
			<view class="top_block">
				<image :src="guest.avatar" mode="widthFix">
				<view class="right">
					<view class="item">
						<view class="left">商户名称：<text>{{guest.company}}</text></view>
					</view>
					<view class="item">
						<view class="left">联系电话：<text>{{guest.company_tel}}</text></view>
					</view>
					<view class="item">
						<view class="left">商户地址：<text>{{guest.company_address}}</text></view>
					</view>
				</view>
			</view>
			<view class="block"></view>
			<view class="content">
				<view class="title">投放的区域</view>
				<view class="area_block">
					<view class="item" v-for="(item, index) in guest.areaList" :key="index">
						<view class="left">
							<text v-if="index==0">区域一</text>
							<text v-else-if="index==1">区域二</text>
							<text v-else>区域三</text>
							<text>{{item.province}}</text>
						</view>
						<view class="right">
							<text>{{item.city}}</text>
							<view>{{item.customers}}个</view>
						</view>
					</view>
				</view>
			</view>
			<view class="block"></view>
			<view class="content">
				<view class="title">增加客源进度<text>(100+)</text></view>
				<progress :percent="guest.customer_percent" activeColor="#FF4948" show-info stroke-width="3" />
			</view>
			<view class="block"></view>
			<view class="content">
				<view class="title">投放时长进度<text>(3个月)</text></view>
				<progress :percent="guest.time_percent" activeColor="#FF4948" show-info stroke-width="3" />
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
					<view class="client_list" v-if="!loadingMore && clientList.length !== 0">
						<view class="item" v-for="(item, index) in clientList.slice(0,6)" :key="index">
							<text>{{item.name}}</text>
							<text>{{item.city}}</text>
							<text>{{item.add_time}}</text>
							<text>{{item.mobile}}</text>
							<view @click="goCall(item.mobile)">
								<image src="/static/train/tel.png" mode="widthFix">
							</view>
						</view>
					</view>
					<view class="more" v-if="!loadingMore && clientList.length !== 0" @click="showMore">加载更多</view>
					<view class="client_list" v-if="loadingMore && clientList.length !== 0">
						<view class="item" v-for="(item, index) in clientList" :key="index">
							<text>{{item.name}}</text>
							<text>{{item.city}}</text>
							<text>{{item.add_time}}</text>
							<text>{{item.mobile}}</text>
							<view @click="goCall(item.mobile)">
								<image src="/static/train/tel.png" mode="widthFix">
							</view>
						</view>
					</view>
					<view class="listNone" v-if="clientList.length == 0">暂无数据</view>
				</view>
			</view>
			<uni-load-more v-if="clientList.length>0 && loadingMore" :status="loadingType"></uni-load-more>
		</scroll-view>
		<view class="bottom" @click="goNext">继续投放</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				guest: {
					areaList: [], // 区域列表
				},  // 表单信息
				order: '', // 订单号
				page: 1, // 分页
				loadingMore: false, // 加载更多
				loadingType: "more",
				clientList: []
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad(option) {
			let order = option.order_sn
			this.order = order
			this.guest = this.userInfo
			// this.getLocal()
			this.getDetail()
			this.getClientList()
		},
		methods: {
			// 获取缓存
			getLocal() {
				let obj = uni.getStorageSync('postMsg')
				obj ? this.guest = obj : false
			},
			// 跳转直通车页
			goNext() {
				uni.redirectTo({
    				url: '/pages/train/train'
				});
			},
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				});
			},
			// 点击显示完整列表
			showMore() {
				this.loadingMore = true
			},
			// 分页加载
			getMoreList(e) {
				// console.log(e)
				this.loadingMore ? this.getClientList(this.order) : false
			},
			// 获取订单详情
			getDetail() {
				this.$test
					.post(`/?r=api/order/direct-detail`, {
						order_sn: this.order
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.guest = response.data
						}
					});
			},
			// 获取客源列表
			getClientList() {
				if (this.loadingType === 'noMore') {
				  //防止重复加载
				  return false;
				}
				this.loadingType = 'loading';
				this.$test
					.post(`/?r=api/order/customer-list`, {
						order_sn: this.order,
						page: this.page
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let resultData = response.list;
							if (resultData.length > 0) {
								if (this.page == 1) {
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.page++
										this.loadingType = 'more';
									}
									this.clientList = resultData
								} else {
									this.page++
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.loadingType = 'more';
									}
									this.clientList = this.clientList.concat(resultData)
								}
							} else {
								this.loadingType = 'noMore';
							}
						}
					});
			},
		}
	}
</script>

<style lang="scss">
#app {

	.scroll_content {
		height: 100vh;
		padding-bottom: 100rpx;
	}

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
			border-radius: 12rpx;
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
					}
				}

				&:last-child {
					text {
						font-weight: normal;
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
		padding: 30rpx 38rpx 0;

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
				margin: 22rpx auto;
				border: 1px solid #F5F5F5;
				border-radius: 10rpx;

				>view {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 30rpx;
					line-height: 66rpx;
					padding: 0 14rpx;
				}

				.right {
					>view {
						color: #FF4947;
					}
				}
			}
		}

		>progress {
			padding: 30rpx 0 0;
		}

		.list_block {
			height: calc(100% - 700px);
			padding-top: 30rpx;

			.main_title {
				display: flex;
				align-items: center;
				justify-content: space-around;
				color: #774B4D;
				font-size: 26rpx;
				font-weight: bold;
				line-height: 66rpx;
				background: #F9F1E8;

				>text {
					flex: 1;
					text-align: center;

					&:nth-child(2) {
						flex: 1.5;
					}
						
					&:nth-child(3),
					&:nth-child(4) {
						flex: 1.8;
					}

					&:nth-child(5) {
						flex: 0.85;
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
					padding: 20rpx 0;
					border-bottom: 1px solid #EEE7E4;

					>* {
						flex: 1;
						text-align: center;

						&:nth-child(2) {
							flex: 1.5;
						}
						
						&:nth-child(3),
						&:nth-child(4) {
							flex: 1.8;
						}

						&:nth-child(5) {
							flex: 0.85;
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
				font-size: 28rpx;
				line-height: 90rpx;
				text-align: center;
				letter-spacing: 1px;

				&::after {
					content: "";
					width: 12rpx;
					height: 12rpx;
					border-top: 1px solid #4B7EF6;
					border-right: 1px solid #4B7EF6;
					transform: rotate(135deg);
					margin-left: 10rpx;
    				margin-bottom: 12rpx;
				}
			}

			.listNone {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 180rpx;
				color: #999;
				font-size: 28rpx;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		width: 100%;
		color: #fff;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
		letter-spacing: 1px;
		background: linear-gradient(90deg, #FF5664, #FF3D2F);
	}
}
</style>
