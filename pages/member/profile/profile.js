// pages/member/profile/profile.js
import MemberChannel from '../../../channels/member';
import PortalChannel from '../../../channels/portal';
import util from '../../../utils/util';
const memberChannel = new MemberChannel();
const portalChannel = new PortalChannel();
let date = new Date();
let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
let defualtData = [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: 0,
    endDate: date,
    animationAddressMenu: {},
    addressMenuIsShow: false,
    regionData: [],
    value: [0, 0, 0],
    provinces: defualtData,
    citys: defualtData,
    areas: defualtData,
    areaInfo: '',
    checkArea: false,
    memberOrderData: {},
    setProfile: null
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

    memberChannel.getProfile().then((data) => {
      this.setData({
        Profile: data,
        setProfile: data,
        date: data.birth_year + '-' +data.birth_month + '-' +data.birth_day,
      })
    })
  },
  saveProfile: function(event){
    let name = this.data.setProfile.name;
    let sex = this.data.setProfile.sex;
    let birthYear = this.data.setProfile.birth_year;
    let birthMonth = this.data.setProfile.birth_month;
    let birthDay = this.data.setProfile.birth_day;
    let area = this.data.setProfile.area_id;

    memberChannel.saveProfile(name, sex, birthYear, birthMonth, birthDay, area).then(data=>{
      if(data){
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  setName: function (event) {
    let name = event.detail.value;
    this.setData({
      'setProfile.name': name
    })
  },
  setSex: function(event){
    let sex = parseInt(event.currentTarget.dataset.sex);
    this.setData({
      'setProfile.sex': sex
    })
  },
  bindDateChange: function (event) {
    let value = event.detail.value;
    let date = value.split('-');
    this.setData({
      date: value,
      'setProfile.birth_year': date[0],
      'setProfile.birth_month': date[1],
      'setProfile.birth_day': date[2]
    })
  },
  selectDistrict: function (event) {
    var that = this
    // 如果已经显示，不在执行显示动画
    if (that.data.addressMenuIsShow) {
      return
    }
    // 执行显示动画
    that.startAddressAnimation(true)
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
      let resultReginData = this.findRegionData(id, data);
      this.setData({
        value: [provinceNum, 0, 0],
        citys: resultReginData,
        areas: defualtData,
        checkArea: false,
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      let id = citys[cityNum].region_id;
      let resultReginData = this.findRegionData(citys[cityNum].region_id, data);
      if (resultReginData.length === 1 && cityNum !== 0) {
        this.setData({
          value: [provinceNum, cityNum, 0],
          areas: resultReginData,
          checkArea: true,
          'setProfile.province_id': this.data.provinces[provinceNum].region_id,
          'setProfile.city_id': this.data.citys[cityNum].region_id,
        })
      } else {
        this.setData({
          value: [provinceNum, cityNum, cityNum],
          areas: resultReginData,
          checkArea: false
        })
      }
    } else {
      if (countyNum !== 0) {
        this.setData({
          value: [provinceNum, cityNum, countyNum],
          checkArea: true,
          'setProfile.province_id': this.data.provinces[provinceNum].region_id,
          'setProfile.city_id': this.data.citys[cityNum].region_id,
          'setProfile.area_id': this.data.areas[countyNum].region_id,
        })
      } else {
        this.setData({
          value: [provinceNum, cityNum, countyNum],
          checkArea: false
        })
      }
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
  startAddressAnimation: function (isShow) {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    this.animation = animation;
    var that = this;
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      that.animation.translateY(0 + 'vh').step();
    } else {
      that.animation.translateY(40 + 'vh').step();
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false);
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this;
    var city = that.data.city;
    var value = that.data.value;
    that.startAddressAnimation(false);
    // 将选择的城市信息显示到输入框
    var areaInfo = (that.data.provinces[value[0]].region_name + '，' + that.data.citys[value[1]].region_name + '，' + that.data.areas[value[2]].region_name).replace('，%E8%AF%B7%E9%80%89%E6%8B%A9', '');
    that.setData({
      areaInfo: areaInfo,
    })
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