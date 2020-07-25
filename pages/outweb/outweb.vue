<template>
	<view>
		<!-- <web-view :src="url"></web-view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: '',
			}
		},
		onLoad(val) {
			// console.log(val)
			// this.url = decodeURIComponent(val.url) //解码网址
			
			let url = 'http://yingku878.com/?nickname=%E5%B0%8F%E9%BB%91%E8%B7%B3%E5%A4%A7&openid=o8MX9wx6dDqB1cJIzZDX4YL_tcfk&headimgurl=http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83epMDibiastt5Ggq7rooibVawyFViapO5RKE0GZee6LHyHibAj8K8VCGEMQAnj44QlIYj55gBxyrvlzAibWw/132&wxid=yexod6m5#/'
			// this.postOrder()
			// this.postQuery()
			let ab = decodeURIComponent(url)
			let result = getUrlparam(ab)
			console.log(result)

			function getUrlparam(url) {
				let askIndex = url.indexOf('?');
				let wellIndex = url.indexOf('#');
				let askText = url.substring(askIndex + 1, wellIndex);
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
			
		}
	}
</script>

<style>

</style>
