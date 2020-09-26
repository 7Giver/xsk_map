<template>
    <view id="app">
		<scroll-view class="scroll_content" :scroll-y="true" @scrolltolower="getConnection">
			<view class="fixed_block">
				<uni-nav-bar title="人脉市集" left-icon="back" @clickLeft="back">
					<view slot="right">
						<image class="area" src="/static/sousou/address.png" mode="widthFix">
						<picker
							mode="multiSelector"
							@change="classifyChange"
							@columnchange="columnchange"
							:value="classifyIndex"
							:range="classifyArr"
							range-key="province"
						>
							<view>{{name}}</view>
						</picker>
						<image class="more" src="/static/sousou/more.png" mode="widthFix">
					</view>
				</uni-nav-bar>
				<view class="banner">
					<image src="/static/sousou/banner.png" mode="widthFix">
				</view>
			</view>
			<empty v-if="userList.length==0"></empty>
			<view class="list_block">
				<view class="item" v-for="(item, index) in userList" :key="index"  @click="goCard(item.id)">
					<image :src="item.avatar" mode="">
					<view class="content">
						<view class="left">
							<view class="nickname">{{item.name || '尚未完善'}}</view>
							<view class="text">手机：{{item.mobile || '尚未完善'}}</view>
							<view class="text">商户：{{item.company || '尚未完善'}}</view>
							<view class="text" v-if="item.province">地区：{{item.province}} {{item.city}}</view>
							<view class="text" v-else>地区：尚未完善</view>
						</view>
						<view class="btn" @click.stop="addfriend(item.id, item)" v-if="!item.checked">+添加</view>
						<view class="disabled" v-else>已关注</view>
					</view>
				</view>
			</view>
			<uni-load-more v-if="userList.length>0" :status="loadingType"></uni-load-more>
		</scroll-view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="connect_tip">
				<view class="title">温馨提示</view>
				<view class="content" v-if="!userInfo.is_mark">
					<view class="main">人脉圈外人脉的可见度有限</view>
					<view class="off_title">
						每日<text>最多浏览1条</text>
					</view>
					<view class="message">开通地图标注</view>
					<view class="message">解锁更多人脉</view>
				</view>
				<view class="content" v-else>
					<view class="main" style="margin-bottom:20rpx">您今日添加人脉已到上限</view>
					<view class="message">开通直通车</view>
					<view class="message">无限获客</view>
				</view>
				<view class="bottom">
					<view class="submit" @click="submit">去开通</view>
					<view class="cancel" @click="cancel">返回</view>
				</view>
			</view>
		</uni-popup>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import empty from "@/components/empty/empty.vue";
import Json from '@/Json';
export default {
	components: {
		uniNavBar,
		UniPopup,
		uniLoadMore,
		empty
	},
    data() {
        return {
			index: 0,  // picker展示值下标
			page: 1,
			name: '全国', // 选中的名称
			classifyIndex: [0, 0],
			classifyArr: [[], []],  // picker - 数据源
			childArr: [], // 二级分类数据源
			showDailog: false, // 弹窗隐藏
			areaList: [],
			userList: [],  // 用户数据
			checkList: [],  // 添加过的用户
			loadingType: "more" // 加载状态
		};
	},
	computed: {
    	...mapState(['wxid','userInfo'])
  	},
	onLoad() {
		// this.userList = Json.userList
		this.getAreaList()
		this.getConnection()
		this.goShare()
	},
    methods: {
		// 获取省市信息
		getAreaList() {
			this.$http
				.post(`/?r=api/index/district`, {})
				.then(response => {
					if (response.code === 200) {
						this.areaList = response.data
						this.areaList.unshift({
							province: '全国',
							city: ['全国']
						})
						this.getAllClassify()
					} else {
						uni.showToast({
							title: '获取省市失败',
							icon: 'none'
                		})
					}
				});
		},
		// 获取人脉市集
		getConnection() {
			let value = uni.getStorageSync('wxid')
			if (!value) {
				this.$getAuthorize()
				return false
			}
			if (this.loadingType === 'noMore') {
				//防止重复加载
				return false;
			}
			this.loadingType = 'loading';
			this.$http
				.post(`/?r=api/user/relations`, {
					wxid: this.wxid || uni.getStorageSync('wxid'),
					page: this.page,
					city: this.name == '全国' ? '' : this.name
				})
				.then(response => {
					// console.log(response)
					if (response.code === 200) {
						let resultData = response.data;
						if (resultData.length > 0) {
							// resultData.forEach(item => {
							// 	item.checked = false
							// })
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
		// 添加人脉请求
		addfriend(id, item) {
			this.$http
				.post(`/?r=api/user/add-relation`, {
					wxid: this.wxid,
					relation_id: id
				})
				.then(response => {
					// console.log(response)
					if (response.code === 200) {
						this.$set(item, 'checked', true)
						uni.showToast({
							title: '添加成功',
							icon: 'none'
                		})
					} else {
						this.showDailog = true
					}
				});
		},
		// 跳转名片页面
		goCard(id) {
			uni.navigateTo({
				url: `/pages/mine/card?id=${id}`
			})
		},
		// 取消人脉
		goCancel(id, index) {
			let checkList = this.checkList
			// 用id查找对应在checkList的index
			let result = checkList.findIndex(item => item == id)
			checkList.splice(result, 1)
			this.$set(this.userList[index], 'checked', false)
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
		},
		// 返回我的页面
		back() {
			uni.switchTab({
				url: '/pages/mine/mine'
			})
		},
		// 去开通
		submit() {
			this.showDailog = false;
			this.userInfo.is_mark
				? uni.navigateTo({
					url: '/pages/train/train'
				})
				: uni.switchTab({
					url: '/pages/home/home'
				})
		},
		// 获取数据源并分出一级二级
		getAllClassify() {
			this.areaList.forEach((item, index) => {
				this.childArr.push(item.city)
			})
			this.classifyArr[0] = this.areaList;
			this.classifyArr[1] = this.childArr[0]
		},
		// 选择地区
		classifyChange(e) {
			let value = e.target.value;
			this.classifyIndex = value;
			if (this.classifyArr[0].length != 0) {
				this.name = this.classifyArr[0][this.classifyIndex[0]].province
			}
			if (this.classifyArr[1].length != 0) {
				this.name = this.classifyArr[1][this.classifyIndex[1]]
			}
			this.userList = []
			this.loadingType = 'more'
			this.getConnection()
		},
		// 获取二级
		columnchange(e) {
			if (e.detail.column == 0) {
				this.classifyArr[1] = this.childArr[e.detail.value]
			}
		},
		// 调用微信自定义分享
		goShare() {
			let obj = {
				title: `人脉市集`,
				desc: `重新定义销售 帮助企业获客`,
				shareUrl: url,
				imgUrl: `${this.$dataURL}/image/c4/c4977d8fe898027b50d8a5f2420c60dc.png`
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
						console.log('response', response)
					})
				})
			}
			// #endif
		},
		// 调用微信自定义分享
		goShare() {
			let obj = {
				title: `人脉市集`,
				desc: `重新定义销售 帮助企业获客`,
				shareUrl: this.$common.WxShareUrl(),
				imgUrl: `${this.$dataURL}/image/c4/c4977d8fe898027b50d8a5f2420c60dc.png`
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
	},
};
</script>

<style lang="scss">
#app {
	position: relative;

	.fixed_block {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 2;
	}

	.banner {
		width: 100%;
		
		>image {
			display: block;
			width: 100%;
		}
	}

	.scroll_content {
		height: 100vh;
	}

	.list_block {
		padding: 0 30rpx;
		padding-top: 166px;

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

	// nav导航自定义

	::v-deep.uni-navbar__header-btns-right {
		padding: 0;
		height: 100%;

		>view {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 20rpx;
			width: 100%;

			.area {
				width: 24rpx;
			}

			.more {
				width: 21rpx;
			}

			uni-picker {
				font-size: 27rpx;
    			padding: 0 10rpx;
				white-space: nowrap;
			}
		}
	}

	// 提示弹窗

	::v-deep.uni-popup__wrapper-box {
		width: 74%;
	}

	.connect_tip {
		text-align: center;
		background: url('/static/sousou/bg.png') no-repeat center / 100% 100%;

		.title {
			color: #fff;
			font-size: 38rpx;
			line-height: 106rpx;
			letter-spacing: 1px;
		}

		.content {
			padding: 34rpx 0 30rpx;

			.main {
				color: #208EFF;
				font-size: 38rpx;
			}

			.off_title {
				color: #4D565E;
				font-size: 32rpx;
				line-height: 86rpx;

				>text {
					color: #1F8FFF;
				}
			}

			.message {
				color: #4D565E;
				font-size: 32rpx;
				padding-bottom: 18rpx;
			}
		}

		.bottom {
			font-size: 34rpx;
			padding-bottom: 20rpx;

			.submit {
				width: 85%;
				color: #fff;
				margin: 0 auto;
				line-height: 76rpx;
				border-radius: 80rpx;
				background: linear-gradient(90deg, #1482FD, #3FA9FF);
			}

			.cancel {
				color: #2996FF;
				line-height: 88rpx;
			}
		}
	}
	
}
</style>
