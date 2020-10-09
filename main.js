import Vue from 'vue'
import App from './App'
import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
import store from './store'
import * as Common from './common/api.js'

const baseURL = 'http://ztc1.st712.com' // 正式地址
const testURL = 'http://server.yingku878.com' // 测试地址
const dataURL = 'http://ztc2.st712.com' // 引用资源地址
const http = uni_request({
    baseURL: baseURL, 
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


//获取前端路由
function getRoute(url) {
  let route = url.split('#')[1].split('?')[0]
  return route
}

//获取所有url参数
function getUrlparam(url) {
  let askText = url.split('?')[1];
  let result = {};
  let newStr = askText.replace('#/','')
  let askAry = newStr.split('&');
  askAry.forEach(item => {
    let n = item.split('=');
    let key = n[0];
    let value = n[1];
    result[key] = value;
  });
  return result
}

// 跳转授权
Vue.prototype.$getAuthorize = () => {
  if (location.href.indexOf("wxid") >= 0) {
    let wxid = Common.getQueryString("wxid")
    uni.setStorageSync("wxid", wxid);
    location.reload()
  } else {
    let url = location.href.split('#')[1]
    let origin = location.origin
    switch (url) {
      case '/pages/activity/moon_festival':
        location.href = `${baseURL}?r=api/user/authorize`
        break;
      case '/pages/activity/national_day':
        let route = `${origin}/#/pages/train/train`
        location.href = `${baseURL}?r=api/user/authorize&path=${route}`
        break;
      default:
        Common.authH5()
    }
    uni.setStorage({
      key: "openPost",
      data: true
    })
  }
}

// 返回上一页
Vue.prototype.$back = () => {
  uni.navigateBack()
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
Vue.prototype.$dataURL = dataURL
Vue.prototype.$store = store
Vue.prototype.$http = http
Vue.prototype.$test = test
Vue.prototype.$common = Common;

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
