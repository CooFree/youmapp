import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';

const pageSize = 10;
const memberChannel = new MemberChannel();
Page({
  page: 1,
  data: {
    ticketList: [],
    ticketCode: ''
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData: function (more) {
    const { loadEnd, ticketList } = this.data;
    if (more) {
      if (loadEnd === false) {
        wx.showLoading();

        this.page++;
        memberChannel.getTicketList(this.page, pageSize).then(data => {
          this.setData({
            ticketList: ticketList.concat(data),
            loadEnd: data.length === 0
          });
          wx.hideLoading();
        });
      }
    }
    else {
      wx.showLoading();

      this.page = 1;
      memberChannel.getTicketList(this.page, pageSize).then(data => {
        this.setData({
          ticketList: data,
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
  changeTicketCode: function (event) {
    let ticketCode = event.detail.value;
    this.setData({ ticketCode });
  },
  bindTicket: function () {
    const ticketCode = this.data.ticketCode.trim();

    if (ticketCode.length > 0) {
      memberChannel.bindTicket(ticketCode).then(result => {
        if (result) {
          this.loadData();
        }
        else {
          wx.showToast({ title: '优惠券无效', image: '../../../images/errorx.png' });
        }
        this.setData({ ticketCode: '' });
      });
    }
  },
})