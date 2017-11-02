import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';
import memberState from '../../../utils/memberState';

const pageSize = 10;
const memberChannel = new MemberChannel();
Page({
  page: 1,
  data: {
    prodCommentList: [],
    previewCommentpic: '',
    loadEnd: false
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData: function (more) {
    const { loadEnd, prodCommentList } = this.data;
    if (more) {
      if (loadEnd === false) {
        this.page++;
        wx.showLoading();
        memberChannel.getCommentList(this.page, pageSize).then(data => {
          wx.hideLoading();
          this.setData({
            prodCommentList: prodCommentList.concat(data),
            loadEnd: data.length === 0
          });
        });
      }
    }
    else {
      this.page = 1;
      wx.showLoading();
      memberChannel.getCommentList(this.page, pageSize).then(data => {
        wx.hideLoading();
        this.setData({
          prodCommentList: data,
          loadEnd: data.length === 0
        });
      });
    }
  },
  showPreview: function (event) {
    const { image } = event.currentTarget.dataset;
    this.setData({ previewCommentpic: image });
  },
  hidePreview: function () {
    this.setData({ previewCommentpic: '' });
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadData(true);
  },
})