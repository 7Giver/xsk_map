<template>
	<view id="app">
        <!-- <view class="block"></view> -->
		<uni-nav-bar title="编辑信息" left-icon="back" @clickLeft="$back"></uni-nav-bar>
		<view class="content">
			<view class="item">
				<view class="label">更换头像</view>
				<view class="right" @tap="chooseImage">
					<view class="img_block">
						<image :src="guest.avatar" mode="">
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">昵称</view>
				<view class="right">
					<input type="text" v-model="guest.nick_name" placeholder="请填写昵称" />
				</view>
			</view>
			<view class="item">
				<view class="label">商户名</view>
				<view class="right">
					<input type="text" v-model="guest.company" placeholder="请填写商户名称" />
				</view>
			</view>
			<view class="item">
				<view class="label">手机号</view>
				<view class="right">
					<input id="mobile" type="number" v-model="guest.mobile" @blur="saveMsg" maxlength="11" placeholder="请填写有效的手机号码" />
				</view>
			</view>
			<view class="item">
				<view class="label">微信号</view>
				<view class="right">
					<input type="text" v-model="guest.wechat_id" placeholder="请填写微信号" />
				</view>
			</view>
			<view class="item">
				<view class="label">选择省市</view>
				<view class="right">
					<picker
						mode="multiSelector"
						@change="classifyChange"
						@columnchange="columnchange"
						:value="classifyIndex"
						:range="classifyArr"
						range-key="province"
					>
						<view v-if="guest.province && guest.city">{{guest.province}} {{guest.city}}</view>
						<view v-else>请选择省市</view>
					</picker>
				</view>
			</view>
			<view class="address">
				<view class="top">
					<view class="label">详细地址</view>
					<view class="right">
						<input type="text" v-model="guest.address" placeholder="请填写有效地址" />
					</view>
				</view>
			</view>
			<view class="tips" v-if="!guest.is_mark">
				<view >注：详细地址只有标注地图后才会在名片显示哦！</view>
				<view class="add" @click="goNext">去标注</view>
			</view>
			<view class="sign">
				<view class="label">个性签名</view>
				<view class="right">
					<view class="input_block">
						<textarea v-model="guest.sign" placeholder="请填写个性签名" style="height: 100rpx" />
					</view>
				</view>
			</view>
		</view>
		<button class="save_btn" :disabled="disabled" @click="confirm">保存</button>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
    </view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	export default {
		components: {
			uniNavBar,
			kpsImageCutter
		},
		data() {
			return {
				guest: {},
				name: '请选择省市', // 选中的名称
				classifyIndex: [0, 0],
				classifyArr: [[], []],  // picker - 数据源
				childArr: [], // 二级分类数据源
				disabled: false, // 保存按钮禁用
				url: "",
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onLoad() {
			// console.log(this.userInfo)
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
						} else {
							uni.showToast({
								title: '获取省市失败',
								icon: 'none'
							})
						}
					});
			},
			// 跳转首页
			goNext() {
				if (!this.guest.company) {
					uni.showToast({
						title: '请填写商户名',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					});
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.mobile))) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.address) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					});
					return false
				}
				let obj = {
					tel: this.guest.mobile,
					company_name: this.guest.company,
					address: this.guest.address,
				}
				uni.setStorage({
					key: "postMsg",
					data: obj
				})
				uni.setStorage({
					key: "openPost",
					data: true
				})
				uni.switchTab({
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
					this.guest.province = this.classifyArr[0][this.classifyIndex[0]].province
				}
				if (this.classifyArr[1].length != 0) {
					this.guest.city = this.classifyArr[1][this.classifyIndex[1]]
				}
			},
			// 获取二级
			columnchange(e) {
				if (e.detail.column == 0) {
					this.classifyArr[1] = this.childArr[e.detail.value]
				}
			},
			// 监听input输入
			saveMsg(e) {
				let type = e.target.id
				if (type == 'mobile') {
					if (!(/^1[3456789]\d{9}$/.test(this.guest.mobile))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
							duration: 1000
						});
						return false
					}
				}
			},
			// 选择照片
			chooseImage() {
				uni.chooseImage({
					success: (res) => {
						// 设置url的值，显示控件
						this.url = res.tempFilePaths[0];
					}
				});
			},
			// 选中图片
			onok(ev) {
                this.guest.avatar = ev.path;
				this.url = "";
				uni.uploadFile({
					url: `${this.$testURL}/?r=api/index/upload`,
					// url: '/api/?r=api/index/upload', // 开发
					filePath: ev.path,
					name: 'image',
					success: (res) => {
						// console.log(res)
						if (res.statusCode == 200) {
							let result = JSON.parse(res.data)
							this.guest.avatar = result.data
						}
					}
				});
			},
			// 取消选择
            oncancle() {
                // url设置为空，隐藏控件
                this.url = "";
            },
			// 提交信息
			confirm() {
				if (!this.guest.avatar) {
					uni.showToast({
						title: '请选择头像',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.company) {
					uni.showToast({
						title: '请填写商户名',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.mobile) {
					uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					});
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.mobile))) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.address) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					});
					return false
				}
				this.$test
					.post(`/?r=api/user/edit`, this.guest)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'none'
							});
							setTimeout(() => {
								uni.navigateBack()
							}, 700)
						} else {
							uni.showToast({
								title: response.msg,
								icon: 'none'
							});
						}
					});
			},
			
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 100rpx;

	.block {
		height: 26rpx;
		background: #F5F5F5;
	}

	.content {
		padding: 0 30rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #333537;

			&:first-child {
				padding: 16rpx 0;
			}

			&:not(:last-child) {
				border-bottom: 1px solid #E8E8E8;
			}

			&:not(:first-child) {
				padding: 28rpx 0;
			}

			.label {
				flex: 1;
				font-size: 30rpx;
			}

			.right {
				flex: 1.5;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				text-align: right;
				padding-right: 10rpx;

				.img_block {
					display: flex;
					align-items: center;
					justify-content: space-between;

					>image {
						display: block;
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

					&::after {
						content: "";
						width: 16rpx;
						height: 16rpx;
						border-top: 1px solid #999999;
						border-right: 1px solid #999999;
						transform: rotate(45deg);
						margin-left: 14rpx;
					}
				}

				input {
					width: 100%;
				}

				uni-picker {
					font-size: 30rpx;
				}
			}
		}

		.address {
			color: #333537;
			border-bottom: 1px solid #E8E8E8;

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 28rpx 0;

				.label {
					font-size: 30rpx;
				}

				.right {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					text-align: right;
					padding-right: 10rpx;

					input {
						width: 100%;
					}

					uni-picker {
						font-size: 30rpx;
					}
				}
			}
		}
		
		.tips {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #FF5765;
			font-size: 24rpx;
			margin: 10rpx auto 0;

			.add {
				font-size: 30rpx;
				display: flex;
				align-items: center;
				text-decoration: underline;

				&::after {
					content: "";
					width: 14rpx;
					height: 14rpx;
					border-top: 1px solid #FF5765;
					border-right: 1px solid #FF5765;
					transform: rotate(45deg);
					margin-left: 6rpx;
					margin-right: 10rpx;
				}
			}
		}
		
		.sign {
			padding-top: 26rpx;
			
			.label {
				flex: 1;
				font-size: 30rpx;
			}

			.input_block {
				padding: 16rpx 36rpx;
				margin: 20rpx auto;
				border-radius: 16rpx;
				background: #f5f5f5;
			}
		}
	}

	.save_btn {
		width: 90%;
		height: 80rpx;
		margin: 100rpx auto 0;
		color: #fff;
		font-size: 32rpx;
		border-radius: 50rpx;
		background: linear-gradient(90deg, #FF5765, #FF3428);
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
}
</style>
