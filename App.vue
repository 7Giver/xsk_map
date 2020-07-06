<script>
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			
			this.goShowquan()
			
			// 测试setStorage
			// uni.setStorage({
			// 	key: 'testshow',
			// 	data: 'test'
			// })
			// var value = uni.getStorageSync('testshow')
			// console.log(value)
			// uni.getStorage({
			// 	key: 'testshow',
			// 	success: function(res) {
			// 		console.log(res.data);
			// 	}
			// });
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			// 授权跳转
			goShowquan() {
				var value = uni.getStorageSync('testshow')
				if (value) {
					console.log('APP has-storage')
				} else {
					console.log('APP no-storage')
					window.location.href = 'http://aishangshi689.com/api/geMapWxInfo'
				}
			}
		}
	}
</script>

<style lang="scss">
	@import 'app.scss';
</style>
