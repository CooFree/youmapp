import HomeChannel from '../../channels/home';
import memberState from '../../utils/memberState';

const homeChannel = new HomeChannel();
Page({
  data: {
    ticketActId: '',
    ticketList: []
  },
  onLoad: function (options) {
    const ticketActId = options.tid || '';
    this.setData({ ticketActId });
    this.loadData();
  },
  loadData: function () {
    const { ticketActId } = this.data;
    wx.showLoading();
    homeChannel.getScoreExchTicketList(ticketActId).then(data => {
      this.setData({ ticketList: data });
      wx.hideLoading();
    });
  },
  bindTicket(event) {
    const { actid } = event.currentTarget.dataset;
    if (memberState.isLogin() === true) {
      homeChannel.scoreExchTicket(actid).then(data => {
        if (data) {
          if (data.result === 1) {
            wx.navigateTo({ url: '../success/success?msg=领取成功' });
          }
          else {
            wx.showToast({ title: data.msg, image: '../../images/errorx.png' });
          }
        }
      });
    }
    else {
      wx.navigateTo({ url: '../login/login' });
    }
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onShareAppMessage: function () {

  }
})