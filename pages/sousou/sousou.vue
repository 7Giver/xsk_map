<template>
	<view>
		<connection v-if="select == 1"></connection>
		<mine v-if="select == 3"></mine>
		<my-tabbar :select="select" @change="change"></my-tabbar>
	</view>
</template>

<script>
	import myTabbar from '@/components/my-tabbar/my-tabbar.vue';
	export default {
		components: {
			myTabbar
		},
		data() {
			return {
				select: 0
			}
		},
		onShow() {
			this.select = 3
		},
		methods: {
			change(e) {
				this.select = e.select
			}
		}
	}
</script>

<style>

</style>
