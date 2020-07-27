<template>
	<view id="app">
		<view class="title">名片背景图</view>
		<view class="img_block" @tap="chooseImage">
			<image class="jia" src="@/components/poiuy-uImgUpload/imgs/jia.png" v-if="!path"></image>
			<image class="content" :src="path" mode="widthFix" v-else>
		</view>
		<view class="title">商户风采<text>(最多9张图 大小5M以内)</text></view>
		<img-upload :imgArr="imgArray" imgCount="9" ref="imgUpload" @upLoads="upLoads"></img-upload>
		<kps-image-cutter @ok="onok" @cancel="oncancle" :url="url" :fixed="false" :maxWidth="500" :minHeight="300"></kps-image-cutter>
		<button class="submit" type="warn" @click="submit">提交</button>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import imgUpload from '@/components/poiuy-uImgUpload/imgUpload.vue';
import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
export default {
	components: {
		imgUpload,
		kpsImageCutter
    },
	data() {
		return {
			url: "", //选择的背景图片url
			path: "", //裁剪后的背景url
			imgArray: [],  // 多图展示数组
			targetArray: [] // 上传成功的图片数组
		}
	},
	computed: {
    	...mapState(['userInfo'])
  	},
	onLoad() {
		this.getCardImgs()
	},
	methods: {
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
			this.path = ev.path;
			this.url = "";
			uni.uploadFile({
				url: '/api/?r=api/index/upload',
				filePath: ev.path,
				name: 'image',
				success: (res) => {
					// console.log(res)
					if (res.statusCode == 200) {
						let result = JSON.parse(res.data)
						this.path = result.data
					}
				}
			});
		},
		// 取消选择
		oncancle() {
			// url设置为空，隐藏控件
			this.url = "";
		},
		// 批量上传图片
		upLoads(){
			this.$refs.imgUpload.upload(res => {
				if (res.code == 0) {
                    this.targetArray = res.urlArray
                } else {
					//用户没有上传图片的返回 code码为400
					uni.showToast({
						title: '请选择图片',
						icon: 'none'
					})
				}
			});
		},
		// 获取名片管理图片
		getCardImgs() {
			this.$test
				.post(`/?r=api/user/card-show`, {
					wxid: this.userInfo.wxid
				})
				.then(response => {
					// console.log(response)
					if (response.code === 200) {
						this.path = response.data.bg_image
						this.imgArray = response.data.show_pics
						this.targetArray = response.data.show_pics
					}
				});
		},
		// 提交表单
		submit() {
			// if (!this.path) {
			// 	uni.showToast({
			// 		title: '请选择名片背景',
			// 		icon: 'none'
			// 	});
			// 	return false
			// }
			if (!this.targetArray.length) {
				uni.showToast({
					title: '请选择商户风采图',
					icon: 'none'
				});
				return false
			}
			let obj = {
				wxid: this.userInfo.wxid,
				bg_image: this.path,
				show_pics: this.targetArray
			}
			this.$test
				.post(`/?r=api/user/card-fix`, obj)
				.then(response => {
					// console.log(response)
					if (response.code === 200) {
						uni.showToast({
							title: '提交成功',
							icon: 'none',
							success: function(res) {
								setTimeout(() => {
									uni.navigateBack()
								}, 800)
							}
						});
					}
				});
		}
	}
}
</script>

<style lang="scss">
#app {
	padding: 40rpx 40rpx 0;

	.title {
		display: flex;
		align-items: flex-end;
		color: #403C3F;
		font-size: 32rpx;
		padding-bottom: 20rpx;

		>text {
			color: #999999;
			font-size: 24rpx;
			padding-left: 10rpx;
		}
	}
	
	.img_block {
		width: 100%;
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 30.5%;
		height: 200upx;
		overflow: hidden;
		background-color: #F1F1F1;
		

		.content {
			display: block;
			width: 100%;
		}

		.jia {
			width: 70upx;
			height: 70upx;
		}
	}

	.submit {
		position: fixed;
		bottom: 90rpx;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 90%;
	}
}
</style>
