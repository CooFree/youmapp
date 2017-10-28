import OrderChannel from '../../channels/order';
import generalConfig from '../../generalConfig';
import buyTemp from '../../utils/buyTemp';
import memberState from '../../utils/memberState';

const orderChannel = new OrderChannel();
Page({
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
    orderNotice: '',
    delBtnWidth: 164,
    txtStyle: '',
    isLogin: false,
  },
  onLoad: function (options) {
    this.setData({
      isLogin: memberState.isLogin(),
      postageFreeAmount: generalConfig.postageFreeAmount,
      orderNotice: generalConfig.orderNotice
    });
    this.initEleWidth();
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
    const { productList } = this.data;
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
  touchStart: function (event) {
    if (event.touches.length == 1) {
      this.setData({
        startX: event.touches[0].clientX
      });
    }
  },
  touchMove: function (event) {
    let e = event;
    let that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.productList;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        productList: list
      });
    }
  },
  touchEnd: function (event) {
    let e = event;
    let that = this;
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.productList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        productList: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
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
    this.setData({ isLogin: memberState.isLogin() });
    this.initEleWidth();
    this.loadBasket();
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