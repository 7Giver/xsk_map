import Vue from 'vue'
import App from './App'
import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
const http = uni_request({
    baseURL: 'http://aishangshi689.com', // 正式地址
    header:{
      'content-type':'multipart/form-data',
    },
    timeout: 60000,
    // #ifdef H5
    withCredentials: true
    // #endif
})
// #ifdef H5
import jwx from './common/jwx.js'
Vue.prototype.$jwx = jwx
// #endif

Vue.prototype.$http = http
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
