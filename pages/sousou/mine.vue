<template>
    <view id="app">
        <view class="header">
            <view class="top">
                <view class="img">
                    <image src="/static/sousou/user.png" mode="widthFix">
                </view>
                <view class="right">
                    <view class="title">江苏海底捞火锅店</view>
                    <view class="tips">
                        <text>地图标注商户</text>
                    </view>
                </view>
            </view>
            <view class="bottom">
                <view class="left">您还未标注地图</view>
                <view class="right">点击去标注</view>
            </view>
        </view>
        <view class="content">
            <view class="title">我的功能</view>
            <view class="icon_block">
                <view class="item" v-for="(item, index) in iconList" :key="index" @click="gonext(item.url)">
                    <image :src="item.icon" mode="widthFix">
                    <view>{{item.title}}</view>
                </view>
            </view>
        </view>
        <view class="banner">
            <image src="/static/mine/banner.png" mode="widthFix">
        </view>
    </view>
</template>

<script>
import Json from '@/Json';
export default {
    data() {
        return {
            iconList: []
        };
    },
    mounted() {
        this.iconList = Json.iconList
    },
    methods: {
        // 跳转页面
        gonext(url) {
            if (url) {
                uni.navigateTo({
                    url: url
                })
            } else {
                uni.showToast({
                    title: '正在升级中...',
                    icon: 'none'
                })
            }
        }
    },
};
</script>

<style lang="scss">
#app {
    height: 100vh;
    padding-bottom: 120rpx;
    background: #F9F9FB;

	.header {
		background: #fff;
        padding-bottom: 30rpx;

        >view {
            display: flex;
            align-items: center;
        }

        .top {
            padding: 60rpx 40rpx 120rpx;
            background: url('/static/mine/bg.png') no-repeat center / 100% 100%;

            .img {
                margin-right: 26rpx;
                border: 2px solid #72A2EC;
                border-radius: 50%;

                >image {
                    display: block;
                    width: 100rpx;
                }
            }

            .right {

                .title {
                    color: #fff;
                    font-size: 34rpx;
                    letter-spacing: 1px;
                    margin-bottom: 14rpx;
                }

                .tips {
                    display: inline-block;
                    font-size: 22rpx;
                    line-height: 46rpx;
                    
                    >text {
                        display: flex;
                        align-items: center;
                        color: #BE8B3F;
                        padding-right: 16rpx;
                        border-radius: 50rpx;
                        background: linear-gradient(90deg, #E1D6B2, #D7C292);

                        &::before {
                            content: '';
                            width: 30rpx;
                            height: 30rpx;
                            margin-left: 12rpx;
                            margin-right: 8rpx;
                            background: url('/static/mine/v_icon.png') no-repeat center / 100% 100%;
                        }
                    }
                }

            }
            
        }

        .bottom {
            width: 92%;
            margin: 0 auto;
            margin-top: -60rpx;
            padding: 28rpx 30rpx;
            justify-content: space-between;
            border-radius: 20rpx;
            background: linear-gradient(-80deg, #F9E0AF, #FAEDD2);

            >view {
                display: flex;
                align-items: center;
            }

            .left {
                color: #343434;
                font-size: 32rpx;
                font-weight: bold;

                &::before {
                    content: '';
                    width: 40rpx;
                    height: 34rpx;
                    margin-right: 20rpx;
                    background: url('/static/mine/vip_icon.png') no-repeat center / 100% 100%;
                }
            }

            .right {
                color: #C59A5A;
                font-size: 28rpx;

                &::after {
                    content: '';
                    width: 28rpx;
                    height: 28rpx;
                    margin-left: 14rpx;
                    background: url('/static/mine/enter_icon.png') no-repeat center / 100% 100%;
                }
            }
        }
	}

    .content {
        width: 92%;
        margin: 30rpx auto 40rpx;
        background: #fff;
        border-radius: 28rpx;

        .title {
            margin: 0 38rpx;
            font-size: 34rpx;
            line-height: 80rpx;
            border-bottom: 1px solid #F6F6F6;
        }

        .icon_block {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            padding-bottom: 20rpx;

            .item {
                width: 25%;
                display: flex;
                align-items: center;
                flex-direction: column;
                padding: 30rpx 0;

                >image {
                    display: block;
                    width: 58rpx;
                }

                >view {
                    color: #323232;
                    font-size: 24rpx;
                    margin-top: 20rpx;
                }
            }
        }
    }

    .banner {
        width: 92%;
        margin: 0 auto;

        >image {
            display: block;
            width: 100%;
        }
    }
}
</style>
