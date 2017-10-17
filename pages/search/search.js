// pages/search/search.js
//import utility from '../../utils/utility';
//const homeChannel = new HomeChannel();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchKeywordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.request({
      url: 'https://app.you.camel.com.cn/search.aspx',
      data: {},
      method: 'get',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        res.data.list = res.data.list.map(function (item) {
          item = decodeURI(item);
          return item;
        })

        _this.setData({ searchKeywordList: res.data.list });
      },
      fail: function () {

      }
    })

    // homeChannel.getSearchKeyword().then(data => {
    //   console.log(data);
    //   this.setData({ searchKeywordList: data });
    // })
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