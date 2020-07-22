<template>
	<view id="app">
		<scroll-view class="scroll_content" scroll-y @scrolltolower="getDataList">
			<!-- 空白页 -->
			<empty v-if="userList.length==0"></empty>
			<view class="list_block">
				<view class="item" v-for="(item, index) in userList" :key="index">
					<image :src="item.avatar" mode="">
					<view class="content">
						<view class="left">
							<view class="nickname">{{item.name}}</view>
							<view class="text">手机：{{item.mobile}}</view>
							<view class="text">商户：{{item.company}}</view>
							<view class="text">地区：{{item.city}}</view>
						</view>
						<view class="btn" @click="goCall(item.mobile)">拨打</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="userList.length > 0" :status="loadingType"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty/empty.vue";
	import Json from '@/Json';
	export default {
		components: {
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
		mounted() {
			// this.userList = Json.userList
			this.getLocal()
		},
		methods: {
			// 获取缓存
			getLocal() {
				let value = uni.getStorageSync('userMsg')
				value ? this.setObj = value : false
				this.getDataList()
			},
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				});
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
						wxid: this.setObj.wxid,
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

				.nickname {
					color: #333537;
					font-size: 32rpx;
					font-weight: bold;
					padding-bottom: 6rpx;
				}

				.text {
					color: #999999;
					font-size: 26rpx;
				}
			}

			.btn {
				color: #fff;
				font-size: 26rpx;
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
