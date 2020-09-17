import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		wxid: '',
		userInfo: {}
	},
    mutations: {
		setWxid(state, wxid) {
			state.wxid = wxid
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
	},
    actions: {}
})
export default store