// pages/category/category.js
import ProductChannel from '../../channels/product';
import { TopCategoryArray, TopCategory } from '../../constant';

const productChannel = new ProductChannel();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        topCategoryArray: TopCategoryArray,
        categoryData: [],
        subCateData: {},
    },
    getSubCates: function (event) {
        let cateid = event.currentTarget.dataset.cateid;
        const { categoryData } = this.data;
        categoryData.forEach(function (value, index) {
            if (value.id === cateid) {
                this.setData({ subCateData: value });
            }
        }.bind(this));
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading();

        productChannel.getCategoryData().then(data => {
            data.forEach(function (value, index) {
                if (value.id === TopCategory.Huwai) {
                    this.setData({ subCateData: value });
                }
            }.bind(this));
            this.setData({ categoryData: data });

            wx.hideLoading();
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