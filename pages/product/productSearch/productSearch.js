import utility from '../../../utils/utility';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        utility.request(
            '/product/productSearch.aspx',
            {
                'keyword': options.keyword,
                'page': 1,
                'page_size': 10
            },
            function (res) {
                console.log(res.data.list);
                this.setData({
                    'keyword': options.keyword,
                    'result': utility.doDecodeURI(res.data.list)
                })
            }.bind(this)
        )

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