<template>
	<view id="app" v-cloak>
		<view class="header">
            <view class="block">
                <view class="top">
                    <view class="img" @click="goEdit">
                        <image :src="userInfo.avatar" mode="">
                    </view>
                    <view class="right">
                        <view class="title">{{userInfo.nick_name}}</view>
                        <view :class="[userInfo.is_mark ? 'tips on' : 'tips off']">
                            <text v-if="userInfo.is_mark">地图标注商户</text>
                            <text v-else>未标注商户</text>
                        </view>
                    </view>
                </view>
                <view class="bottom" v-if="!userInfo.mark_status">
                    <view class="left">您还未标注地图</view>
                    <view class="right" @click="goMark">去标注</view>
                </view>
                <view class="bottom" v-if="userInfo.mark_status == 2">
                    <view class="left" v-if="userInfo.is_mark">恭喜您 地图已标注</view>
                </view>
                <view class="bottom" v-if="userInfo.mark_status == 1">
                    <view class="left">商户地图标注中，请耐心等待！</view>
                </view>
            </view>
        </view>
		<view class="container">
            <view class="item" @click="goNext('train')" v-if="userInfo.mark_status">
                <image src="/static/mine/people.png" mode="">
                <text>快速获客</text>
                <image :class="[userInfo.is_mark ? 'hot ani' : 'hot']" src="/static/mine/hot.png" mode="widthFix">
            </view>
            <view class="item" @click="goNext('card')">
				<image src="/static/mine/min_card.png" mode="">
			    <text>搜搜名片</text>
            </view>
            <view class="item" @click="goNext('bell')">
				<image src="/static/mine/bell.png" mode="">
			    <text>企业彩铃</text>
            </view>
            <view class="item" @click="goNext('friend')">
                <image src="/static/mine/team.png" mode="">
                <text>人脉市集</text>
            </view>
            <view class="item" @click="goNext('train')" v-if="!userInfo.mark_status">
                <image src="/static/mine/people.png" mode="">
                <text>快速获客</text>
                <image :class="[userInfo.is_mark ? 'hot ani' : 'hot']" src="/static/mine/hot.png" mode="widthFix">
            </view>
		</view>
		<view class="banner">
			<swiper class="show_swiper" autoplay="true" circular="true" :current="current">
				<swiper-item class="item" v-for="(item, index) in bannerList" :key="index" @click="goWeb(item.id)">
					<image :src="item.img" mode="widthFix"></image>
				</swiper-item>
			</swiper>
        </view>
        <view class="content">
            <view class="icon_block">
                <view class="item" v-for="(item, index) in iconList" :key="index" @click="gonext(index, item.url)">
                    <image :src="item.icon" mode="widthFix">
                    <view>{{item.title}}</view>
                </view>
            </view>
        </view>
        <view class="load_order" @click="getOrder" v-if="hasOrder">
			<view>待支付</view>
			<view>{{count}}</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import Json from '@/Json';
export default {
	data() {
		return {
            order_sn: '', // 待支付单号
            count: '', // 倒计时
			timer: null, // 定时器
			hasOrder: false, //延迟订单显示
			current: 0,
            setObj: {},
			iconList: [
				{
					icon: '/static/mine/icon01.png',
					title: '编辑信息',
					url: '/pages/mine/editmsg'
				},
				{
					icon: '/static/mine/icon02.png',
					title: '我的人脉',
					url: '/pages/mine/friend'
				},
				{
					icon: '/static/mine/icon03.png',
					title: '名片管理',
					url: '/pages/mine/card_management'
				},
				{
					icon: '/static/mine/icon04.png',
					title: '专属客服',
					url: '/pages/mine/service'
				},
			],
			bannerList: [
                {
                    id: 0,
                    img: '/static/mine/banner.png'
                },
                {
                    id: 1,
                    img: '/static/mine/banner01.png'
                },
                {
                    id: 2,
                    img: '/static/mine/banner02.png'
                }
            ]
		}
	},
	computed: {
    	...mapState(['userInfo'])
  	},
	onLoad() {
		// this.iconList = Json.iconList
        this.getLocal()

		// uni.redirectTo({
		// 	url: '/pages/sousou/sousou'
		// })
	},
	methods: {
        ...mapMutations({
			setUserInfo: 'setUserInfo'
		}),
		// 根据缓存获取用户信息
		getLocal() {
            //判断链接是否有参数覆盖
            let href = window.location.href
            let temp = href.split('?')[1];
            if (temp) {
                let url = decodeURIComponent(href)
                let result = this.getUrlparam(url)
                let value = result.hasOwnProperty('wxid') // 有wxid再去覆盖
                value ? this.$getAuthorize() : false
            }
            let value = uni.getStorageSync('userMsg')
            Object.keys(value).length == 4 ? this.getUserInfo() : this.$getAuthorize()
            this.userInfo.is_mark
                ? this.$delete(this.bannerList, 1)
                : this.$delete(this.bannerList, 2)
        },
        // 获取用户信息
		getUserInfo() {
            let value = uni.getStorageSync('userMsg')
            this.setObj = value
                this.$test
                    .post(`/?r=api/user/info`, {
                        wxid: value.wxid || this.userInfo.wxid
                    })
                    .then(response => {
                        if (response.code === 200) {
                            this.$set(response.data, 'wxid', value.wxid)
                            this.setUserInfo(response.data)
                            this.getloadingOrder()
                        }
                    })
        },
        // 获取进行中订单
        getloadingOrder() {
            let value = this.setObj
            if (value) {
                this.$test
                    .post(`/?r=api/index/index`, {
                        wxid: value.wxid
                    })
                    .then(response => {
                        // console.log(response)
                        if (response.code === 200) {
                            if (response.data.order_sn) {
                                let endtime = response.data.end_time
                                this.order_sn = response.data.order_sn
                                if (endtime) {
                                    this.timer = setInterval(() => {
                                        this.hasOrder = true
                                        this.countDown(endtime)
                                    }, 1000)
                                }
                            }
                        }
                    })
            }
        },
        // 获取url参数
        getUrlparam(url) {
            let askText = url.split('?')[1];
            let result = {};
            let askAry = askText.split('&');
            askAry.forEach(item => {
            let n = item.split('=');
            let key = n[0];
            let value = n[1];
            result[key] = value;
            });
            return result
        },
        // 计算倒计时
        countDown(endtime) {
            // var endtime = parseInt(new Date('2020/07/31,11:46').getTime()/1000)
            var nowtime = parseInt(new Date().getTime()/1000);
            var lefttime = parseInt(endtime - nowtime);
            var d = parseInt(lefttime / (24*60*60))
            var h = parseInt(lefttime / (60 * 60) % 24);
            var m = parseInt(lefttime / 60 % 60);
            var s = parseInt(lefttime % 60);
            d = addZero(d)
            h = addZero(h);
            m = addZero(m);
            s = addZero(s);
            this.count = `${m}:${s}`;
            this.hasOrder = true
            if (lefttime <= 0) {
                this.hasOrder = false
                clearInterval(this.timer)
                // console.log('clear!')
            }
            //小于10补0
            function addZero(i) {
                return i < 10 ? "0" + i: i + "";
            }
        },
        // 获取进行中订单信息并下单
        getOrder() {
            if (this.order_sn) {
                uni.navigateTo({
                    url: '/pages/pay/pay?order_sn='+this.order_sn
                })
            } else {
                uni.showToast({
                    title: '下单失败',
                    icon: 'none'
                })
            }
        },
		// 跳转首页
        goMark() {
            let value = this.testPost()
            if (value) {
                this.postMapUserInfo()
            } else {
                uni.showToast({
                    title: '请完善信息',
                    icon: 'none',
                    success: () => {
                        setTimeout(() => {
                            uni.setStorage({
                                key: "openPost",
                                data: true
                            })
                            uni.switchTab({
                                url: '/pages/home/home'
                            })
                        }, 800)
                    }
                });
            }
        },
        //验证是否下单
        testPost() {
            let guest = uni.getStorageSync('postMsg')
            if (!guest.tel) {
                return false
            }
            if (!(/^1[3456789]\d{9}$/.test(guest.tel))) {
                return false
            }
            // if (!guest.company_name) {
            //     return false
            // }
            // if (!guest.address) {
            //     return false
            // }
            return true
        },
        // 提交用户信下单
        postMapUserInfo() {
            let guest = uni.getStorageSync('postMsg')
            let str = uni.getStorageSync('mapStr')
            let result = {
                wxid: this.setObj.wxid,
                name: guest.company_name,
                tel: guest.tel,
                map: str,
                address: guest.address,
                company_id: guest.company_id
            }
            // console.log(result)
            this.$test
                .post(`/?r=api/order/map-submit`, result)
                .then(response => {
                    // console.log(response)
                    if (response.code === 200) {
                        uni.navigateTo({
                            url: '/pages/pay/pay?order_sn=' + response.data.order_sn
                        })
                    } else {
                        uni.showToast({
                            title: response.msg,
                            icon: 'none',
                        });
                    }
                })
        },
        // 跳转页面
        gonext(index, url) {
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
        },
        // 跳转
        goNext(type) {
			let url = ''
            switch (type) {
				case 'card':
					url = '/pages/mine/mine_card'
                    break;
                case 'bell':
					url = '/pages/mine/bell'
					break;
				case 'friend':
					url = '/pages/mine/connection'
					break;
				case 'train':
                    let value = this.userInfo.is_direct
                    value ? url = '/pages/train/detail' : url = '/pages/train/train'
					break;
				default:
					url = ''
			}
			uni.navigateTo({
				url: url
			})
		},
		// banner跳转
		goWeb(id) {
            switch (id) {
				case 0:
					uni.navigateTo({
					    url: '/pages/mine/mine_card'
				    })
					break;
				case 1:
					uni.switchTab({
                        url: '/pages/home/home'
                    })
					break;
				case 2:
					uni.navigateTo({
					    url: '/pages/train/train'
				    })
					break;
			}
		},
        // 跳转编辑页
        goEdit() {
            uni.navigateTo({
                url: '/pages/mine/editmsg'
            })
        }
	}
}
</script>

<style lang="scss">
#app {
    width: 100%;
    position: absolute;
    overflow-x: hidden;
    padding-top: 360rpx;
	padding-bottom: 100rpx;

	.header {
        width: 160%;
		position: absolute;
        top: 12.5%;
        left: 50%;
        height: 360rpx;
        transform: translate(-50%, -50%);
        background: url('/static/mine/bg.png') no-repeat center / 100%;
        border-radius: 0 0 50% 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 40rpx;

        .block {
            width: 62%;

            >view {
                display: flex;
                align-items: center;
            }
        }
        
        .top {
            padding: 60rpx 40rpx 50rpx;

            .img {
                margin-right: 26rpx;
                border: 2px solid #72A2EC;
                border-radius: 50%;
                overflow: hidden;

                >image {
                    display: block;
                    width: 100rpx;
                    height: 100rpx;
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
                        padding-right: 16rpx;
                        border-radius: 50rpx;
                    }
                }

                .on {
                    >text {
                        color: #BE8B3F;
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

                .off {
                    >text {
                        color: #9A9A9A;
                        background: #C9C9C9;

                        &::before {
                            content: '';
                            width: 30rpx;
                            height: 30rpx;
                            margin-left: 12rpx;
                            margin-right: 8rpx;
                            background: url('/static/mine/off_icon.png') no-repeat center / 100% 100%;
                        }
                    }
                }
            }
        }

        .bottom {
            width: 92%;
            margin: 0 auto;
            padding: 26rpx 30rpx 56rpx;
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
                color: #fff;
                padding: 0 22rpx;
                font-size: 28rpx;
                line-height: 56rpx;
                border-radius: 40rpx;
                background: #FE5567;

                &::after {
                    content: "";
                    width: 13rpx;
                    height: 13rpx;
                    border-top: 1.5px solid #fff;
                    border-right: 1.5px solid #fff;
                    transform: rotate(45deg);
                    margin-left: 6rpx;
                    margin-right: 4rpx;
                }
            }
        }
	}

	.container {
        display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx auto;
        
		.item {
            position: relative;
			flex: 1;
			display: flex;
			align-items: center;
			flex-direction: column;
			padding: 24rpx 0;

			>image {
				display: block;
				width: 94rpx;
                height: 94rpx;
				margin-bottom: 14rpx;
			}

			>text {
				font-size: 26rpx;
				font-weight: bold;
			}

            .hot {
                position: absolute;
                top: 0rpx;
                right: 40rpx;
                width: 32rpx;
            }

            .ani {
                animation: fade 1000ms infinite;
            }

            @keyframes fade {
                from {
                    opacity: 1.0;
                }
                50% {
                    opacity: 0.2;
                }
                to {
                    opacity: 1.0;
                }
            }

            @-webkit-keyframes fade {
                from {
                    opacity: 1.0;
                }
                50% {
                    opacity: 0.2;
                }
                to {
                    opacity: 1.0;
                }
            }
		}
	}

    .content {
        width: 92%;
        margin: 20rpx auto 40rpx;
        background: #fff;
        border-radius: 28rpx;

        .icon_block {
			padding: 0 30rpx;
            padding-bottom: 20rpx;

            .item {
				position: relative;
				display: flex;
				align-items: center;
                padding: 26rpx 0;

				&:not(:last-child) {
                    border-bottom: 1px solid #EAEAEA;	
				}
				
                >image {
                    display: block;
                    width: 70rpx;
					margin-right: 20rpx;
                }

                >view {
                    color: #323232;
                    font-size: 30rpx;
					font-weight: bold;
                }

				&::after {
					content: "";
					position: absolute;
					right: 0;
                    width: 15rpx;
                    height: 15rpx;
                    border-top: 1px solid #939393;
                    border-right: 1px solid #939393;
                    transform: rotate(45deg);
                    margin-left: 6rpx;
                    margin-right: 4rpx;
				}
            }
        }
    }

    .banner {
        width: 92%;
        margin: 0 auto;

		.show_swiper {
			height: 139rpx;

			image {
				display: block;
				width: 100%;
			}
		}
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
        background: url('/static/index/clock.png') no-repeat center / 100% 100%;

        >view {
            color: #FF4435;
            font-size: 26rpx;
            font-weight: bold;
        }
    }
}
</style>
