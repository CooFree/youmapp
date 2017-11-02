import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
const pageSize = 10;
Page({
  page: 1,
  data: {
    type: 1,
    applyList: [],
    loadEnd: false
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData(more) {
    const { type, loadEnd, applyList } = this.data;
    if (more) {
      if (loadEnd === false) {
        this.page++;
        wx.showLoading();
        memberChannel.getApplyList(type, this.page, pageSize).then(data => {
          this.setData({
            applyList: applyList.concat(data),
            loadEnd: data.length === 0
          });
          wx.hideLoading();
        });
      }
    }
    else {
      this.page = 1;
      wx.showLoading();
      memberChannel.getApplyList(type, this.page, pageSize).then(data => {
        this.setData({
          applyList: data,
          loadEnd: data.length === 0
        });
        wx.hideLoading();
      });
    }
  },
  changeType: function (event) {
    const { type } = event.currentTarget.dataset;
    setData({type});
    this.loadData();
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadData(true);
  },
})