<template>
	<view>
		<web-view :src="url"></web-view>
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
			console.log(val)
			this.url = decodeURIComponent(val.url) //解码网址
			
			// this.url = 'http://www.aishangshi689.com/api/go'
			// this.postOrder()
			// this.postQuery()
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
