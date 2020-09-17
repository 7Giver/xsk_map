const baseURL = 'http://server.yingku878.com/'

//把obj对象里的值覆盖到newobj里面
function deepCopy(newobj, obj) {
    if (typeof obj != "object") {
        return obj;
    }
    for (var attr in obj) {
        var a = {};
        if (newobj[attr]) {
            a = newobj[attr];
        }
        newobj[attr] = deepCopy(a, obj[attr]);
    }
    return newobj;
}

/**
 * 获取url参数
 *
 * @param {*} name
 * @param {*} [url=window.location.serach]
 * @returns
 */
function getQueryString(name, url) {
    var url = url || window.location.href;
    var reg = new RegExp("(^|&|/?)" + name + "=([^&|/#?]*)(&|/?|$)", "i");
    var r = url.substr(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return null;
}

/**
 *
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser() {
    // #ifdef H5
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase();
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
    // #endif

    return false;
}

/**
 * H5授权跳转
 */
function authH5() {
    let url = encodeURIComponent(location.href);
    location.href = `${baseURL}?r=api/direct/authorize&path=${url}`;
    return false;
}

// 提示框
function modelShow(
    title = "提示",
    content = "确认执行此操作吗?",
    callback = () => {},
    showCancel = true,
    cancelText = "取消",
    confirmText = "确定"
) {
    uni.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        confirmText: confirmText,
        success: function (res) {
            if (res.confirm) {
                // 用户点击确定操作
                setTimeout(() => {
                    callback();
                }, 500);
            } else if (res.cancel) {
                // 用户取消操作
            }
        },
    });
}

//时间戳转时间格式
function timeToDate(date, flag = false) {
    var date = new Date(date * 1000); //如果date为13位不需要乘1000
    var Y = date.getFullYear() + "-";
    var M =
        (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
    var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
    var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    if (flag) {
        return Y + M + D;
    } else {
        return Y + M + D + h + m + s;
    }
}

//验证是否是手机号
function isPhoneNumber(str) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

export {
    deepCopy,
    modelShow,
    timeToDate,
    isPhoneNumber,
    isWeiXinBrowser,
    getQueryString,
    authH5,
};
