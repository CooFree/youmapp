import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';

const memberChannel = new MemberChannel();
Page({
  data: {
    orderId: 0,
    orderInfo: {},
    productList: [],
    giftList: []
  },
  onLoad: function (options) {
    const orderId = parseInt(options.order_id) || 0;
    this.setData({ orderId });
    this.getOrderDetail();
  },
  getOrderDetail: function () {
    const { orderId } = this.data;
    wx.showLoading();
    memberChannel.getOrderDetail(orderId).then(data => {
      if (data) {
        this.setData({
          orderInfo: data.order,
          productList: data.order_item_list,
          giftList: data.order_gift_list
        });
      }
      wx.hideLoading();
    });
  },
  cancelOrder: function (event) {
    const { orderId } = this.data;
    memberChannel.cancelOrder(orderId).then(result => {
      if (result) {
        this.getOrderDetail();
      }
    })
  },
  receiveOrder: function (event) {
    const { orderId } = this.data;
    memberChannel.receiveOrder(orderId).then(result => {
      if (result === true) {
        this.getOrderDetail();
      }
    });
  },
})