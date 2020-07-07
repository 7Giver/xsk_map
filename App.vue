<script>
	var testjs = require("@/common/vconsole.min.js")
	// new testjs()
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			
			// 测试用
			// this.testSet()
			
			// 进入应用授权
			// this.$getAuthorize()
			
			//强制缓存
			// this.goShowquan1()

		},
		onShow: function() {
			// console.log('App Show')

		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			// 测试用缓存
			testSet() {
				let obj = {
					"nickname": "Heiz",
					"openid": "o8MX9wwt5ozZ033IVjTqqNsM4c1A",
					"headimgurl": "http://thirdwx.qlogo.cn/mmopen/vi_32/kFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuAYxlTXJicA5gKsp6TicmNaLQ/132"
				}
				uni.setStorage({
					key: 'userMsg',
					data: obj
				})
			},
			// 不判断缓存直接存贮
			goShowquan1() {
				var url = window.location.href;
				var temp = url.split('?')[1]; // 通过拆分链接判断是否获取参数存储
				if (temp) {
					uni.setStorage({
						key: 'userMsg',
						data: this.getUrlparam(url)
					})
				} else {
					window.location.href = `${this.$baseURL}/api/geMapWxInfo`
				}
			}
		}
	}
</script>

<style lang="scss">
	@import 'app.scss';
</style>
