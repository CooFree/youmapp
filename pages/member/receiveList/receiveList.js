import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
Page({
  data: {
    receiveList: []
  },
  onLoad: function (options) {
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
  editReceive: function (event) {
    const receiveid = event.currentTarget.dataset.receiveid;
    wx.navigateTo({ url: '../receive/receive?receive_id=' + receiveid });
  },
  onShow: function () {
    this.loadData();
  },
})