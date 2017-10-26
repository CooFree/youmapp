import OrderChannel from '../../channels/order';
import generalConfig from '../../generalConfig';
import buyTemp from '../../utils/buyTemp';

const orderChannel = new OrderChannel();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    totalAmount: 0,
    totalVolume: 0,
    preferential: 0,
    productList: [],
    preferList: [],
    giftList: [],
    checkAll: false,
    checkCount: 0,
    postageFreeAmount: 0,
    submiting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ postageFreeAmount: generalConfig.postageFreeAmount });
    this.loadBasket();
  },
  loadBasket: function () {
    wx.showLoading();
    orderChannel.getBasketData().then(data => {
      if (data) {
        let basketInfo = data.info;
        let productList = data.list;
        let checkAll = true;
        let checkCount = 0;
        productList.forEach((item, index) => {
          if (item.check_flag === 0) {
            checkAll = false;
          }
          else {
            checkCount++;
          }
        });

        this.setData({
          checkAll,
          checkCount,
          totalAmount: basketInfo.total_amount,
          totalVolume: basketInfo.total_volume,
          preferential: basketInfo.preferential,
          productList,
          preferList: basketInfo.prefer_list,
          giftList: basketInfo.gift_list
        });
      }
      wx.hideLoading();
    });
  },
  deleteBasket: function (event) {
    const { basketid } = event.currentTarget.dataset;
    orderChannel.deleteBasket(basketid).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  setBasketVolume: function (basketId, volume) {
    let { productList } = this.data;
    productList.every((item, index) => {
      if (item.basket_id === basketId) {
        item.volume = volume;
        return false;
      }
    });
    this.setData({ productList });

    orderChannel.setBasketVolume(basketId, volume).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  goSettle: function () {
    const { submiting, productList } = this.data;
    if (submiting === true) {
      return;
    }
    let specIdArray = [], volumeArray = [], locationArray = [], imageArray = [];
    productList.forEach((item, index) => {
      if (item.check_flag === 1 && item.volume > 0) {
        specIdArray.push(item.spec_id);
        volumeArray.push(item.volume);
        locationArray.push(item.location);
        imageArray.push(item.image_url);
      }
    });
    if (specIdArray.length === 0) {
      return;
    }
    buyTemp.addBasketBuy(specIdArray, volumeArray, locationArray, imageArray);
    wx.navigateTo({ url: '../order/orderConfirm/orderConfirm' });
  },
  onCheckCart: function (event) {
    let { basketid, checkflag } = event.currentTarget.dataset;
    let { productList } = this.data;
    productList.every((item, index) => {
      if (item.basket_id === basketid) {
        item.check_flag = checkflag === 1 ? 0 : 1;
        return false;
      }
    });
    this.setData({ productList });

    orderChannel.checkBasket(basketid, checkflag === 1 ? 0 : 1).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  onCheckAllCart: function () {
    const { checkAll, productList } = this.data;
    productList.forEach((item, index) => {
      item.check_flag = checkAll ? 0 : 1;
    });
    this.setData({ checkAll: !checkAll, productList });
    orderChannel.checkAllBasket(checkAll ? 0 : 1).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  addVolume: function (event) {
    let { basketid, volume, reserve } = event.currentTarget.dataset;
    if (volume < reserve) {
      volume++;
      this.setBasketVolume(basketid, volume);
    }
  },
  reduceVolume: function (event) {
    let { basketid, volume } = event.currentTarget.dataset;
    if (volume > 1) {
      volume--;
      this.setBasketVolume(basketid, volume);
    }
  },
  changeVolume: function (event) {
    let { basketid, reserve } = event.currentTarget.dataset;
    let volume = parseInt(event.detail.value) || 0;
    if (volume < 1) {
      volume = 1;
    }
    if (volume > reserve) {
      volume = reserve;
    }
    this.setBasketVolume(basketid, volume);
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
    this.loadBasket();
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