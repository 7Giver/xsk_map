<script>
import { mapState, mapMutations } from 'vuex';
var testjs = require("@/common/vconsole.min.js");
// new testjs()
export default {
    onLaunch: function () {
        // console.log('App Launch')
        // uni.removeStorageSync('postMsg');

        // #ifdef H5
        uni.setStorageSync('state_ios_href', location.href)
        // #endif

        // 测试用
        // this.testSet()

        // 根据url获取参数
        this.getUserMsg()

        //获取用户信息
        this.getUserInfo()

        // 进入应用授权
        // this.$getAuthorize()
        
    },
    onShow: function () {
        // console.log('App Show')
    },
    onHide: function () {
        // console.log('App Hide')
    },
    methods: {
        ...mapMutations({
			setUserInfo: 'setUserInfo'
		}),
        // 测试用缓存
        testSet() {
            let obj = {
                headimgurl: "http://thirdwx.qlogo.cn/mmopen/vi_32/kFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuAYxlTXJicA5gKsp6TicmNaLQ/132",
				nickname: "Heiz",
				openid: "o8MX9wwt5ozZ033IVjTqqNsM4c1A",
				wxid: "wpxgorng#/"
			};
			let msg = {
				address: "无锡锡宁路前村工业园a区23",
				company_name: "大庆五金",
				tel: "13023367790"
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
				let newStr = askText.replace('#/','')
				let askAry = newStr.split('&');
				askAry.forEach(item => {
                    let n = item.split('=');
                    let key = n[0];
                    let value = n[1];
                    result[key] = value;
				});
				return result
			}
        },
        // 获取用户信息
		getUserInfo() {
            let value = uni.getStorageSync('userMsg')
            if (value.wxid) {
                value.wxid = value.wxid.replace('#/','');
                uni.setStorageSync('userMsg', value);
                this.$test
                    .post(`/?r=api/user/info`, {
                        wxid: value.wxid
                    })
                    .then(response => {
                        if (response.code === 200) {
                            this.$set(response.data, 'wxid', value.wxid)
                            this.setUserInfo(response.data)
                        }
                    });
            }
            
        },
    },
};
</script>

<style lang="scss">
@import "app.scss";
</style>
