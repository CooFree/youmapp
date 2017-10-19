// pages/category/category.js
import ProductChannel from '../../channels/product';
import { TopCategoryArray } from '../../constant';

const productChannel = new ProductChannel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        TopCategoryArray: TopCategoryArray,
        CategoryData: [],
        SubCateData: []
    },
    getSubCates: function(event){
        let id = event.currentTarget.dataset.cateid;
        let cateData = this.data.CategoryData;
        cateData.forEach(function(value, index){
            if(value.id === id){
                this.setData({
                    SubCateData: value
                })
            }
        }.bind(this))
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        productChannel.getCategoryData().then(data => {
            data.forEach(function (value, index) {
                if (value.id === 30) {
                    this.setData({
                        SubCateData: value
                    })
                }
            }.bind(this))

            this.setData({
                CategoryData: data
            })
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