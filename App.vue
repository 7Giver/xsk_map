<script>
var testjs = require("@/common/vconsole.min.js");
// new testjs()
export default {
    onLaunch: function () {
        // console.log('App Launch')
        uni.removeStorageSync('postMsg');

        // 测试用
        // this.testSet()

        // 进入应用授权
        // this.$getAuthorize()

        // 根据url获取参数
        // this.getUserMsg()
    },
    onShow: function () {
        // console.log('App Show')
    },
    onHide: function () {
        // console.log('App Hide')
    },
    methods: {
        // 测试用缓存
        testSet() {
            let obj = {
                headimgurl: "http://thirdwx.qlogo.cn/mmopen/vi_32/kFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuAYxlTXJicA5gKsp6TicmNaLQ/132",
				nickname: "Heiz",
				openid: "o8MX9wwt5ozZ033IVjTqqNsM4c1A",
				wxid: "wpxgorng"
			};
			let msg = {
				address: "士大夫大师傅",
				company_name: "对方的",
				tel: "13026689953"
			};
            uni.setStorage({
                key: "userMsg",
                data: obj,
			});
			uni.setStorage({
                key: "postMsg",
                data: msg,
            });
        },
        // 根据url获取参数
        getUserMsg() {
            var href = window.location.href;
            var temp = href.split("?")[1]; // 通过拆分链接判断是否获取参数存储
            if (temp) {
                let url = decodeURIComponent(window.location.href)
                uni.setStorage({
                    key: "userMsg",
                    data: getUrlparam(url),
                });
            }

            function getUrlparam(url) {
                let askText = url.split('?')[1];
                let result = {};
                let askAry = askText.split("&");
                askAry.forEach((item) => {
                    let n = item.split("=");
                    let key = n[0];
                    let value = n[1];
                    result[key] = value;
                });
                return result;
            }
        },
    },
};
</script>

<style lang="scss">
@import "app.scss";
</style>
