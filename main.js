import Vue from 'vue'
import App from './App'
import uni_request from 'js_sdk/songGQ-req/uni_request/uni_request.js'
import store from './store'

const baseURL = 'http://dt.sousou.com' // 正式地址
const testURL = 'http://server.yingku878.com' // 测试地址
const dataURL = 'http://cdn.tuku658.com' // 引用资源地址
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
  let href = window.location.href
  // let href = 'http://dt.sousou.com/#/pages/mine/connection?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw%2F132&wxid=wpxgorng'
  let temp = href.split('?')[1]; // 通过拆分链接判断是否获取参数存储
  if (temp) {
    let url = decodeURIComponent(href)
    uni.setStorage({
      key: 'userMsg',
      data: getUrlparam(url),
      success: () => {
        let url = getRoute(href)
        switch (url) {
          case '/pages/guest/guest':
            uni.switchTab({
              url: url,
              success: function(e) {
                location.reload();
              }
            })
            break;
          case '/pages/mine/mine':
            uni.switchTab({
              url: url,
              success: function(e) {
                location.reload();
              }
            })
            break;
          case '/pages/train/train':
            uni.redirectTo({
              url: url
            })
            break;
          case '/pages/mine/connection':
            uni.redirectTo({
              url: url
            })
            break;
          default:
            uni.switchTab({
              url: '/pages/home/home',
              success: function(e) {
                location.reload();
              }
            })
        }
      }
    })
  } else {
    let url = window.location.href.split('#')[1]
    // window.location.href = `${baseURL}/api/geMapWxInfo`  // 正式
    window.location.href = `${testURL}?r=api/user/authorize&path=${url}`  // 测试
  }

  function getRoute(url) {
    let test = url.split('#')[1]
    let route = test.split('?')[0];
    return route
  }

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
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
