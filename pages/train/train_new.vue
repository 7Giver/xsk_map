<template>
	<view id="app" v-cloak>
		<uni-nav-bar title="搜搜直通车快速获客" left-icon="back" rightText="了解详情" @clickLeft="back" @clickRight="goNext('subject')"></uni-nav-bar>
		<view class="banner">
			<image src="/static/train/header_bg1.png" mode="widthFix"></image>
		</view>
		<view class="top_block">
			<view class="avatar">
				<image :src="userInfo.avatar" mode=""></image>
			</view>
			<view class="nickname">
				<view>{{userInfo.nick_name}}</view>
				<text v-if="userInfo.is_direct == 0">暂未获客</text>
			</view>
		</view>
		<view class="content">
			<view class="title">
				您想要投放的区域
				<view class="mini">（<text>最多三个区域</text>）</view>
			</view>
			<view class="mini_title">
				<image src="/static/train/tips.png" mode=""></image>
				<view class="mini">确保每个区域的客源质量，每个区域限<text>5</text>个名额</view>
			</view>
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
						<!-- <image src="/static/train/add.png" mode="widthFix" v-if="index==0 && putInList.length<3" @click="addArea"> -->
						<image src="/static/train/minus.png" mode="widthFix" v-show="index!==0 && putInList.length>1" @click="delArea(index)">
					</view>
				</view>
				<view class="add" v-if="putInList.length<3" @click="addArea"></view>
			</view>
			<view class="title">怎么把客源给您？</view>
			<view class="form_block">
				<view class="input_block">
					<view class="must">手机号码</view>
					<input id="tel" type="number" v-model="guest.mobile" @input="postMobile" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:#D2D3D8" />
				</view>
				<view class="input_block">
					<view>商户名<text>(选填)</text></view>
					<input id="company" type="text" v-model="guest.company" @blur="saveMsg" placeholder="请输入商户名" placeholder-style="color:#D2D3D8"/>
				</view>
				<view class="input_block">
					<view>地址<text>(选填)</text></view>
					<input id="address" type="text" v-model="guest.address" @blur="saveMsg" placeholder="请输入地址" placeholder-style="color:#D2D3D8" />
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="right" @click="submit">立即获客</view>
		</view>
		<!-- 活动弹窗 -->
		<uni-popup :show="activityDailog" type="center" :animation="true" :custom="true" :mask-click="true" @change="activityChange">
			<view class="activity_block">
				<!-- 未标注活动 -->
				<!-- <view class="moon_block" v-if="!userInfo.is_direct">
					<image src="/static/activity/dialog.png" mode="widthFix"></image>
					<view class="look btn" @click.stop="goNext('moon')">立即查看</view>
				</view> -->
				<!-- 已标注活动 -->
				<view class="national_day">
					<image src="/static/activity/zhi_dialog.png" mode="widthFix"></image>
					<view class="look btn" @click.stop="goNext('national')">立即查看</view>
				</view>
			</view>
			<image class="close" src="/static/index/close.png" mode="" @click="activityCancel"></image>
		</uni-popup>
		<!-- 倒计时浮窗 -->
		<view class="load_order" @click="goPayOrder" v-if="hasOrder&&count">
			<view>待支付</view>
			<text>{{count}}</text>
		</view>
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
				guest: {},  // 表单信息
				order_sn: '', // 订单号
				count: '', //倒计时
				total_cash: 1699, // 总价
				clientIndex: 1, // 增加客源
				timeIndex: 1,  // 投放时长
				timer: null, //定时器
				activityDailog: false, //活动弹窗
				hasOrder: false, //是否有进行中订单
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
    		...mapState(['wxid','userInfo'])
  		},
		onShow() {
			uni.setNavigationBarTitle({
				title: "搜搜直通车快速获客"
			})
			// 活动弹窗显示
			// this.$nextTick(() => {
			// 	this.activityDailog = true;
			// })
			this.getUserInfo()
			this.getAreaList()
			this.goShare()
		},
		onHide() {
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			...mapMutations({
				setWxid: "setWxid",
				setUserInfo: 'setUserInfo'
			}),
			// 返回我的页面
			back() {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
			},
			// 获取用户信息
			getUserInfo() {
				let value = uni.getStorageSync('wxid')
				if (value) {
					this.setWxid(value)
					this.$http
						.post(`/?r=api/user/info`, {
							wxid: value || this.wxid
						})
						.then(response => {
							if (response.code === 200) {
								this.setUserInfo(response.data)
								let obj = this.userInfo
								if (obj.mobile) {
									this.guest = obj
								} else {
									this.guest = uni.getStorageSync('postMsg')
								}
								this.getloadingOrder()
							}
						})
				} else {
					this.$getAuthorize()
				}
			},
			// 获取进行中订单
			getloadingOrder() {
				this.$http
					.post(`/?r=api/direct/unpaid`, {
						wxid: this.wxid,
					})
					.then((response) => {
						if (response.code === 200) {
							let order_sn = response.data.order_sn
							let endtime = response.data.end_time
							this.order_sn = order_sn
							this.hasOrder = true
							if (endtime) {
								this.timer = setInterval(() => {
									this.countDown(endtime)
								}, 1000)
							}
						}
					});
			},
			// 获取省市信息
			getAreaList() {
				this.$http
					.post(`/?r=api/index/district`, {})
					.then(response => {
						if (response.code === 200) {
							this.areaList = response.data
							this.getAllClassify()
						}
					});
			},
			// 监听手机号输入
			getDetail(e) {
				let value = e.target.value
				if (value.length == 11) {
					if (!(/^1[3456789]\d{9}$/.test(value))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
							duration: 1000
						});
						return false
					}
					this.$http
						.post(`/?r=api/index/mobile`, {
							wxid: this.wxid || uni.getStorageSync('wxid'),
							mobile: value,
							type: 2
						})
						.then(response => {
							// console.log(response)
							if (response.code === 200) {
							}
						})
				}
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `快速获客`,
					desc: `海量精准客源等你来领`,
					shareUrl: this.$common.WxShareUrl(),
					imgUrl: `${this.$dataURL}/image/d7/d7fadb2c8ee2b68a8d43f693b4027527.png`
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
			// 保存修改信息
			saveMsg(type) {
				let obj = {
					tel: this.guest.mobile,
					company_name: this.guest.company,
					address: this.guest.address
				}
				uni.setStorage({
					key: "postMsg",
					data: obj
				})
				this.$http
					.post(`/?r=api/user/part`, {
						wxid: this.wxid || uni.getStorageSync('wxid'),
						company: obj.company_name,
						address: obj.address
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							
						}
					});
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
			// 计算倒计时
			countDown(endtime) {
				let nowtime = parseInt(new Date().getTime()/1000);
				let lefttime = parseInt(endtime - nowtime);
				let d = parseInt(lefttime / (24*60*60))
				let h = parseInt(lefttime / (60 * 60) % 24);
				let m = parseInt(lefttime / 60 % 60);
				let s = parseInt(lefttime % 60);
				d = addZero(d)
				h = addZero(h);
				m = addZero(m);
				s = addZero(s);
				this.count = `${m}:${s}`;
				if (lefttime <= 0) {
					this.hasOrder = false
					clearInterval(this.timer)
				}
				//小于10补0
				function addZero(i) {
					return i < 10 ? "0" + i: i + "";
				}
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
			// 监听展示弹窗状态
			activityChange(e) {
				if (!e.show) {
					this.activityDailog = false;
				}
			},
			// 关闭展示弹窗
			activityCancel() {
				this.activityDailog = false;
			},
			// 跳转
			goNext(type) {
				let url = ''
				switch (type) {
					case 'national':
						url = '/pages/activity/national_day'
						this.activityDailog = false
						break;
					case 'subject':
						url = '/pages/train/subject'
						break;
					default:
						url = ''
				}
				uni.navigateTo({
					url: url
				})
			},
			// 获取进行中订单信息并下单
			goPayOrder() {
				if (this.order_sn) {
					uni.navigateTo({
						url: '/pages/train/train_pay_new?order_sn='+this.order_sn
					})
				} else {
					this.$api.msg('缺少单号 下单失败！')
				}
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
				let setObj = {
					tel: this.guest.mobile,
					company_name: this.guest.company,
					address: this.guest.address
				}
				uni.setStorage({
					key: "postMsg",
					data: setObj
				})
				let str = uni.getStorageSync('mapStr')
				let obj = {
					company: this.guest.company,
					tel: this.guest.mobile,
					address: this.guest.address,
					map: str,
					wxid: this.wxid || uni.getStorageSync('wxid'),
					area: this.checkList,
				}
				// console.log(obj)
				this.$http
					.post(`/?r=api/order/direct-submit`, obj)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.navigateTo({
								url: `/pages/train/train_pay_new?order_sn=${response.data.order_sn}`
							})
							// window.location.href = `${this.$baseURL}?r=api/order/go&order_sn=${response.data.order_sn}`
						}
					});
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 140rpx;
	background: linear-gradient(0deg, #F5F5F5, #FFFFFF 60%);

	.banner {
		position: relative;
		image {
			display: block;
			width: 100%;
		}
		&::after {
			content: "";
			display: block;
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 32rpx;
			background: #fff;
			border-radius: 100% 100% 0 0;
		}
	}

	.top_block {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		.avatar {
			width: 110rpx;
			height: 110rpx;
			margin-right: 24rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		.nickname {
			font-size: 32rpx;
			font-weight: bold;
			letter-spacing: 1rpx;
			text {
				color: #B0AEC6;
				font-size: 24rpx;
				font-weight: normal;
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
			color: #101E38;
			font-size: 32rpx;
			font-weight: bold;
			.mini {
				color: #999999;
				font-size: 24rpx;
				font-weight: normal;
				text {
					&::before {
						content: "*";
						color: #FF8533;
						margin-right: 6rpx;
					}
				}
			}
		}
		.mini_title {
			display: flex;
			align-items: center;
			margin-top: 10rpx;
			image {
				width: 24rpx;
				height: 24rpx;
				margin-right: 8rpx;
			}
			view {
				color: #999;
				font-size: 22rpx;
				text {
					color: #FF6C00;
					margin: 0 4rpx;
				}
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
					width: 70rpx;
					padding-left: 18rpx;
					overflow: hidden;

					>image {
						display: block;
						width: 52rpx;
					}
				}
			}

			.add {
				width: 300rpx;
				height: 46rpx;
				margin: 0 auto 30rpx;
				background: #D8D8D8;
				position: relative;

				&::before,
				&::after {
					content: "";
					position: absolute;
					height: 30rpx;
					width: 2px;
					top: 4px;
					left: 50%;
					background: #fff;
				}

				&::after {
					transform: rotate(90deg);
				}
			}
		}

		.form_block {
			padding-bottom: 30rpx;
			.input_block {
				display: flex;
				align-items: center;
				margin: 30rpx auto;
				padding: 0 20rpx;
				line-height: 80rpx;
				border-radius: 10rpx;
				border: 1px solid #EDEDEF;
				background: #fff;
				.must::before {
					content: "*";
					color: #FF8533;
					font-size: 32rpx;
					margin-right: 8rpx;
				}
				view {
					color: #3E485A;
					width: 210rpx;
					font-size: 30rpx;
					text {
						font-size: 26rpx;
						margin-left: 4rpx;
					}
				}
				input {
					flex: 1;
					font-size: 28rpx;
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

	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		line-height: 110rpx;
		background: #fff;
		border-top: 1px solid #F0F0F0;
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

	// nav导航自定义

	::v-deep.uni-nav-bar-right-text {
		color: #4B7EF6;
		font-size: 30rpx;
		font-weight: bold;
	}

	// 活动弹窗
    .activity_block {
        padding: 0 20rpx;

        image {
            display: block;
            width: 100%;
        }

        .btn {
            position: absolute;
            bottom: 30rpx;
            left: 11%;
            width: 80%;
            font-weight: bold;
            text-align: center;
            font-size: 38rpx;
            line-height: 86rpx;
            border-radius: 130rpx;
            animation: mymove 5s infinite;
            animation-direction: alternate;
            animation-timing-function: ease-in-out;
        }

        .moon_block {
            position: relative;

            .look {
                color: #F34122;
                background: linear-gradient(90deg, #FFCF95, #FFF6B8);
            }
        }

        .national_day {
            position: relative;

            .look {
                color: #B9081A;
                background: linear-gradient(90deg, #F3BC70, #FFB64B);
            }
        }
    }

    .close {
        display: block;
        position: absolute;
        left: 50%;
        bottom: -115rpx;
        transform: translate(-50%, -50%);
        width: 60rpx;
        height: 60rpx;
    }

	// 进行中订单浮窗
    .load_order {
        position: fixed;
        right: 30rpx;
        bottom: 280rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 140rpx;
        height: 140rpx;
        border-radius: 50%;
        overflow: hidden;
        background: url('/static/train/clock.png') no-repeat center / 100% 100%;
        view {
            color: #876565;
            font-size: 28rpx;
			margin-bottom: 2rpx;
        }
		text {
			color: #FF4947;
			font-size: 26rpx;
		}
    }
}
</style>