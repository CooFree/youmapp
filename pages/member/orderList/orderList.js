import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
const pageSize = 10;
Page({
  page: 1,
  data: {
    orderList: [],
    showStatus: '',
    loadEnd: false,
  },
  onLoad: function (options) {
    this.setData({ showStatus: options.show_status || '' });

    this.loadData();
  },
  loadData: function (more) {
    const { loadEnd, showStatus, orderList } = this.data;
    if (more) {
      if (loadEnd === false) {
        wx.showLoading();

        this.page++;
        memberChannel.getOrderList(showStatus, this.page, pageSize).then(data => {
          this.setData({
            orderList: orderList.concat(data),
            loadEnd: data.length === 0
          });
          wx.hideLoading();
        });
      }
    }
    else {
      wx.showLoading();

      this.page = 1;
      memberChannel.getOrderList(showStatus, this.page, pageSize).then(data => {
        this.setData({
          orderList: data,
          loadEnd: data.length === 0
        });
        wx.hideLoading();
      });
    }
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadData(true);
  },
  onCancelOrder: function (event) {
    const { orderid } = event.currentTarget.dataset;
    memberChannel.cancelOrder(orderid).then((result) => {
      if (result) {
        this.data.orderList.some((item, index) => {
          if (item.order_id === orderid) {
            item.cancel_flag = 1;
            item.show_status = 5;
            return true;
          }
        });
        this.setData({ orderList: this.data.orderList });
      }
    });
  }
})