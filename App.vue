<script>
import { mapState, mapMutations } from 'vuex';
var testjs = require("@/common/vconsole.min.js");
// new testjs()
export default {
    computed: {
    	...mapState(['userInfo', 'wxid'])
  	},
    onLaunch: function () {
        // console.log('App Launch')
        // uni.removeStorageSync('postMsg');

        // #ifdef H5
        uni.setStorageSync('state_ios_href', location.href)
        // #endif

        // 测试用
        // this.testSet()

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
            setWxid: "setWxid",
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
        // 获取用户信息
		getUserInfo() {
            let value = uni.getStorageSync('wxid')
            if (value) {
                this.setWxid(value)
                this.$http
                    .post(`/?r=api/user/info`, {
                        wxid: value
                    })
                    .then(response => {
                        if (response.code === 200) {
                            this.setWxid(value)
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
