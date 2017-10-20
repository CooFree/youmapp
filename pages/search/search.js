// pages/search/search.js
import util from '../../utils/util';
import HomeChannel from '../../channels/home';
const homeChannel = new HomeChannel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchKeywordList: [],
        isTyping: false,
        searchInput: ''
    },
    toSearch: function (event) {
        let value = event.detail.value;
        wx.navigateTo({
            url: '../product/productSearch/productSearch?keyword=' + value,
        })
    },
    listenerTypeing: function (event) {
        let temp;
        if (event.detail.value.length > 0) {
            temp = true
        } else {
            temp = false
        }
        this.setData({
            searchInput: event.detail.value,
            isTyping: temp
        })
    },
    clearInput: function (event) {
        this.setData({
            searchInput: ''
        })
    },
    navgatorBack: function (event) {
        wx.navigateBack();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        homeChannel.getSearchKeyword().then(data => {
            this.setData({ searchKeywordList: data });
        });
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