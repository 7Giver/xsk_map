import Vue from 'vue'
import App from './App'
import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
import store from './store'

const baseURL = 'http://dt.sousou.com' // 正式地址
const testURL = 'http://server.yingku878.com' // 测试地址
const http = uni_request({
    baseURL: baseURL, 
    // baseURL: testURL,  // 测试
    header:{
      'content-type':'multipart/form-data',
    },
    timeout: 60000,
    // #ifdef H5
    withCredentials: true
    // #endif
})

const test = uni_request({
  baseURL: testURL,  // 测试
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

// 跳转授权
Vue.prototype.$getAuthorize = () => {
  uni.getStorage({
    key: 'userMsg',
    success: function(res) {
      console.log('APP has-storage')
      // console.log(res.data);
    },
    fail: (error) => {
      console.log('APP no-storage')
      let href = window.location.href
      let temp = href.split('?')[1]; // 通过拆分链接判断是否获取参数存储
      if (temp) {
        let url = decodeURIComponent(window.location.href)
        uni.setStorage({
          key: 'userMsg',
          data: getUrlparam(url)
        })
      } else {
        let url = window.location.href.split('#')[1]
        // window.location.href = `${baseURL}/api/geMapWxInfo`  // 正式
        window.location.href = `${testURL}?r=api/user/authorize&path=${url}`  // 测试
      }
    },
  });

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
}

/*注册全局自定义组件*/
import connection from '@/pages/sousou/connection.vue';
import mine from '@/pages/sousou/mine.vue';
import card from '@/pages/sousou/card.vue';

Vue.component('connection', connection);
Vue.component('mine', mine);
Vue.component('card', card);

Vue.prototype.$baseURL = baseURL
Vue.prototype.$testURL = testURL
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$test = test
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
