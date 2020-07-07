<script>
	var testjs = require("@/common/vconsole.min.js")
	// new testjs()
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			
			// 测试用
			// this.testSet()
			
			// 正式
			this.goShowquan()
			
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
			// 授权跳转
			goShowquan() {
				uni.getStorage({
					key: 'userMsg',
					success: function(res) {
						console.log('APP has-storage')
						// console.log(res.data);
					},
					fail: (error) => {
						console.log('APP no-storage')
						var url = window.location.href;
						var temp = url.split('?')[1]; // 通过拆分链接判断是否获取参数存储
						if (temp) {
							uni.setStorage({
								key: 'userMsg',
								data: this.getUrlparam(url)
							})
						} else {
							window.location.href = 'http://dt.sousou.com/api/geMapWxInfo'
						}
					},
				});
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
					window.location.href = 'http://dt.sousou.com/api/geMapWxInfo'
				}
			},
			getUrlparam(url) {
				let askIndex = url.indexOf('?'); // ? 第一次出现的位置索引 存在 askIndex
				let wellIndex = url.indexOf('#'); // # 第一次出现的位置索引 存在 wellIndex
				let askText = url.substring(askIndex + 1, wellIndex); // 从？的具体索引 +1 截取到# 的索引位置不包括#号   存在  askText
				// let wellText = url.substring(wellIndex + 1);  // 从#位置索引 +1 截取到最后   存在 wellText
				let result = {}; //  空对象
				let askAry = askText.split('&'); // 用指定的 & 分隔符 把？号后面获取到的字符串 拆成数组
				askAry.forEach(item => { // forEach 遍历这个 askAry 数组
					let n = item.split('='); // 在把数组中 item 的每一项用 = 拆分成数组
					let key = n[0];
					let value = n[1];
					result[key] = value;
				});
				return result
			},
		}
	}
</script>

<style lang="scss">
	@import 'app.scss';
</style>
