import MemberChannel from '../../../channels/member';

const orderChannel = new MemberChannel();
const pageSize=10;
Page({
  page:1,
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
        orderChannel.getOrderList(showStatus, this.page, pageSize).then(data => {
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
      orderChannel.getOrderList(showStatus, this.page, pageSize).then(data => {
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
  }
})