<template>
    <view id="app">
		<uni-nav-bar left-icon="back" @clickLeft="back" @clickRight="changeArea" title="人脉市集">
			<view slot="right">
				<image class="area" src="/static/sousou/address.png" mode="widthFix">
				<picker
					mode="multiSelector"
					@change="classifyChange"
					@columnchange="columnchange"
					:value="classifyIndex"
					:range="classifyArr"
					range-key="name"
				>
                    <view>{{name}}</view>
                </picker>
				<image class="more" src="/static/sousou/more.png" mode="widthFix">
			</view>
		</uni-nav-bar>
        <view class="banner">
			<image src="/static/sousou/banner.png" mode="widthFix">
		</view>
		<view class="list_block">
			<view class="item" v-for="(item, index) in userList" :key="index">
				<image :src="item.image" mode="">
				<view class="content">
					<view class="left">
						<view class="nickname">{{item.nickname}}</view>
						<view class="text">手机：{{item.phone}}</view>
						<view class="text">商户：{{item.company_name}}</view>
						<view class="text">地区：{{item.area}}</view>
					</view>
					<view class="btn" @click="goAdd(item.id, index)" v-if="!item.checked">+添加</view>
					<view class="disabled" @click="goCancel(item.id, index)" v-else>已关注</view>
				</view>
			</view>
		</view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="connect_tip">
				<view class="title">温馨提示</view>
				<view class="content">
					<view class="main">人脉圈外人脉的可见度有限</view>
					<view class="off_title">
						每日<text>最多浏览1条</text>
					</view>
					<view class="message">开通地图标注</view>
					<view class="message">解锁更多人脉</view>
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
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
import Json from '@/Json';
export default {
	components: {
		uniNavBar,
		UniPopup
	},
    data() {
        return {
			classifyIndex: [0, 0],
			classifyArr: [[], []],  // picker - 数据源
			childArr: [], // 二级分类数据源
			index: 0,  // picker展示值下标
			name: '全国', // 选中的名称
			showDailog: false, // 弹窗隐藏
			areaList: [
				{
					name: '全国',
					child: []
				},
				{
					name: '江苏',
					child: [
						{
							id: 1,
							name: '南京'
						},
						{
							id: 2,
							name: '无锡'
						},
						{
							id: 3,
							name: '苏州'
						},
					]
				},
				{
					name: '浙江',
					child: [
						{
							id: 1,
							name: '杭州'
						},
						{
							id: 2,
							name: '宁波'
						},
						{
							id: 3,
							name: '温州'
						},
					]
				},
			],
			userList: [],  // 用户数据
			checkList: []  // 添加过的用户
		};
	},
	mounted() {
		this.userList = Json.userList
		// 获取数据源并分出一级二级分类
		this.getAllClassify()
	},
    methods: {
		// 点击更改筛选
		changeArea() {
			console.log('del!')
		},
		// 返回上一页
		back() {
        	uni.navigateBack()
		},
		// 监听picker
		bindPickerChange(e) {
            console.log(e.target.value)
            this.index = e.target.value
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
		// 添加人脉
		goAdd(id, index) {
			let checkList = this.checkList
			if(checkList.length > 0) {
				this.showDailog = true
			} else {
				checkList.push(id)
				this.$set(this.userList[index], 'checked', true)
			}
			console.log(checkList)
		},
		// 取消人脉
		goCancel(id, index) {
			let checkList = this.checkList
			// 用id查找对应在checkList的index
			let result = checkList.findIndex(item => item == id)
			checkList.splice(result, 1)
			this.$set(this.userList[index], 'checked', false)
		},
		// 去开通
		submit() {
			this.showDailog = false;
		},
		// 获取数据源并分出一级二级
		getAllClassify() {
			this.areaList.forEach((item, index) => {
				// 将数据源中的二级 push 进 childArr，作为二级的数据源
				this.childArr.push(this.areaList[index].child)
			})
			// 一级的数据源
			this.classifyArr[0] = this.areaList;
			// 第一次打开时，默认给一级分类添加它的二级分类
			this.classifyArr[1] = this.childArr[0]
		},
		// 选择地区
		classifyChange(e) {
			let value = e.target.value;
			this.classifyIndex = value;
			if (this.classifyArr[0].length != 0) {
				this.name = this.classifyArr[0][this.classifyIndex[0]].name
			};
			if (this.classifyArr[1].length != 0) {
				this.name = this.classifyArr[1][this.classifyIndex[1]].name
			}
		},
		// 获取二级
		columnchange(e) {
			if (e.detail.column == 0) {
				this.classifyArr[1] = this.childArr[e.detail.value]
			}
		}
		
	},
};
</script>

<style lang="scss">
#app {

	.banner {
		width: 100%;
		
		>image {
			display: block;
			width: 100%;
		}
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

	// nav导航自定义

	::v-deep.uni-navbar__header-btns-right {
		padding: 0;
		height: 100%;

		>view {
			display: flex;
			align-items: center;
			width: 100%;

			.area {
				width: 24rpx;
			}

			.more {
				width: 21rpx;
			}

			uni-picker {
				font-size: 27rpx;
    			padding: 0 12rpx;
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
