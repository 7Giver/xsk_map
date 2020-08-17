<template>
    <view id="app">
		<uni-nav-bar title="地图标注服务协议" left-icon="back" @clickLeft="back"></uni-nav-bar>
        <view class="aggrement-section">
			<view class="title" style="text-align:center">《电子地图标注服务合同》</view>
			<view class="title"></view>
            <view>甲方：客户</view>
            <view>乙方：江西搜搜信息科技有限公司</view>
            <view>甲、乙双方经友好协商，就乙方为甲方提供的电子地图标注服务达成如下协议:</view>
            <view class="aggrement-section">
                <view class="title">一、服务内容</view>
                <view>基于电子地图的位置标注服务，具体上线平台包括：百度地图、高德地图、腾讯地图、等。地图标注服务完成后，乙方确保甲方公司在地图平台搜索定位到具体地址。</view>
            </view>
			<view class="aggrement-section">
				<view class="title">二、服务费用</view>
				<view>自双方确定合作意向后，乙方即开始为甲方制作地图标注，甲方支付乙方技术服务费用共计78元至乙方指定账户。</view>
                <view>服务费为一次性支付，即支付后不予退还；但因不可抗体力致本合同解除，需全额退还。</view>
			</view>
			<view class="aggrement-section">
				<view class="title">三、争议解决</view>
				<view>双方应在友好协商的基础上予以解决；经友好协商仍不能解决的，甲乙任何一方有权将争议提交乙方所在地有管辖权的法院进行解决；适用中华人民共和国现行有效的法律。</view>
			</view>
			<view class="aggrement-section">
				<view class="title">四、服务时间</view>
				<view>
					本合同自双方盖章之日起有效；乙方为甲方进行地图数据平台更新、地图数据展示支持、甲方主体所有人无变更的情况下在地图平台数据将永久有效；如甲方出现地址搬迁、电话变号等业务，应及时通知乙方为其进行免费变更地图数据，使其在地图中具有准确性。
				</view>
			</view>
			<view class="aggrement-section">
				<view class="title">五、保密协议</view>
				<view>
					双方一致同意，作好双方信息保密工作，不得将双方的各种宣传信息和产品售价等披露给第三方，不得有任何损害另一方利益的行为发生。本合同扫描件、影印件与原件具有同等法律效力。
				</view>
			</view>
        </view>
    </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
export default {
	components: {
		uniNavBar
	},
    data() {
        return {
			order_sn: ''
		};
	},
	onLoad(option) {
		this.order_sn = option.order_sn
	},
	methods: {
		// 返回上级页面
		back() {
			uni.redirectTo({
				url: '/pages/pay/pay?order_sn='+this.order_sn
			})
		},
	}
};
</script>

<style lang="scss">
#app {
    padding: 0rpx 20rpx 40rpx;
    background-color: #fff;
    font-size: 26rpx;

    .aggrement-section {
        line-height: 1.5;

        .title {
            font-weight: bold;
            font-size: 28rpx;
            line-height: 60rpx;
        }

        .agg-item {
            font-size: 24rpx;
            color: #665656;
        }
    }
}
</style>
