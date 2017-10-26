// pages/member/profile/profile.js
import MemberChannel from '../../../channels/member';
import PortalChannel from '../../../channels/portal';
import util from '../../../utils/util';
const memberChannel = new MemberChannel();
const portalChannel = new PortalChannel();
let date = new Date();
let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: today,
    endDate: date,
    animationAddressMenu: {},
    addressMenuIsShow: false,
    regionData: [],
    value: [0, 0, 0],
    provinces: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
    citys: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
    areas: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
    areaInfo: ''
  },
  bindDateChange: function (event) {
    let date = event.detail.value;
    this.setData({
      date: date
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    portalChannel.getRegionData().then((data) => {
      this.setData({
        regionData: data,
        provinces: this.findRegionData(-1, data)
      })
    })
  },
  cityChange: function (event) {
    let value = event.detail.value;
    let provinces = this.data.provinces;
    let citys = this.data.citys;
    let areas = this.data.areas;
    let provinceNum = value[0];
    let cityNum = value[1];
    let countyNum = value[2];
    let data = this.data.regionData;

    if (this.data.value[0] != provinceNum) {
      let id = provinces[provinceNum].region_id;
      this.setData({
        value: [provinceNum, 0, 0],
        citys: this.findRegionData(id, data),
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      let id = citys[cityNum].region_id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: this.findRegionData(citys[cityNum].region_id, data),
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  findRegionData: function (parentRegionId, data) {
    let regionData = [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }];
    for (let region of data) {
      if (region.region_id === parentRegionId) {
        regionData = regionData.concat(region.region_list);
        break;
      }
    }
    return regionData;
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