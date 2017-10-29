import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import FormInput from '../../components/formInput/formInput.js';
import memberState from '../../utils/memberState';
import buyTemp from '../../utils/buyTemp';
import PortalChannel from '../../channels/portal';

const portalChannel = new PortalChannel();
Page({
  formInputs: [],
  data: {
    formDatas: [],
    password: '',
    mobile: '',
    submiting: false
  },
  onLoad: function (options) {
    this.formInputs.push(new FormInput(this, { title: '手机号', required: true, mobile: true, range: [11], remote: 1, placeholder: '手机号' }));
    this.formInputs.push(new FormInput(this, { title: '密码', required: true, password: true, range: [6, 20], placeholder: '密码' }));
    this.formInputs.push(new FormInput(this, {
      title: '确认密码', required: true, password: true, range: [6, 20], placeholder: '确认密码',
      passwordAgain: () => {
        return this.data.formDatas[1].formValue;
      }
    }));
    this.formInputs.push(new FormInput(this, {
      title: '验证码', required: true, num: true, range: [6], mobilecode: true, placeholder: '短信验证码', getMobile: () => {
        const mobile = this.data.formDatas[0].formValue;
        if (mobile.length === 0) {
          this.formInputs[0].setError('手机号是必须的');
        }
        else {
          return mobile;
        }
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
    /*if (formindex === 0) {
      this.setData({ mobile: value });
    }
    else if (formindex === 1) {
      this.setData({ password: value })
    }*/
    this.formInputs[formindex].setValue(value);
  },
  onSubmit: async function () {
    const { submiting } = this.data;
    if (submiting) {
      return;
    }
    const mobile = await this.formInputs[0].match();
    const password = await this.formInputs[1].match();
    const password2 = await this.formInputs[2].match();
    const mobilecode = await this.formInputs[3].match();
    if (mobile && password && password2 && mobilecode) {
      portalChannel.postRegist(mobile, password).then(memberId => {
        if (memberId) {
          wx.navigateBack();
        }
        else {
          this.formInputs[3].setError('注册失败');
        }
      });
    }
  },
  sendMobileCode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].sendMobileCode();
  },
  onShareAppMessage: function () {

  }
})