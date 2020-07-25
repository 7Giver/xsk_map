<template>
	<view v-show="isready">
		<card v-show="select == 0"></card>
		<connection v-if="select == 1"></connection>
		<mine v-show="select == 3" @change="change"></mine>
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
				setObj: {},
				select: 0,
				is_mark: false,
				isready: false
			}
		},
		computed: {
    		...mapState(['userInfo'])
  		},
		onShow() {
			// this.changeSelect()
			this.select = 3
			this.getLocal()
			// console.log(this.userInfo)
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
				this.getUserInfo()
				// 根据userInfo是否为空请求
				// Object.keys(this.userInfo).length == 0 ? this.getUserInfo() : this.isready = true
			},
			getUserInfo() {
				// console.log('getUserInfo')
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
