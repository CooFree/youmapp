// pages/member/productStore/productStore.js
import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';
const memberChannel = new MemberChannel();

const pageSize = 8;
Page({
  page: 1,
  data: {
    delBtnWidth: 164,
    txtStyle: '',
    productStore: [],
    loadEnd: false,
  },
  onLoad: function (options) {
    this.loadData();
    this.initEleWidth();
  },
  loadData: function (more) {
    const { loadEnd, productStore } = this.data;
    if (more) {
      if (loadEnd === false) {
        wx.showLoading();

        this.page++;
        memberChannel.getProductStore(this.page, pageSize).then(data => {
          this.setData({
            productStore: productStore.concat(data),
            loadEnd: data.length === 0
          });

          wx.hideLoading();
        });
      }
    }
    else {
      wx.showLoading();

      this.page = 1;
      memberChannel.getProductStore(this.page, pageSize).then(data => {
        this.setData({
          productStore: data,
          loadEnd: data.length === 0
        });

        wx.hideLoading();
      });
    }
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
      var list = that.data.productStore;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        productStore: list
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
      var list = that.data.productStore;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        productStore: list
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
  delStore: function (event) {
    const {storeid} = event.currentTarget.dataset;
    memberChannel.deleteProductStore(storeid).then(data => {
      let initData = this.data.productStore;
      initData.forEach(function (value, index, arr) {
        if (value.store_id === storeid) {
          initData.splice(index, 1);
        }
      });
      this.setData({
        productStore: initData
      });
    })
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadData(true);
  }
})