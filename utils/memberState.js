

const LOGIN_MEMBER_STATE = 'login_memberid_state';
var LoginNemberID = null;
export default class MemberLoginState {
  static initLogin() {
    if (LoginNemberID == null) {
      wx.getStorage({
        key: LOGIN_MEMBER_STATE,
        success: function (res) {
          LoginNemberID = res.data || null;
        }
      })
    }
  }
  static saveLogin(loginNemberId, save) {
    LoginNemberID = loginNemberId;
    if (save === true) {
      wx.setStorage({
        key: LOGIN_MEMBER_STATE,
        data: loginNemberId
      });
    }
  }
  static isLogin() {
    if (LoginNemberID == null) {
      return false;
    }
    else {
      return true;
    }
  }
  static getLoginId() {
    return LoginNemberID;
  }
  static getLoginIdStr() {
    return LoginNemberID == null ? '' : LoginNemberID;
  }
  static clearLogin() {
    LoginNemberID = null;
    localStorage.removeItem(LOGIN_MEMBER_STATE);
  }
}