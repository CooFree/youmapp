import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import FormInput from '../../components/formInput/formInput';
import MemberChannel from '../../channels/member';
import memberState from '../../utils/memberState';
import PortalChannel from '../../channels/portal';

const portalChannel = new PortalChannel();
const memberChannel = new MemberChannel();
Page({
  formInputs: [],
  data: {
    formDatas: [],
    settype: '',
    submiting: false
  },
  onLoad: function (options) {
    const settype = options.settype || '';
    const remote = settype === 'login' ? 1 : 0;
    this.formInputs.push(new FormInput(this, { title: '手机号', required: true, mobile: true, range: [11], remote, placeholder: '手机号' }));
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
    this.setData({ formDatas, settype });
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
    const { settype } = this.data;


    const mobile = await this.formInputs[0].match();
    const mobilecode = await this.formInputs[1].match();
    if (mobile && mobilecode) {
      //登录验证手机，并绑定手机
      if (settype === 'login') {
        const memberId = memberState.getLoginId();
        if (memberId) {
          this.setData({ submiting: true });
          memberChannel.postSetLoginMobile(memberId, mobile).then(result => {
            this.setData({ submiting: false });
            if (result) {
              wx.navigateBack();
            }
            else {
              wx.showToast({ title: '提交失败', image: '../../images/errorx.png' });
            }
          });
        }
      }
      else {
        portalChannel.postMobileLogin(mobile, mobilecode).then(memberId => {
          if (memberId) {
            wx.redirectTo({ url: '../setPassword/setPassword?member_id=' + memberId });
          }
          else {
            wx.showToast({ title: '验证失败', image: '../../images/errorx.png' });
          }

        });

      }
    }
  },
  sendMobileCode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].sendMobileCode();
  },
})