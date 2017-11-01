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
  onLoad: async function (options) {
    this.formInputs.push(new FormInput(this, { title: '用户名', required: true, username: true, remote: 1, placeholder: '用户名' }));
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
    const username = await this.formInputs[0].match();
    const memberId = memberState.getLoginId();
    if (username && memberId) {
      memberChannel.postSetLoginName(memberId, username).then(result => {
        if (result) {
          wx.redirectTo({ url: '../../success/success?msg=修改成功' });
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }
  }
})