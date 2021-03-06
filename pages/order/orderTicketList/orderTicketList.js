import util from '../../../utils/util';
import OrderChannel from '../../../channels/order';
import MemberChannel from '../../../channels/member';

const orderChannel = new OrderChannel();
const memberChannel = new MemberChannel();
Page({
  data: {
    ticketList: [],
    ticketCode: '',
    ticketId: 0
  },
  onLoad: function (options) {
    const ticketId = parseInt(options.ticket_id) || 0;
    const ticketList = orderChannel.getOrderConfirmCache().member_ticket_list || [];
    this.setData({ ticketId, ticketList });
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
          getCurrentPages().forEach((item, index) => {
            if (item.route.indexOf('/orderConfirm') > 0) {
              item.loadData(data => {
                this.setData({ ticketList: data.member_ticket_list });
              });
            }
          });
        }
        else {
          wx.showToast({ title: '优惠券无效', image: '../../../images/errorx.png' });
        }
        this.setData({ ticketCode: '' });
      });
    }
  },
  selectTicket: function (event) {
    let { ticketid, ticketname, ticketenable } = event.currentTarget.dataset;
    if (ticketenable === 1) {
      if (ticketid === this.data.ticketId) {
        ticketid = 0;
      }
      getCurrentPages().forEach((item, index) => {
        if (item.route.indexOf('/orderConfirm') > 0) {
          item.selecTicket(ticketid, ticketname);
        }
      });
      wx.navigateBack();
    }
  }
});