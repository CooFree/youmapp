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
    this.formInputs.push(new FormInput(this, { title: '手机号', required: true, mobile: true, range: [11], remote: 1, placeholder: '手机号' }));
    this.formInputs.push(new FormInput(this, {
      title: '验证码', required: true, num: true, range: [6], mobilecode: true, placeholder: '短信验证码', getMobile: async () => {
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
    const mobile = await this.formInputs[0].match();
    const mobilecode = await this.formInputs[1].match();
    const memberId = memberState.getLoginId();
    if (mobile && mobilecode && memberId) {
      memberChannel.postSetLoginMobile(memberId, mobile).then(result => {
        if (result) {
          wx.redirectTo({ url: '../../success/success?msg=修改成功' });
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }
  },
  sendMobileCode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].sendMobileCode();
  }
})