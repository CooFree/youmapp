import regeneratorRuntime from '../../../modules/regenerator-runtime/runtime';
import FormInput from '../../../components/formInput/formInput';
import MemberChannel from '../../../channels/member';
import memberState from '../../../utils/memberState';

const memberChannel = new MemberChannel();
Page({
  formInputs: [],
  data: {
    formDatas: [],
    submiting: false
  },
  onLoad: function (options) {
    this.formInputs.push(new FormInput(this, { title: '邮箱', required: true, email: true, remote: 1, placeholder: '邮箱' }));
    this.formInputs.push(new FormInput(this, {
      title: '验证码', required: true, num: true, range: [6], mailcode: true, placeholder: '邮箱验证码', getEmail: async () => {
        return await this.formInputs[0].match();
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
  onSubmit: async function () {
    const { submiting } = this.data;
    if (submiting) {
      return;
    }
    const email = await this.formInputs[0].match();
    const mailcode = await this.formInputs[1].match();
    const memberId = memberState.getLoginId();
    if (email && mailcode && memberId) {
      memberChannel.postSetLoginEmail(memberId, email).then(result => {
        if (result) {
          wx.redirectTo({ url: '../../success/success?msg=修改成功' });
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }
  },
  sendEmailCode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].sendEmailCode();
  }
})