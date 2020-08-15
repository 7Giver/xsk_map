<template>
	<view id="app">
		<uni-nav-bar title="专属客服" left-icon="back" @clickLeft="$back"></uni-nav-bar>
		<view class="banner">
            <image src="/static/mine/service_banner.png" mode="widthFix">
        </view>
		<view class="content">
            <view>您好，<text>{{userInfo.name}}</text></view>
			<view>我是您的专属客服，下面是我的二维码，请长按并识别添加我哦！</view>
			<view class="img">
				<image :src="qrcode" mode="widthFix">
			</view>
        </view>
		<view class="bottom" @click="goCall(tel)">
            <view>
				<text>客服官方热线</text>
			</view>
			<view>{{tel}}</view>
        </view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
export default {
	components: {
		uniNavBar
	},
	data() {
		return {
			qrcode: '', //客服二维码
			tel: '4000-929-777'
		}
	},
	computed: {
    	...mapState(['userInfo'])
	},
	onShow() {
		this.getServiceCode()
	},
	methods: {
		// 调起电话
		goCall(tel) {
			uni.makePhoneCall({
				phoneNumber: tel
			});
		},
		// 获取订单详情
		getServiceCode() {
			let value = uni.getStorageSync('userMsg')
			this.$test
				.post(`/?r=api/user/server`, {
					wxid: this.userInfo.wxid || value.wxid
				})
				.then(response => {
					// console.log(response)
					if (response.code === 200) {
						let resultData = response.data
						resultData.qrcode
							? this.qrcode = resultData.qrcode
							: this.qrcode = '/static/mine/2_code.png'
					}
				});
		},
	}
}
</script>

<style lang="scss">
#app {
	padding-bottom: 100rpx;

	.banner {
		width: 100%;

        >image {
            display: block;
            width: 100%;
        }
    }

	.content {
		font-size: 32rpx;
		line-height: 56rpx;
		padding: 30rpx 30rpx;

		text {
			font-size: 40rpx;
		}

		.img {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 50rpx auto 30rpx;

			>image {
				display: block;
				width: 300rpx;
			}
		}
	}

	.bottom {
		margin-top: 2rem;

		>:first-child {
			display: flex;
			align-items: center;
			justify-content: center;
			color: #333537;
			font-size: 32rpx;

			&::after,
			&::before {
				content: "";
				width: 200rpx;
				height: 1px;
				background: #F2F2F2;
			}

			text {
				padding: 0 38rpx;
			}
		}
		
		>:last-child {
			color: #FF505E;
			font-size: 32rpx;
			text-align: center;
			letter-spacing: 1px;
			padding-top: 14rpx;
		}
	}
}

</style>
