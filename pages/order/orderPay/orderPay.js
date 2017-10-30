import util from '../../../utils/util';
import config from '../../../config';
import OrderChannel from '../../../channels/order';
import memberState from '../../../utils/memberState';

const orderChannel = new OrderChannel();
Page({
  data: {
    orderId: 0,
    orderInfo: null
  },
  onLoad: function (options) {
    const orderId = parseInt(options.order_id) || 0;
    if (orderId > 0) {
      wx.showLoading();
      orderChannel.getOrderPayData(orderId).then(orderInfo => {
        this.setData({ orderInfo, orderId });
        wx.hideLoading();
      });
    }
  },
  weixinPay: function (event) {
    const { orderId, orderInfo } = this.data;
    if (orderInfo) {
      let api_param = orderInfo.pay_info.wxjs_api_param;
      if (api_param) {
        wx.requestPayment(api_param.timeStamp, api_param.nonceStr, api_param.package, api_param.signType, api_param.paySign,
          (msg) => {
            wx.redirectTo({ url: '/success?msg=' + encodeURIComponent(msg) });
          },
          (msg) => {
            wx.redirectTo({ url: '/error?msg=' + encodeURIComponent(msg) });
          });
      }
    }
  }
})