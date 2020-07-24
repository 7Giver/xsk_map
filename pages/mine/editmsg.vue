<template>
	<view id="app">
        <!-- <view class="block"></view> -->
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
				<view class="label">地址</view>
				<view class="right">
					<input type="text" v-model="guest.address" placeholder="请填写有效地址" />
				</view>
			</view>
		</view>
		<button class="save_btn" :disabled="disabled" @click="confirm">保存</button>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
    </view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	export default {
		components: {
			kpsImageCutter
		},
		data() {
			return {
				guest: {},
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
		},
		methods: {
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
					url: '/api/?r=api/index/upload',
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
				if (!this.guest.nick_name) {
					uni.showToast({
						title: '请填写昵称',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.company) {
					uni.showToast({
						title: '请填写商户名称',
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
				if (!this.guest.wechat_id) {
					uni.showToast({
						title: '请填写微信号',
						icon: 'none'
					});
					return false
				}
				if (!this.guest.address) {
					uni.showToast({
						title: '请填写商户地址',
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
			font-size: 32rpx;
			border-bottom: 1px solid #E8E8E8;

			&:first-child {
				padding: 16rpx 0;
			}

			&:not(:first-child) {
				padding: 28rpx 0;
			}

			.label {
				font-size: 30rpx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				font-size: 26rpx;
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
			}
		}
	}

	.save_btn {
		width: 90%;
		height: 80rpx;
		margin: 60rpx auto;
		color: #fff;
		font-size: 32rpx;
		border-radius: 50rpx;
		background: linear-gradient(90deg, #FF5765, #FF3428);
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
}
</style>
