import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import FormInput from '../../components/formInput/formInput.js';
import MemberChannel from '../../channels/member';

const memberChannel = new MemberChannel();
Page({
  formInputs: [],
  data: {
    formDatas: [],
    submiting: false,
    memberId: ''
  },
  onLoad: function (options) {
    const memberId = options.member_id || '';

    this.formInputs.push(new FormInput(this, { title: '密码', required: true, password: true, range: [6, 20], placeholder: '密码' }));
    this.formInputs.push(new FormInput(this, {
      title: '确认密码', required: true, password: true, range: [6, 20], placeholder: '确认密码',
      passwordAgain: () => {
        return this.data.formDatas[0].formValue;
      }
    }));

    const formDatas = this.formInputs.map((formInput, index) => {
      return formInput.load(index);
    });
    this.setData({ formDatas, memberId });
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
  onSubmit: async function () {
    const { submiting, memberId } = this.data;
    if (submiting) {
      return;
    }
    const password = await this.formInputs[0].match();
    const password2 = await this.formInputs[1].match();

    if (password && password2) {
      memberChannel.postSetPassword(memberId, password).then(result => {
        if (result) {
          wx.navigateBack();
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../images/errorx.png' });
        }
      });
    }
  },
  onShareAppMessage: function () {

  }
})