<template>
	<view id="app">
		<scroll-view class="scroll_content" scroll-y @scrolltolower="getDataList">
			<uni-nav-bar title="我的人脉" left-icon="back" @clickLeft="back"></uni-nav-bar>
			<!-- 空白页 -->
			<empty v-if="userList.length==0"></empty>
			<view class="list_block">
				<view class="item" v-for="(item, index) in userList" :key="index" @click="goCard(item.id)">
					<image :src="item.avatar" mode="">
					<view class="content">
						<view class="left">
							<view class="nickname">{{item.name || '尚未完善'}}</view>
							<view class="text">手机：{{item.mobile || '尚未完善'}}</view>
							<view class="text">商户：{{item.company || '尚未完善'}}</view>
							<view class="text" v-if="item.province">地区：{{item.province}} {{item.city}}</view>
							<view class="text" v-else>地区：尚未完善</view>
						</view>
						<view class="btn" @click.stop="goCall(item.mobile)">拨打</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="userList.length > 0" :status="loadingType"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty/empty.vue";
	import Json from '@/Json';
	export default {
		components: {
			uniNavBar,
			uniLoadMore,
			empty
		},
		data() {
			return {
				setObj: {},
				userList: [],
				page: 1,
				loadingType: "more",
			}
		},
		computed: {
    		...mapState(['wxid','userInfo'])
  		},
		mounted() {
			// this.userList = Json.userList
			this.getDataList()
		},
		methods: {
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				});
			},
			// 跳转名片页面
			goCard(id) {
				uni.navigateTo({
					url: `/pages/mine/card?id=${id}`
				})
			},
			// 返回我的页面
			back() {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
			},
			// 获取人脉列表
			getDataList() {
				if (this.loadingType === 'noMore') {
				  //防止重复加载
				  return false;
				}
				this.loadingType = 'loading';
				this.$test
					.post(`/?r=api/user/my-relation`, {
						wxid: this.wxid,
						page: this.page
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let resultData = response.data;
							if (resultData.length > 0) {
								if (this.page == 1) {
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.page++
										this.loadingType = 'more';
									}
									this.userList = resultData
								} else {
									this.page++
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.loadingType = 'more';
									}
									this.userList = this.userList.concat(resultData)
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
	}

	.list_block {
		padding: 0 30rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 18rpx 0;
			
			&:not(:last-child) {
				border-bottom: 1px solid #E8E8E8;
			}

			>image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}

			.content {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-left: 30rpx;

				.left {
					flex: 1;
					padding-right: 16rpx;

					.nickname {
						color: #333537;
						font-size: 32rpx;
						font-weight: bold;
						padding-bottom: 6rpx;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						word-break: break-all;
						overflow: hidden;
						white-space: normal;
					}

					.text {
						color: #999999;
						font-size: 26rpx;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						word-break: break-all;
						overflow: hidden;
						white-space: normal;
					}
				}
			}

			.btn {
				color: #fff;
				font-size: 26rpx;
				white-space: nowrap;
				padding: 10rpx 30rpx;
				background: #FF423A;
				border-radius: 40rpx;
				box-shadow: 0px 4px 8px 0px rgba(251, 145, 148, 0.35);
			}

			.disabled {
				color: #fff;
				font-size: 26rpx;
				padding: 10rpx 30rpx;
				background: #d8d8d8;
				border-radius: 40rpx;
			}
			
		}
	}
}
</style>
