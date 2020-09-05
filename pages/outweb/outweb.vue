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
			let url = 'http://dt.sousou.com/?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http://thirdwx.qlogo.cn/mmopen/vi_32/kFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw/132&wxid=wpxgorng#/'

			// this.getRoute(url)
			let result = getUrlparam(url)
			this.deco = result
			console.log(result)

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
		methods: {
			getRoute(url) {
				let test = url.split('#')[1]
				let route = test.split('?')[0];
				console.log(route);
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
