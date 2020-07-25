<template>
    <view class="my-tabbar">
        <view
            :class="[select == index ? 'item on' : 'item']"
            v-for="(item, index) in data"
            :key="index"
            @click="checkItem(index, item.url)"
            v-show="!item.hide"
        >
            <view :class="{ hot: item.title == '快速获客' }">
                <image :src="item.icon" mode=""></image>
            </view>
            <text>{{ item.title }}</text>
        </view>
    </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: "myTabbar",
    props: {
        select: {
            type: Number,
            default: 3,
        },
        is_mark: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            checkIndex: 3,
            data: [
                {
                    title: "搜搜名片",
                    icon: "/static/sousou/home.png",
                    url: "/pages/sousou/card",
                },
                {
                    title: "人脉市集",
                    icon: "/static/sousou/friend.png",
                    url: "/pages/sousou/connection",
                },
                {
                    title: "快速获客",
                    icon: "/static/sousou/client.png",
                    url: "/pages/train/train",
                },
                {
                    title: "我的",
                    icon: "/static/sousou/mine.png",
                    url: "/pages/sousou/mine",
                },
            ],
        };
    },
    computed: {
    	...mapState(['userInfo'])
  	},
    mounted() {
        if(!this.is_mark) {
            this.$set(this.data[2], 'hide', true)
        } else {
            this.$set(this.data[2], 'hide', false)
        }
    },
    methods: {
        checkItem(index, url) {
            this.$emit('change', {
				select: index
            })
            uni.navigateTo({
                url: url
            })
        }
    },
};
</script>

<style lang="scss">
.my-tabbar {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 998;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    border-top: 1px solid #d8d8d8;
    background: #fff;

    .item {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 10rpx 0 6rpx;
        color: #a3a5b4;

        > view {
            position: relative;
            padding-bottom: 4rpx;

            > image {
                display: block;
                width: 52rpx;
                height: 52rpx;
            }
        }

        > text {
            font-size: 20rpx;
        }

        .hot::before {
            content: "";
            display: block;
            position: absolute;
            top: -20rpx;
            right: -22rpx;
            width: 38rpx;
            height: 48rpx;
            background: url("/static/sousou/hot.gif") no-repeat center / 100%
                100%;
            z-index: 999;
        }
    }

    .on {
        color: #232739;
    }
}
</style>
