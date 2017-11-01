import regeneratorRuntime from '../../../modules/regenerator-runtime/runtime';
import FormInput from '../../../components/formInput/formInput';
import MemberChannel from '../../../channels/member';
import memberState from '../../../utils/memberState';
import PortalChannel from '../../../channels/portal';

const portalChannel = new PortalChannel();
const memberChannel = new MemberChannel();
Page({
  formInputs: [],
  data: {
    formDatas: [],
    submiting: false,
    mobile: null,
    settype: ''
  },
  onLoad: function (options) {
    const settype = options.settype || '';
    wx.showLoading();
    memberChannel.getMemberInfo().then(data => {
      if (data) {
        this.setData({ mobile: data.login_mobile, settype });
      }
      wx.hideLoading();
    });

    this.formInputs.push(new FormInput(this, {
      title: '验证码', required: true, num: true, range: [6], mobilecode: true, placeholder: '短信验证码', getMobile: () => {
        return this.data.mobile;
      }
    }));

    const formDatas = this.formInputs.map((formInput, index) => {
      return formInput.load(index);
    });
    this.setData({ formDatas });
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
  async onVerify() {
    const { mobile, settype } = this.data;
    const mobilecode = await this.formInputs[0].match();
    if (mobile && mobilecode) {
      if (settype === 'email') {
        wx.redirectTo({ url: '../setLoginEmail/setLoginEmail' });
      }
      else if (settype === 'mobile') {
        wx.redirectTo({ url: '../setLoginMobile/setLoginMobile' });
      }
      else if (settype === 'name') {
        wx.redirectTo({ url: '../setLoginName/setLoginName' });
      }
      else {
        wx.redirectTo({ url: '../setPassword/setPassword' });
      }
    }
  },
  sendMobileCode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].sendMobileCode();
  },
})