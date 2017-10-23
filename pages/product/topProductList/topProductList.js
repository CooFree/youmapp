import { TopCategoryArray } from '../../../constant';
import ProductChannel from '../../../channels/product';
const productChannel = new ProductChannel();

const pageSize = 10;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    productList: [],
    prodClassId: 0,
    TopCategoryArray: TopCategoryArray
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ prodClassId: options.prod_classid });

    this.loadData(options.prod_classid);
  },
  loadData: function () {
    this.setData({ loading: true });
    productChannel.getTopProductList(this.data.prod_classid, pageSize).then(data => {
      this.setData({ productList: data, loading: false });
    });
  },
  onChangeTab: function (event) {
    const classId = event.currentTarget.dataset.hi;
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