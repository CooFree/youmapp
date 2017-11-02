import MemberChannel from '../../../channels/member';

const memberChannel = new MemberChannel();
Page({
  data: {
    applyId: 0,
    orderId: 0,
    type: 1,
    content: '',
    reasonIndex: 0,
    applyInfo: {},
    applyMsgList: [],
    reasonList: [
      '请选择申请原因',
      '退运费',
      '质量问题',
      '型号、功率、颜色等与商品页面描述不符',
      '功能、效果不符',
      '少件、漏发',
      '包装、商品破损',
      '未按约定时间发货',
      '发票问题',
      '其他原因'
    ],
  },
  onLoad: function (options) {
    const applyId = parseInt(options.apply_id) || 0;
    const orderId = parseInt(options.order_id) || 0;
    this.setData({ applyId, orderId });

    this.loadApplyData(applyId, orderId);
  },
  changeContent: function (event) {
    const { value } = event.detail;
    this.setData({ content: value });
  },
  loadApplyData: function (applyId, orderId) {
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
  },
  checkType: function (event) {
    const { type } = event.currentTarget.dataset;
    this.setData({ type });
  },
  changeReason: function (event) {
    const index = parseInt(event.detail.value) || 0;

    this.setData({ reasonIndex: index });
  },
  onSubmit(event) {
    const { applyflag } = event.currentTarget.dataset;
    let { applyId, orderId, type, content, reasonIndex, reasonList, applyInfo } = this.data;
    //content = content.trim();
    if (applyflag === 0) {
      if (type === 0) {
        wx.showToast({ title: '请选择售后类型', image: '../../../images/alertx.png' });
        return;
      }
      if (reasonIndex === 0) {
        wx.showToast({ title: '请选择原因', image: '../../../images/alertx.png' });
        return;
      }
      if (content.length === 0) {
        wx.showToast({ title: '内容不能为空', image: '../../../images/alertx.png' });
        return;
      }
      const reason = reasonList[reasonIndex];
      //提交申请
      memberChannel.saveApply(orderId, type, reason, content).then((result) => {
        if (result) {
          this.loadApplyData(0, orderId);
          this.setData({ content: '', reasonIndex: 0 });
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }
    else {
      if (content.length === 0) {
        wx.showToast({ title: '内容输入不能为空', image: '../../../images/alertx.png' });
        return;
      }
      if (applyId === 0) {
        applyId = applyInfo.apply.id;
      }
      //提交回复
      memberChannel.replyApply(applyId, content).then((result) => {
        if (result) {
          this.loadApplyData(applyId, 0);
          this.setData({ content: '' });
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }

  }
})