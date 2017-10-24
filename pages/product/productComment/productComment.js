import ProductChannel from '../../../channels/product';

const productChannel = new ProductChannel();
const pageSize = 12;
Page({
    page: 1,
    /**
     * 页面的初始数据
     */
    data: {
        productId: 0,
        commentCount: 0,
        productCommentList: [],
        loadEnd: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const productId = parseInt(options.prod_id) || 0;
        const commentCount = parseInt(options.comment_count) || 0;

        if (productId > 0) {
            this.setData({ productId, commentCount });
            this.loadData();
        }
    },
    loadData: function (more) {
        const { productId, loadEnd, productCommentList } = this.data;
        if (more) {
            if (loadEnd === false) {
                wx.showLoading();

                this.page++;
                productChannel.getProductCommentList(productId, this.page, pageSize).then(data => {
                    this.setData({
                        productCommentList: productCommentList.concat(data),
                        loadEnd: data.length === 0
                    });

                    wx.hideLoading();
                });
            }
        }
        else {
            wx.showLoading();

            this.page = 1;
            productChannel.getProductCommentList(productId, this.page, pageSize).then(data => {
                this.setData({
                    productCommentList: data,
                    loadEnd: data.length === 0
                });

                wx.hideLoading();
            });
        }
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
        this.loadData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadData(true);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})