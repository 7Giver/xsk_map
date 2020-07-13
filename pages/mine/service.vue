<template>
	<view id="app">
		<view class="banner">
            <image src="/static/mine/service_banner.png" mode="widthFix">
        </view>
		<view class="content">
            <view>您好，<text>王晓雪</text></view>
			<view>我是您的专属客服，下面是我的二维码，请长按并识别添加我哦！</view>
			<view class="img">
				<image src="/static/mine/2_code.png" mode="widthFix">
			</view>
        </view>
		<view class="bottom">
            <view>
				<text>客服官方热线</text>
			</view>
			<view>4000-929-77</view>
        </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
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
		margin-top: 3rem;

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
