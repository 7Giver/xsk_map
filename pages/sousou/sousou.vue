<template>
	<view v-show="isready">
		<connection v-if="select == 1"></connection>
		<mine v-if="select == 3"></mine>
		<my-tabbar v-if="isready" :select="select" :is_mark="is_mark" @change="change"></my-tabbar>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import myTabbar from '@/components/my-tabbar/my-tabbar.vue';
	export default {
		components: {
			myTabbar
		},
		data() {
			return {
				select: 0,
				is_mark: false,
				setObj: {},
				isready: false,
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onShow() {
			this.select = 3
			this.getLocal()
		},
		methods: {
			...mapMutations({
				setUserInfo: 'setUserInfo'
			}),
			// 监听tabbar选中
			change(e) {
				this.select = e.select
			},
			// 根据缓存获取用户信息
			getLocal() {
				let value = uni.getStorageSync('userMsg')
				value ? this.setObj = value : this.$getAuthorize()
				// 根据userInfo是否为空请求
				Object.keys(this.userInfo).length == 0 ? this.getUserInfo() : this.isready = true
			},
			getUserInfo() {
				console.log('getUserInfo')
				this.$test
					.post(`/?r=api/user/info`, {
						wxid: this.setObj.wxid
					})
					.then(response => {
						if (response.code === 200) {
							this.$set(response.data, 'wxid', this.setObj.wxid)
							this.setUserInfo(response.data)
							this.isready = true
							!this.userInfo.is_mark ? this.is_mark = false : this.is_mark = true
						}
					});
			}
		}
	}
</script>

<style>

</style>
