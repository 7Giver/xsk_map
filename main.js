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
      var url = window.location.href;
      var temp = url.split('?')[1]; // 通过拆分链接判断是否获取参数存储
      if (temp) {
        uni.setStorage({
          key: 'userMsg',
          data: getUrlparam(url)
        })
      } else {
        // window.location.href = `${baseURL}/api/geMapWxInfo`  // 正式
        window.location.href = `${testURL}api/user/authorize`  // 测试
      }
    },
  });

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
}

/*注册全局自定义组件*/
import connection from '@/pages/sousou/connection.vue';
import mine from '@/pages/sousou/mine.vue';

Vue.component('connection', connection);
Vue.component('mine', mine);

Vue.prototype.$baseURL = baseURL
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$test = test
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
