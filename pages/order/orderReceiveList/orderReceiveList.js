import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
Page({
  data: {
    receiveId: 0,
    receiveList: []
  },
  onLoad: function (options) {
    this.setData({ receiveId: parseInt(options.receive_id) || 0 });
    this.loadData();
  },
  loadData: function () {
    wx.showLoading();
    memberChannel.getReceiveList().then(data => {
      this.setData({ receiveList: data });

      wx.hideLoading();
    });
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  selectReceive: function (event) {
    const receiveid = event.currentTarget.dataset.receiveid;
    getCurrentPages().forEach((item, index) => {
      if (item.route.indexOf('/orderConfirm') > 0) {
        item.selectReceive(receiveid);
      }
    });
    wx.navigateBack();
  },
  editReceive: function (event) {
    const receiveid = event.currentTarget.dataset.receiveid;
    wx.navigateTo({ url: '../orderReceive/orderReceive?receive_id=' + receiveid });
  },
  onShow: function () {
    this.loadData();
  },
})