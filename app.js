import config from './config';
import generalConfig from './generalConfig';
import util from './utils/util';
import memberState from './utils/memberState';
import PortalChannel from './channels/portal';
import ProductChannel from './channels/product';

//app.js
const portalChannel = new PortalChannel();
const productChannel = new ProductChannel();
App({
  onLaunch: function () {

    //let systemInfo = wx.getSystemInfoSync();
    //console.log('systemInfo',systemInfo);
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || [];
    //logs.unshift(Date.now());
    //wx.setStorageSync('logs', logs);

    //预加载通用配置
    portalChannel.getGeneralConfig().then(data => {
      if (data) {
        generalConfig.openOutpay = data.open_outpay;
        generalConfig.orderNotice = util.decodeURI(data.order_notice);
        generalConfig.postageFreeAmount = data.postage_free_amount;
        generalConfig.searchPlaceholder = util.decodeURI(data.search_placeholder);
      }
    });

    //预加载标签
    productChannel.getTagData();

    //预加载地区数据
    portalChannel.getRegionData();

    memberState.initLogin();
    if (memberState.isLogin() === false) {
      //console.log('wx.login');
      // 登录
      wx.login({
        success: res => {
          portalChannel.postLogin(res.code).then(memberId => {
            if (memberId) {
              memberState.saveLogin(memberId, true);
            }
          });
        }
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})