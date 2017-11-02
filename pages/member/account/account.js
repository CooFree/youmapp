// pages/member/account/account.js
import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';

const memberChannel = new MemberChannel();
Page({
  data: {
    loginName: '',
    qqBindFlag: 0,
    alipayBindFlag: 0,
    sinaBindFlag: 0,
    weixinBindFlag: 0
  },
  onLoad: function (options) {
    wx.showLoading();
    memberChannel.getAccountData().then((data) => {
      wx.hideLoading();
      if (data) {
        this.setData({
          loginName: util.decodeURI(data.login_name),
          qqBindFlag: data.qq_bind_flag,
          alipayBindFlag: data.alipay_bind_flag,
          sinaBindFlag: data.sina_bind_flag,
          weixinBindFlag: data.weixin_bind_flag
        });
      }
    });
  },
  goMobileVerify: function (event) {
    const { settype } = event.currentTarget.dataset;
    wx.navigateTo({ url: '../mobileVerify/mobileVerify?settype=' + settype });
  }
})