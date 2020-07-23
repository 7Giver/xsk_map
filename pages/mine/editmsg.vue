<template>
	<view id="app">
        <!-- <view class="block"></view> -->
		<view class="content">
			<view class="item">
				<view class="label">更换头像</view>
				<view class="right" @tap="chooseImage()">
					<view class="img_block">
						<image :src="path" mode="">
					</view>
				</view>
			</view>
			<view class="item">
				<view class="label">昵称</view>
				<view class="right">三只小思</view>
			</view>
			<view class="item">
				<view class="label">商户名</view>
				<view class="right">江苏加爵可乐店铺</view>
			</view>
			<view class="item">
				<view class="label">手机号</view>
				<view class="right">18701891906</view>
			</view>
			<view class="item">
				<view class="label">微信号</view>
				<view class="right">Luluxiancg</view>
			</view>
		</view>
		<button class="save_btn" :disabled="disabled" @click="confirm">保存</button>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
    </view>
</template>

<script>
	import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
	export default {
		components: {
			kpsImageCutter
		},
		data() {
			return {
				disabled: false, // 保存按钮禁用
				url: "",
                path: ""
			}
		},
		methods: {
			chooseImage() {
				uni.chooseImage({
					success: (res) => {
						// 设置url的值，显示控件
						this.url = res.tempFilePaths[0];
						console.log(this.url)
					}
				});
            },
			onok(ev) {
                this.path = ev.path;
				this.url = "";
				console.log(this.path)
				uni.uploadFile({
					url:  `${this.$testURL}/?r=api/index/upload`,
					filePath: ev.path,
					name: 'image',
					header: {"Content-Type": "multipart/form-data"},
					success:(res) => {
						console.log(res)
						if (res.data.code == 200){
							console.log('文件上传成功')
						}
					}
				});
            },
            oncancle() {
                // url设置为空，隐藏控件
                this.url = "";
            },
			// 保存信息
			confirm() {

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
				font-size: 28rpx;
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
