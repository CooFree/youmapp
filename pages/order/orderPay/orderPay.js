import util from '../../../utils/util';
import config from '../../../config';
import OrderChannel from '../../../channels/order';
import memberState from '../../../utils/memberState';

const app = getApp();
const orderChannel = new OrderChannel();
Page({
  data: {
    orderId: 0,
    orderInfo: null
  },
  onLoad: function (options) {
    const orderId = parseInt(options.order_id) || 0;
    const auth = app.globalData.weixinAuth;//微信已授权
    if (orderId > 0 && auth) {
      wx.showLoading();

      orderChannel.getOrderPayData(orderId, auth.openid).then(orderInfo => {
        this.setData({ orderInfo, orderId });
        wx.hideLoading();
      });
    }
  },
  weixinPay: function (event) {
    const { orderId, orderInfo } = this.data;
    if (orderInfo) {
      let api_param = orderInfo.pay_info.wxjs_api_param;
      console.log('api_param', api_param);
      if (api_param) {
        wx.requestPayment({
          timeStamp: api_param.timeStamp,
          nonceStr: api_param.nonceStr,
          package: api_param.package,
          signType: api_param.signType,
          paySign: api_param.paySign,
          success: (msg) => {
            wx.redirectTo({ url: '/success?msg=' + encodeURIComponent(msg) });
          },
          fail: (msg) => {
            console.log(msg);
            wx.redirectTo({ url: '/error?msg=' + encodeURIComponent(msg) });
          }
        });
      }
    }
  }
})