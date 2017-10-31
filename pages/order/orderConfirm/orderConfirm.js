import OrderChannel from '../../../channels/order';
import generalConfig from '../../../generalConfig';
import buyTemp from '../../../utils/buyTemp';

const orderChannel = new OrderChannel();
Page({
  data: {
    submiting: false,
    prodAmount: 0,
    preferential: 0,
    deliveryFee: 0,
    giveScore: 0,
    orderAmount: 0,
    ticketUseflag: 1,
    deliveryList: [],
    receive: null,
    ticketList: [],
    preferList: [],
    productList: [],
    giftList: [],
    deliveryFeeResult: -1,
    paytype: 'weixin',
    deliveryId: 0,
    ticketId: 0,
    ticketName: '',
    receiveId: 0,
    invoiceFlag: 0,
    invoiceHead: '',
    postageFreeAmount: 0,
    orderNotice: '',
    reserveFlag: 1,
    amountFlag: 1
  },
  onLoad: function (options) {
    this.setData({
      postageFreeAmount: generalConfig.postageFreeAmount,
      orderNotice: generalConfig.orderNotice
    });

    this.loadData();
  },
  loadData: function () {
    const { paytype, deliveryId, ticketId, receiveId } = this.data;
    let buyData = buyTemp.jsonData();
    if (buyData) {
      wx.showLoading();
      orderChannel.getOrderConfirmData(ticketId, deliveryId, paytype, receiveId, buyData).then(data => {
        if (data) {
          this.setData({
            deliveryList: data.delivery_list,
            productList: data.basket_product_list,
            giftList: data.basket_gift_list,
            prodAmount: data.order.product_amount,
            orderAmount: data.order.amount,
            preferential: data.order.preferential,
            deliveryFee: data.order.delivery_fee,
            giveScore: data.order.give_score,
            ticketUseflag: data.ticket_useflag,
            receive: data.receive,
            ticketList: data.member_ticket_list,
            preferList: data.prefer_list,
            deliveryFeeResult: data.delivery_fee_result,
            paytype: data.order.pay_type,
            deliveryId: data.order.delivery_type,
            receiveId: data.receive.id || 0,
          });
        }
        wx.hideLoading();
      });
    }
  },
  selectPaytype: function (event) {
    const { paytype } = event.currentTarget.dataset;
    let deliveryId = 0;
    for (let item of this.data.deliveryList) {
      if (paytype === 'outpay' && item.outpay_flag === 1) {
        deliveryId = item.id;
        break;
      }
      else if (paytype !== 'outpay' && item.outpay_flag === 0) {
        deliveryId = item.id;
        break;
      }
    }
    this.setData({ paytype, deliveryId });
    this.loadData();
  },
  selectReceive: function (receiveId) {
    this.setData({ receiveId });
    this.loadData();
  },
  selecTicket: function (ticketId, ticketName) {
    this.setData({ ticketId, ticketName });
    this.loadData();
  },
  loadTicket: function () {
    this.loadData();
  },
  selecDelivery: function (event) {
    const { deliveryid } = event.currentTarget.dataset;
    this.setData({ deliveryId: deliveryid });
    this.loadData();
  },
  checkInvoice: function () {
    this.setData({ invoiceFlag: this.data.invoiceFlag === 1 ? 0 : 1 });
  },
  onUnload: function () {

  },
  onOrder: function () {
    const { submiting, paytype, deliveryId, ticketId, receiveId, invoiceHead, invoiceFlag, reserveFlag, amountFlag } = this.data;
    if (submiting === true) {
      return;
    }
    if (receiveId === 0) {
      wx.showToast({ title: '先选择收货地址', icon: 'loading', duration: 2000 });
      return;
    }
    if (reserveFlag === 0) {
      wx.showToast({ title: '库存不足', icon: 'loading', duration: 2000 });
      return;
    }
    let buyData = buyTemp.jsonData();
    if (!buyData) {
      wx.showToast({ title: '没有商品', icon: 'loading', duration: 2000 });
      return;
    }
    if (amountFlag === 0) {
      wx.showToast({ title: '金额不符', icon: 'loading', duration: 2000 });
      return;
    }
    const productVolume = buyTemp.getVolume();
    if (paytype === 'outpay' && productVolume > 3) {
      wx.showToast({ title: '货到付款不能超过3件', icon: 'loading', duration: 2000 });
      return;
    }

    this.setData({ submiting: true });
    orderChannel.postOrderConfirm(ticketId, deliveryId, paytype, receiveId, buyData, invoiceFlag === 1 ? invoiceHead.trim() : '').then(orderId => {
      this.setData({ submiting: false });
      if (orderId > 0) {
        buyTemp.clear();
        wx.redirectTo({ url: '../orderPay/orderPay?order_id=' + orderId });
      }
      else {
        wx.showToast({ title: '提交失败', icon: 'loading', duration: 2000 });
      }
    });
  }
})