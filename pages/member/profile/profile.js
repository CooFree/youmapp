// pages/member/profile/profile.js
import MemberChannel from '../../../channels/member';
import PortalChannel from '../../../channels/portal';
import util from '../../../utils/util';
import RegionPicker from '../../../components/regionPicker/regionPicker.js';

const memberChannel = new MemberChannel();
const portalChannel = new PortalChannel();
let date = new Date();
let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
let defualtData = [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }];
Page({
  regionPicker: null,
  data: {
    regionData: null,
    headPortrait: '',
    sex: 0,
    name: '',
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,
    regionName: '',
    regionId: 0,

    date: 0,
    endDate: date,
    regionId: 0,

    memberOrderData: {},
    setProfile: null
  },
  onLoad: function (options) {
    this.regionPicker = new RegionPicker(this);

    memberChannel.getProfile().then((data) => {
      this.setData({
        loginName: data.login_name,
        headPortrait: data.head_portrait,
        sex: data.sex,
        name: util.decodeURI(data.name),
        birthYear: data.birth_year,
        birthMonth: data.birth_month,
        birthDay: data.birth_day,
      });

      this.regionPicker.load(data.province_id, data.city_id, data.area_id);
    });
  },
  setRegionData: function (data) {
    this.setData({ regionData: data });
  },
  sureRegion: function (regionId, regionName) {
    this.setData({ regionId, regionName });
  },
  saveProfile: function (event) {
    const { name, sex, birthYear, birthMonth, birthDay, regionId } = this.data;
    console.log('name', name);
    memberChannel.saveProfile(name, sex, birthYear, birthMonth, birthDay, regionId).then(data => {
      if (data) {
        wx.showToast({ title: '保存成功', icon: 'success', duration: 2000 });
      }
    })
  },
  setName: function (event) {
    let name = event.detail.value;
    this.setData({ name });
  },
  setSex: function (event) {
    let sex = parseInt(event.currentTarget.dataset.sex) || 0;
    this.setData({ sex });
  },
  bindDateChange: function (event) {
    let date = event.detail.value.split('-');
    this.setData({
      birthYear: parseInt(date[0]) || 0,
      birthMonth: parseInt(date[1]) || 0,
      birthDay: parseInt(date[2]) || 0
    });
  },
  selectDistrict: function (event) {
    this.regionPicker.selectRegion();
  },
  cityChange: function (event) {
    const { value } = event.detail;
    this.regionPicker.changeRegion(value);
  },
  // 点击地区选择取消按钮
  cityCancel: function (event) {
    this.regionPicker.cancelRegion();
  },
  // 点击地区选择确定按钮
  citySure: function (event) {
    this.regionPicker.sureRegion();
  },
})