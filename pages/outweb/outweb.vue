<template>
	<view id="app">
		<!-- <web-view :src="url"></web-view> -->
		<view>{{url}}</view>

		<view>{{deco}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
				deco: ''
			}
		},
		onLoad(val) {
			// console.log(val)
			let url = 'http://192.168.1.106:8000/?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw%2F132&wxid=wpxgorng#/'

			let url1 = 'http://dt.sousou.com/#/pages/train/train?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=https://thirdwx.qlogo.cn/mmopen/vi_32/kFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw/132&wxid=wpxgorng'
			let url2 = 'http://dt.sousou.com/'

			this.getHttpUrl(url1)
			// this.getHttpUrl(url2)

			// this.getRoute(url)
			let result = this.getUrlparam(url)
			this.deco = result
			console.log(result)

		},
		methods: {
			// 获取路由
			getRoute(url) {
				let test = url.split('#')[1]
				let route = test.split('?')[0];
				console.log(route);
			},
			// 获取分享链接
			getHttpUrl(url) {
				let test = url.split('?')[0].split('#')[0]
				console.log('getHttpUrl',test);
			},
			// 获取url参数
			getUrlparam(url) {
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
		}
	}
</script>

<style lang="scss">
#app {
	view {
		color: #333;
		font-size: 30rpx;
		margin-bottom: 30rpx;
		word-break: break-all;
	}
}
</style>
