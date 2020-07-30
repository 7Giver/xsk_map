<template>
	<view id="app" v-cloak>
		<uni-nav-bar title="快速获客" left-icon="back" @clickLeft="$back"></uni-nav-bar>
		<view class="banner">
			<image src="/static/train/banner.png" mode="widthFix">
			<image src="/static/train/border.png" mode="widthFix">
			<image @click="posterShow" class="finger" src="/static/train/finger.gif" mode="widthFix">
		</view>
		<view class="top_block">
			<image :src="guest.avatar || setObj.headimgurl" mode="widthFix">
			<view class="right">
				<view class="item">
					<view class="left">商户名称：
						<text v-if="!editName && guest.company">{{guest.company}}</text>
						<input v-else type="text" v-model="guest.company" @blur="saveMsg('company')" focus placeholder="请填写店铺/公司名称" />
					</view>
					<view class="edit" @click="eidtMsg('name')" v-if="guest.company">修改</view>
				</view>
				<view class="item">
					<view class="left">联系电话：
						<text v-if="!editTel && guest.mobile">{{guest.mobile}}</text>
						<input v-else type="number" v-model="guest.mobile" @blur="saveMsg('mobile')" focus maxlength="11" placeholder="请填写真实有效的手机号码" />
					</view>
					<view class="edit" @click="eidtMsg('tel')" v-if="guest.mobile">修改</view>
				</view>
				<view class="item">
					<view class="left">商户地址：
						<text v-if="!editAddress && guest.address">{{guest.address}}</text>
						<textarea v-else v-model="guest.address" @blur="saveMsg('address')" :focus="true" placeholder="请填写真实有效店铺/公司地址" style="height: 100rpx" />
					</view>
					<view class="edit" @click="eidtMsg('address')" v-if="guest.address">修改</view>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">选择要投放的区域<text>(最多三个区域)</text></view>
			<view class="area_block">
				<view class="item" v-for="(item, index) in putInList" :key="index" v-cloak>
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
					{{item.label}}
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
					{{item.label}}
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
			<view class="left">实付:<text>￥{{total_cash}}</text></view>
			<view class="right" @click="submit">立即支付</view>
		</view>
		<!-- 弹出层 -->
		<uni-popup :show="showDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="change">
			<view class="poster_block">
				<image src="/static/train/poster.png" mode="widthFix"></image>
				<view class="tips" @click="cancel">
					<image src="/static/train/close.png" mode=""></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import UniPopup from '@/components/uni-dialog/uni-dialog.vue';
	// import Json from '@/Json';
	export default {
		components: {
			uniNavBar,
			UniPopup
		},
		data() {
			return {
				setObj: {}, // 缓存信息
				guest: {},  // 表单信息
				total_cash: 1699, // 总价
				clientIndex: 1, // 增加客源
				timeIndex: 1,  // 投放时长
				showDailog: false, // 弹窗隐藏显示
				editName: false, // 编辑名称
				editTel: false,  // 编辑电话
				editAddress: false, // 编辑地址
				agreement: true, // 同意协议
				clientList: [
					{
						label: '20+',
						value: 20
					},
					{
						label: '100+',
						value: 100
					}
				],
				timeList: [
					{
						label: '1个月',
						value: 1
					},
					{
						label: '3个月',
						value: 3
					},
					{
						label: '6个月',
						value: 6
					},
				],
				childArr: [], // 二级分类数据源
				areaList: [],  // 地区数据
				checkList: [], //选择后的区域
				putInList: [
					{
						name: '选择区域',
						classifyIndex: [0, 0],
						classifyArr: [[], []]
					}
				]
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onShow() {
			// this.areaList = Json.areaList
			this.setObj = uni.getStorageSync('userMsg')
			this.guest = this.userInfo
			this.getAreaList()
		},
		methods: {
			// 获取省市信息
			getAreaList() {
				this.$test
					.post(`/?r=api/index/district`, {})
					.then(response => {
						if (response.code === 200) {
							this.areaList = response.data
							this.getAllClassify()
						}
					});
			},
			// 点击编辑信息
			eidtMsg(type) {
				switch(type) {
					case 'name':
						this.editName = true
						this.editAddress = false
						break;
					case 'tel':
						this.editTel = true
						this.editAddress = false
						break;
					case 'address':
						this.editAddress = true
						break;
				}
			},
			// 保存修改信息
			saveMsg(type) {
				switch(type) {
					case 'company':
						this.editName = false;
						break;
					case 'mobile':
						this.editTel = false;
						break;
					case 'address':
						this.editAddress = false;
						break;
				}
				// let obj = {
				// 	tel: this.guest.mobile,
				// 	company_name: this.guest.company,
				// 	address: this.guest.address
				// }
				// uni.setStorage({
				// 	key: "postMsg",
				// 	data: obj
				// })
			},
			// 同意协议
			checkagree() {
				this.agreement = !this.agreement
			},
			posterShow() {
				this.showDailog = true
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
				this.changeArray()
			},
			// 获取二级
			columnchange(e) {
				let index = Number(e.target.id)
				let item = this.putInList[index]
				if (e.detail.column == 0) {
					item.classifyArr[1] = this.childArr[e.detail.value]
				}
			},
			// 区域去重
			changeArray() {
				let arr = this.putInList.filter(item => item.name !== '选择区域')
				let res = new Map()
				let newArr = arr.filter((a) => !res.has(a.name) && res.set(a.name, 1))
				if (newArr.length !== arr.length) {
					uni.showToast({
						title: '区域不得重复',
						icon: 'none'
					});
					this.putInList = newArr
				}
				this.getCheckList(newArr)
			},
			// 获取选中地址
			getCheckList(res) {
				let arr = []
				res.forEach(item => {
					arr.push(item.name)
				})
				let result = []
				arr.forEach(item => {
					result.push(item.split(' '))
				})
				let newArr = []
				result.forEach(item => {
					newArr.push({
						province: item[0],
						city: item[1]
					})
				})
				this.checkList = [...new Set(newArr)]
			},
			// 选择客源数
			selectClient(index) {
				this.clientIndex = index
				index == 0 ? this.total_cash = 499 : this.total_cash = 1699
			},
			// 选择投放时长
			selectTime(index) {
				this.timeIndex = index
			},
			// 立即支付
			submit() {
				if (!this.guest.company) {
					uni.showToast({
						title: '请输入商户名称',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.mobile) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.mobile))) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 1000
					});
					return false
				}
				if (!this.guest.address) {
					uni.showToast({
						title: '请输入商户地址',
						icon: 'none'
					});
					return false
				}
				if (!this.agreement) {
					uni.showToast({
						title: '请阅读服务协议',
						icon: 'none'
					});
					return false
				}
				if (!this.checkList.length) {
					uni.showToast({
						title: '请选择投放区域',
						icon: 'none'
					});
					return false
				}
				if (this.checkList.length !== this.putInList.length) {
					uni.showToast({
						title: '请选择投放区域',
						icon: 'none'
					});
					return false
				}
				let str = uni.getStorageSync('mapStr')
				let wxid = uni.getStorageSync('userMsg').wxid
				let obj = {
					company: this.guest.company,
					tel: this.guest.mobile,
					address: this.guest.address,
					map: str,
					wxid: wxid,
					area: this.checkList,
					customers: this.clientList[this.clientIndex].value,
					type: this.timeList[this.timeIndex].value
				}
				// console.log(obj)
				this.$test
					.post(`/?r=api/order/direct-submit`, obj)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							window.location.href = `${this.$testURL}?r=api/order/go&order_sn=${response.data.order_sn}`
						}
					});
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 160rpx;

	.banner {
		position: relative;
		width: 100%;
		overflow: hidden;

		image {
			display: block;
			width: 100%;
		}

		.finger {
			position: absolute;
			top: 80rpx;
			right: 140rpx;
			width: 200rpx;
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
				line-height: 64rpx;

				.left {
					flex: 1;
					display: flex;
					white-space: nowrap;
					font-weight: bold;

					input {
						width: 100%;
						height: 46rpx;
						font-size: 26rpx;
						text-indent: 24rpx;
						font-weight: normal;
						background: #f8f8f8;
						border-radius: 20rpx;
						margin-top: 8rpx;
					}

					textarea {
						width: 100%;
						padding: 10rpx 20rpx;
						font-size: 26rpx;
						font-weight: normal;
						background: #f8f8f8;
						border-radius: 20rpx;
					}

					>text {
						color: #9CA1B4;
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

				&:last-child {
					.left {
						>text {
							line-height: 40rpx;
							margin-top: 10rpx;
						}
					}
				}

				.edit {
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

	// 海报弹窗
	::v-deep.uni-popup__wrapper-box {
		width: 75%;
	}

	.poster_block {
		// position: relative;

		>image {
			display: block;
			width: 100%;
			border-radius: 28rpx;
		}

		.tips {
			position: absolute;
			left: 50%;
			bottom: -130rpx;
			transform: translate(-50%, -50%);

			>image {
				display: block;
				width: 65rpx;
				height: 65rpx;
			}
		}
	}
}
</style>