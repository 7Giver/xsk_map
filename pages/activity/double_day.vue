<template>
  <view id="app">
    <image src="/static/activity/double11_poster.png" mode="widthFix"></image>
    <view class="has_btn" @click.stop="goNext('activity')"
      >立即标注 免费领礼</view
    >
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {
    this.goShare();
  },
  methods: {
    // 跳转页面
    goNext(type) {
      let value = uni.getStorageSync("wxid");
      if (!value) {
        this.$getAuthorize();
        return false;
      }
      switch (type) {
        case "activity":
          uni.switchTab({
            url: "/pages/home/home",
            success: (e) => {
              uni.setStorageSync("openPost", true);
            },
          });
          break;
      }
    },
    // 调用微信自定义分享
    goShare() {
      let obj = {
        title: `全球狂欢节`,
        desc: `全年最低价 仅此一次`,
        shareUrl: this.$common.WxShareUrl(),
        imgUrl: `${this.$dataURL}/image/30/306b903ddf1ad29e2c6ef93424b71f5e.png`,
      };
      // #ifdef H5
      if (this.$jwx && this.$jwx.isWechat()) {
        this.$jwx.initJssdk((res) => {
          let shareData = {
            title: obj.title, // 分享标题
            desc: obj.desc, // 分享描述
            shareUrl: obj.shareUrl, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
          };
          this.$jwx.onMenuShareAppMessage(shareData, function (response) {
            // console.log('response', response)
          });
          //朋友圈分享
          let shareData1 = {
            title: obj.title, // 分享标题
            shareUrl: obj.shareUrl, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
          };
          this.$jwx.onMenuShareTimeline(shareData1, function (response) {
            // console.log('response', response)
          });
        });
      }
      // #endif
    },
  },
};
</script>

<style lang="scss">
#app {
  image {
    display: block;
    width: 100%;
  }

  .has_btn {
    position: fixed;
    left: 10%;
    bottom: 60rpx;
    // transform: translate(50%, 0);
    width: 80%;
    color: #EA6206;
    font-weight: bold;
    text-align: center;
    font-size: 38rpx;
    line-height: 100rpx;
    letter-spacing: 1rpx;
    border-radius: 130rpx;
    background: linear-gradient(180deg, #f5d583, #febd1c);
    animation: mymove 5s infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
  }
}
</style>
