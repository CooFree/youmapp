// pages/member/orderTrace/orderTrace.js
import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';
const memberChannel = new MemberChannel();

Page({
  data: {
    orderId:0,
    curIndex: 0,
    traceData: []
  },
  onLoad: function (options) {
    let orderId = parseInt(options.order_id) || 0;

    wx.showLoading();
    memberChannel.getOrderTrace(orderId).then(data => {
      if (data) {
        this.setData({ traceData: data.list, orderId });
      }
      wx.hideLoading();
    });
  },
  changeTab: function (event) {
    const { index } = event.currentTarget.dataset;
    this.setData({ curIndex: index });
  }
})