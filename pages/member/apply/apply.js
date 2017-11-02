import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
Page({
  reasonList: [
    { value: '', name: '请选择申请原因' },
    { value: '退运费', name: '退运费' },
    { value: '质量问题', name: '质量问题' },
    { value: '型号、功率、颜色等与商品页面描述不符', name: '型号、功率、颜色等与商品页面描述不符' },
    { value: '功能、效果不符', name: '功能、效果不符' },
    { value: '少件、漏发', name: '少件、漏发' },
    { value: '包装、商品破损', name: '包装、商品破损' },
    { value: '未按约定时间发货', name: '未按约定时间发货' },
    { value: '发票问题', name: '发票问题' },
    { value: '其他原因', name: '其他原因' }
  ],
  data: {
    applyId: 0,
    orderId: 0,
    type: 1,
    content: '',
    reason: '',
    applyInfo: {},
    applyMsgList: []
  },
  onLoad: function (options) {
    const applyId = parseInt(options.apply_id) || 0;
    const orderId = parseInt(options.order_id) || 0;
    this.setData({applyId,orderId});

    this.loadApplyData();
  },
  changeContent: function (event) {
    const { value } = event.detail;
    this.setData({ content: value });
  },
  loadApplyData: function () {
    const { applyId, orderId } = this.data;
    wx.showLoading();
    memberChannel.getApplyData(applyId, orderId).then((data) => {
      if (data) {
        this.setData({
          applyInfo: data.info,
          applyMsgList: data.list
        });
      }
      wx.hideLoading();
    });
  }
})