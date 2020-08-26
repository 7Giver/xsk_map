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
			// this.url = decodeURIComponent(val.url) //解码网址

			// let temp = window.location.href.split('#')[1]
			let href = undefined
			let temp = href.split('?')[1]; 
			console.log(temp)
			let url = 'http://yingku878.com/?nickname=%E5%B0%8F%E9%BB%91%E8%B7%B3%E5%A4%A7&openid=o8MX9wx6dDqB1cJIzZDX4YL_tcfk&headimgurl=http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epMDibiastt5Ggq7rooibVawyFViapO5RKE0GZee6LHyHibAj8K8VCGEMQAnj44QlIYj55gBxyrvlzAibWw/132&wxid=yexod6m5#/'
			let url1 = 'http://yingku878.com/#/?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuAYxlTXJicA5gKsp6TicmNaLQ%2F132&wxid=wpxgorng'

			let url2 = 'http://dt.sousou.com/#/pages/train/train?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw%2F132&wxid=wpxgorng'
			this.getRoute(url2)

			let ab = decodeURIComponent(url1)
			let str = ab.split('?')[1]
			// console.log(str)
			let result = getUrlparam(ab)
			this.deco = result
			// console.log(result)

			function getUrlparam(url) {
				let askText = url.split('?')[1];
				let result = {};
				let askAry = askText.split('&');
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
