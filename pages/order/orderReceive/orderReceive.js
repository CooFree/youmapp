import regeneratorRuntime from '../../../modules/regenerator-runtime/runtime';
import RegionPicker from '../../../components/regionPicker/regionPicker';
import FormInput from '../../../components/formInput/formInput';
import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';

const memberChannel = new MemberChannel();
Page({
  regionPicker: null,
  formInputs: [],
  data: {
    regionData: [],
    formDatas: [],
    submiting: false,
    defaultFlag: 0,
    regionId: 0,
    regionName: '',
    regionError: false,
    regionMsg: '',
  },
  onLoad: function (options) {
    const receiveId = parseInt(options.receive_id) || 0;

    this.regionPicker = new RegionPicker(this);
    this.formInputs.push(new FormInput(this, { title: '地址', required: true, range: [5, 100], placeholder: '详细地址, 如街道、楼盘号等' }));
    this.formInputs.push(new FormInput(this, { title: '姓名', required: true, placeholder: '收货人姓名' }));
    this.formInputs.push(new FormInput(this, { title: '手机号', required: true, mobile: true, range: [11], placeholder: '收货人手机号' }));

    wx.showLoading();
    memberChannel.getReceiveInfo(receiveId).then((data) => {
      let name = '', address = '', mobile = '', regionId = 0, defaultFlag = 0, provinceId = 0, cityId = 0, areaId = 0;
      if (data) {
        name = util.decodeURI(data.name);
        address = util.decodeURI(data.address);
        mobile = util.decodeURI(data.mobile);
        regionId = data.region_id;
        defaultFlag = data.default_flag;
        provinceId = data.province_id;
        cityId = data.city_id;
        areaId = data.area_id;
      }

      const formDatas = [];
      formDatas.push(this.formInputs[0].load(0, address));
      formDatas.push(this.formInputs[1].load(1, name));
      formDatas.push(this.formInputs[2].load(2, mobile));
      this.setData({ receiveId, regionId, defaultFlag, formDatas });
      this.regionPicker.load(provinceId, cityId, areaId);

      wx.hideLoading();
    });

  },
  setRegionData: function (data) {
    this.setData({ regionData: data });
  },
  sureRegion: function (regionId, regionName) {
    this.setData({ regionId, regionName });
  },
  setFormData: function (data) {
    this.data.formDatas[data.formIndex] = data;
    this.setData({ formDatas: this.data.formDatas });
  },
  clearInput: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].setValue('');
  },
  changeInput: function (event) {
    const { value } = event.detail;
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].setValue(value);
  },
  selectRegion: function (event) {
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
  selectDefault: function (event) {
    this.setData({ defaultFlag: this.data.defaultFlag === 1 ? 0 : 1 });
  },
  goBack: function () {
    wx.navigateBack();
  },
  onSubmit: async function (event) {
    const { submiting, receiveId, defaultFlag, regionId } = this.data;
    if (submiting) {
      return;
    }
    this.setData({ regionError: false, regionMsg: '' });
    if (regionId === 0) {
      this.setData({ regionError: true, regionMsg: '地区是必须的' });
    }
    const address = await this.formInputs[0].match();
    const name = await this.formInputs[1].match();
    const mobile = await this.formInputs[2].match();

    if (name && address && mobile && regionId > 0) {
      this.setData({ submiting: true });
      memberChannel.saveReceive(receiveId, name, address, mobile, regionId, defaultFlag).then(data => {
        if (data) {
          getCurrentPages().forEach((item, index) => {
            if (item.route.indexOf('/orderConfirm') > 0) {
              item.selectReceive(receiveId);
            }
          });
          if (receiveId > 0) {
            wx.navigateBack({ delta: 2 });
          }
          else {
            wx.navigateBack();
          }
        }
        this.setData({ submiting: false });
      })
    }
  },
})