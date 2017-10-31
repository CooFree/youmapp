// pages/member/orderDetail/orderDetail.js
import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';
const memberChannel = new MemberChannel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderID: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetail(options.order_id);
  },
  getOrderDetail: function(id){
    memberChannel.getOrderDetail(id).then(data => {
      this.setData({
        orderInfo: data,
        orderID: id
      })
    })
  },
  cancelOrder: function (event) {
    let id = event.currentTarget.dataset.orderid;
    memberChannel.cancelOrder(id).then(data => {
      if (data) {
        this.getOrderDetail(this.data.orderID);
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})