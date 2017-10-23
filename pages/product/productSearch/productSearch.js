import ProductChannel from '../../../channels/product';
const productChannel = new ProductChannel();

const pageSize = 10;
Page({
    page: 1,
    /**
     * 页面的初始数据
     */
    data: {
        searchResult: [],
        keyword: '',
        loadEnd: false,
        loading: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ keyword: decodeURIComponent(options.keyword) });
        this.loadData();
    },
    loadData: function (more) {
        const { keyword, loadEnd, loading,searchResult } = this.data;

        if (more) {
            if (loading === false && loadEnd === false) {
                this.setData({ loading: true });

                this.page++;
                productChannel.getProductSearch(keyword, '', this.page, pageSize).then(data => {
                    this.setData({
                        searchResult: searchResult.concat(data),
                        loading: false,
                        loadEnd: data.length === 0
                    });
                });
            }
        }
        else {
            this.setData({ loading: true });

            this.page = 1;
            productChannel.getProductSearch(keyword, '', this.page, pageSize).then(data => {
                this.setData({
                    searchResult: data,
                    loading: false,
                    loadEnd: data.length === 0
                });
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