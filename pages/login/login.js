import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import FormInput from '../../components/formInput/formInput';
import memberState from '../../utils/memberState';
import buyTemp from '../../utils/buyTemp';
import basketTemp from '../../utils/basketTemp';
import PortalChannel from '../../channels/portal';

const portalChannel = new PortalChannel();
Page({
  formInputs: [],
  loginCount: 0,
  data: {
    formDatas: [],
    submiting: false,
    wxsubmiting: false
  },

  onLoad: function (options) {
    this.formInputs.push(new FormInput(this, { title: '账号', required: true, placeholder: '用户名/手机号/邮箱' }));
    this.formInputs.push(new FormInput(this, { title: '密码', required: true, password: true, placeholder: '密码' }));
    this.formInputs.push(new FormInput(this, { title: '验证码', required: true, authcode: true, placeholder: '验证码' }));

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
  changeAuthcode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.formInputs[formindex].loadAuthcode();
  },
  wxlogin: function (event) {
    //获取微信登陆
    this.setData({ wxsubmiting: true });
    wx.login({
      success: res => {
        portalChannel.getWeixinLogin(res.code).then(data => {
          this.setData({ wxsubmiting: false });
          if (data) {
            memberState.saveLogin(data.member_id, true);
            basketTemp.tempToApi();
            if (data.mobile_flag === 0) {
              wx.redirectTo({ url: '../mobileVerify/mobileVerify?settype=login' });
            }
            else {
              wx.navigateBack();
            }
          }
          else {
            wx.showToast({ title: '登陆失败', image: '../../images/errorx.png' });
          }
        });
      }
    });
  },
  onSubmit: async function () {
    const { submiting } = this.data;
    if (submiting) {
      return;
    }
    const loginName = await this.formInputs[0].match();
    const password = await this.formInputs[1].match();
    let authcode = true;
    if (this.loginCount > 2) {
      authcode = await this.formInputs[2].match();
    }
    if (loginName && password && authcode) {
      this.setData({ submiting: true });
      portalChannel.postLogin(loginName, password).then(data => {
        this.setData({ submiting: false });
        if (data) {
          memberState.saveLogin(data.login_member_id, true);

          basketTemp.tempToApi();//把购物商品从客户端传到服务端
          wx.navigateBack();
        }
        else {
          this.loginCount++;
          if (this.loginCount > 2) {
            this.formInputs[2].setShow();
          }
          this.formInputs[0].setError('账号或密码不匹配');
        }

      });
    }
  },
  onShareAppMessage: function () {

  }
})