import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import FormInput from '../../components/formInput/formInput.js';
import memberState from '../../utils/memberState';
import buyTemp from '../../utils/buyTemp';
import PortalChannel from '../../channels/portal';

const portalChannel = new PortalChannel();
Page({
  FormInputs: [],
  loginCount: 0,
  data: {
    formDatas: [],
    submiting: false,
    loginAccount: '',
    loginPassword: '',
    verifiCode: '',
    errorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.FormInputs.push(new FormInput(this, { title: '账号', required: true, placeholder: '用户名/手机号/邮箱' }));
    this.FormInputs.push(new FormInput(this, { title: '密码', required: true, password: true, placeholder: '密码' }));
    this.FormInputs.push(new FormInput(this, { title: '验证码', required: true, authcode: true, placeholder: '验证码' }));

    let formDatas = [];
    this.FormInputs.forEach((item, index) => {
      const data = item.load(index);
      formDatas.push(data);
    });
    this.setData({ formDatas });
  },
  setFormData: function (data) {
    this.data.formDatas[data.formIndex] = data;
    this.setData({ formDatas: this.data.formDatas });
  },
  clearInput: function (event) {
    const { formindex } = event.currentTarget.dataset;
    console.log('clearInput', event);
    this.FormInputs[formindex].setValue('');
  },
  changeInput: function (event) {
    const { value } = event.detail;
    const { formindex } = event.currentTarget.dataset;
    this.FormInputs[formindex].setValue(value);
  },
  changeAuthcode: function (event) {
    const { formindex } = event.currentTarget.dataset;
    this.FormInputs[formindex].loadAuthcode();
  },
  onSubmit: async function () {
    const { submiting } = this.data;
    if (submiting) {
      return;
    }
    const loginName = await this.FormInputs[0].match();
    const password = await this.FormInputs[1].match();
    let authcode = true;
    if (this.loginCount > 2) {
      authcode = await this.FormInputs[2].match();
    }
    console.log('loginName:' + loginName + ',password:' + password + ',authcode:' + authcode);
    if (loginName && password && authcode) {
      portalChannel.postLogin(loginName, password).then(data => {
   
        if (data) {
          memberState.saveLogin(data.login_member_id, true);

          //buyTemp.tempToApi();//把购物商品从客户端传到服务端
          wx.navigateBack(1);
        }
        else {
          this.loginCount++;
          console.log('this.loginCount', this.loginCount);
          if (this.loginCount > 2) {
            this.FormInputs[2].setShow();
          }
          this.FormInputs[0].setError('账号或密码不匹配');
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})