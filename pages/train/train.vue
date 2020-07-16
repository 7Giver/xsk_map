<template>
	<view id="app">
		<view class="banner">
			<image src="/static/train/banner.png" mode="widthFix">
			<image src="/static/train/border.png" mode="widthFix">
		</view>
		<view class="top_block">
			<image src="/static/index/gaode.png" mode="widthFix">
			<view class="right">
				<view class="item">
					<view class="left">商户名称：<text>无锡哇哈哈哈果乳饮料</text></view>
					<view>修改</view>
				</view>
				<view class="item">
					<view class="left">联系电话：<text>18701891906</text></view>
					<view>修改</view>
				</view>
				<view class="item">
					<view class="left">商户地址：<text>江苏省无锡市梁溪区广益街道广益路梁溪电子商务园区208号</text></view>
					<view>修改</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">选择要投放的区域<text>(最多三个区域)</text></view>
			<view class="area_block">
				<view class="item" v-for="(item, index) in putInList" :key="index">
					<view class="main">
						<text v-if="index==0">区域一</text>
						<text v-else-if="index==1">区域二</text>
						<text v-else>区域三</text>
						<view>
							<picker
								:id="index"
								mode="multiSelector"
								@change="classifyChange"
								@columnchange="columnchange"
								:value="item.classifyIndex"
								:range="item.classifyArr"
								range-key="province"
							>
								<view>{{item.name}}</view>
							</picker>
							<image src="/static/sousou/more.png" mode="widthFix">
						</view>
					</view>
					<view class="btn">
						<image src="/static/train/add.png" mode="widthFix" v-if="index==0 && putInList.length<3" @click="addArea">
						<image src="/static/train/minus.png" mode="widthFix" v-else @click="delArea(index)">
					</view>
				</view>
			</view>
			<view class="title">您希望增加多少客源？</view>
			<view class="tip_block">
				<view
					:class="{'on':clientIndex == index}"
					v-for="(item, index) in clientList"
					:key="index"
					@click="selectClient(index)"
				>
					{{item}}
				</view>
			</view>
			<view class="title">您希望投放的时长？</view>
			<view class="tip_block">
				<view
					:class="{'on':timeIndex == index}"
					v-for="(item, index) in timeList"
					:key="index"
					@click="selectTime(index)"
				>
					{{item}}
				</view>
			</view>
		</view>
		<!-- 协议 -->
		<view class="agreement" @click="checkagree">
			<view class="checked">
				<image v-if="agreement" src="/static/pay/check.png" mode=""></image>
				<image v-else src="/static/pay/nocheck.png" mode=""></image>
			</view>
			<view>我已阅读并同意<text>《直通车投放服务协议》</text></view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">实付:<text>￥1699</text></view>
			<view class="right" @click="submit">立即支付</view>
		</view>
	</view>
</template>

<script>
	import Json from '@/Json';
	export default {
		data() {
			return {
				clientIndex: 1,
				timeIndex: 1,
				agreement: true, // 同意协议
				clientList: ['20+','100+'],
				timeList: ['1个月','2个月','3个月'],
				childArr: [], // 二级分类数据源
				areaList: [],  // 地区数据
				putInList: [
					{
						name: '选择区域',
						classifyIndex: [0, 0],
						classifyArr: [[], []]
					}
				]
			}
		},
		onShow() {
			this.areaList = Json.areaList
			this.getAllClassify()
		},
		methods: {
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement
			},
			// 初始化数据
			getAllClassify() {
				this.areaList.forEach((item, index) => {
					this.childArr.push(item.city)
				})
				this.putInList.forEach((item, index) => {
					item.classifyArr[0] = this.areaList
					item.classifyArr[1] = this.childArr[0]
				})
			},
			// 选择地区index
			classifyChange(e) {
				let index = Number(e.target.id)
				let value = e.target.value
				let item = this.putInList[index]
				item.classifyIndex = value
				if (item.classifyArr[0].length !== 0) {
					item.name = item.classifyArr[0][item.classifyIndex[0]].province
				}
				if (item.classifyArr[1].length !== 0) {
					item.name += ' ' + item.classifyArr[1][item.classifyIndex[1]]
				}
			},
			// 获取二级
			columnchange(e) {
				let index = Number(e.target.id)
				let item = this.putInList[index]
				if (e.detail.column == 0) {
					item.classifyArr[1] = this.childArr[e.detail.value]
				}
			},
			// 选择客源数
			selectClient(index) {
				this.clientIndex = index
			},
			// 选择投放时长
			selectTime(index) {
				this.timeIndex = index
			},
			// 添加地区
			addArea() {
				this.putInList.push({
					name: '选择区域',
					classifyIndex: [0, 0],
					classifyArr: [[], []]
				})
				this.getAllClassify()
			},
			// 删除地区
			delArea(index) {
				this.putInList.splice(index, 1)
			},
			// 立即支付
			submit() {
				if (!this.agreement) {
					uni.showToast({
						title: '请阅读服务协议',
						icon: 'none'
					});
					return false
				}
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 160rpx;

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

				>view:last-child {
					color: #516AF7;
					white-space: nowrap;
					padding-left: 24rpx;
				}
			}
		}
	}

	.block {
		height: 20rpx;
		background: #F5F5F5;
	}

	.content {
		padding: 26rpx 38rpx;

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
				margin: 26rpx auto;

				.main {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border: 1px solid #F0F0F0;
					font-size: 28rpx;
					padding: 16rpx 20rpx;
					border-radius: 10rpx;

					>view {
						display: flex;
						align-items: center;
						color: #4B7EF6;

						>image {
							display: block;
							width: 22rpx;
							margin-left: 20rpx;
						}
					}
				}

				.btn {
					padding-left: 18rpx;

					>image {
						display: block;
						width: 52rpx;
					}
				}
			}
		}

		.tip_block {
			display: flex;
			align-items: center;
			padding: 40rpx 0;

			>view {
				color: #9CA1B4;
				width: 150rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 50rpx;
				border-radius: 8rpx;
				background: #F5F5F4;
			}

			.on {
				color: #fff;
				background: #4B7EF6;
			}
		}
	}

	.agreement {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 30rpx;

		.checked {
			padding-right: 10rpx;

			image {
				display: block;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
			}
		}

		>view {
			color: #333;
			font-size: 24rpx;

			>text {
				color: #4B7EF6;
			}
		}
	}

	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		line-height: 120rpx;
		background: #fff;
		border-top: 1px solid #F0F0F0;

		.left {
			flex: 2;
			font-size: 32rpx;
			padding-left: 40rpx;
			
			>text {
				color: #FF423A;
			}
		}

		.right {
			flex: 1;
			color: #fff;
			font-size: 32rpx;
			text-align: center;
			background: linear-gradient(90deg, #FF5664, #FF3D2F);
		}
	}
}
</style>