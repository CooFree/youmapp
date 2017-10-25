import OrderChannel from '../../channels/order';
import generalConfig from '../../generalConfig';

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
    postageFreeAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ postageFreeAmount: generalConfig.postageFreeAmount });
    this.loadBasket();
  },
  loadBasket: function () {
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
    });
  },
  deleteBasket: function (event) {
    const basketId = event.currentTarget.dataset.basketid;
    orderChannel.deleteBasket(basketId).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  clearBasket: function () {
    orderChannel.clearBasket().then(data => {
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
        return true;
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
    /*const { loading, productList } = this.props.basket;
    if (loading === true) {
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
    BuyTemp.addBasketBuy(specIdArray, volumeArray, locationArray, imageArray);
    const { history } = this.props.route;
    history.push('/order/orderConfirm');*/
  },
  onCheckCart: function (event) {
    const basketId = event.currentTarget.dataset.basketid;

    let { productList } = this.data;
    productList.every((item, index) => {
      if (item.basket_id === basketId) {
        item.check_flag = 1;
        return true;
      }
    });
    this.setData({ productList });

    orderChannel.checkBasket(basketId).then(data => {
      if (data) {
        this.loadBasket();
      }
    });
  },
  onCheckAllCart: function () {
    const { checkAll, productList } = this.data;
    productList.every((item, index) => {
      item.check_flag = 1;
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
    /*let volume = parseInt(text, 0);
    if (isNaN(volume) || volume < 1) {
      volume = 1;
    }
    if (volume > reserve) {
      volume = reserve;
    }
    this.setBasketVolume(basket_id, volume);*/
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