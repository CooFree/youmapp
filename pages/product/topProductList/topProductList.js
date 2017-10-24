import { TopCategoryArray } from '../../../constant';
import ProductChannel from '../../../channels/product';

const productChannel = new ProductChannel();
const pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    prodClassId: 0,
    TopCategoryArray: TopCategoryArray
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const prodClassId = parseInt(options.prod_classid) || 0;
    this.setData({ prodClassId });
    this.loadData(prodClassId);
  },
  loadData: function (prodClassId) {
    if (prodClassId > 0) {
      wx.showLoading();
      productChannel.getTopProductList(prodClassId, pageSize).then(data => {
        this.setData({ productList: data });
        wx.hideLoading();
      });
    }
  },
  onChangeTab: function (event) {
    const classId = event.currentTarget.dataset.cateid;
    this.setData({ prodClassId: classId });

    this.loadData(classId);
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