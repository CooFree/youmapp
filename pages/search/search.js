// pages/search/search.js
import util from '../../utils/util';
import HomeChannel from '../../channels/home';
import generalConfig from '../../generalConfig';
const homeChannel = new HomeChannel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchKeywordList: [],
        isTyping: false,
        searchInput: '',
        searchPlaceholder: ''
    },
    toSearch: function (event) {
        var searchInput = this.data.searchInput;
        if (searchInput.length === 0) {
            searchInput = this.data.searchPlaceholder;
        }
        console.log('searchInput', searchInput);
        wx.navigateTo({ url: '../product/productSearch/productSearch?keyword=' + encodeURIComponent(this.data.searchInput) })
    },
    listenerTypeing: function (event) {
        var inputValue = event.detail.value;
        this.setData({
            searchInput: inputValue,
            isTyping: inputValue.length > 0
        });
    },
    clearInput: function (event) {
        this.setData({ searchInput: '' });
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
        this.setData({ searchPlaceholder: generalConfig.searchPlaceholder });
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