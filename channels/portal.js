import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';
var cache = {
  regionData: [],
  helpList: [],
  topicList: []
};

export default class PortalChannel {


  async getGeneralConfig() {
    let url = config.Host + '/config.aspx';
    try {
      let resData = await util.fetch(url);
      return resData;
    } catch (error) {
      console.error(error);
    }
  }

  async postWeixinLogin(code) {
    let url = config.Host + '/handlers/wxAppLoginCallback.ashx';
    try {
      let resData = await util.fetch(url, { body: { code } });
      if (resData.result === 1) {
        return resData.member_id;
      }
      else {
        console.warn(resData.msg);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async postLogin(formLoginname, formPassword) {
    const url = config.Host + '/login.aspx';
    const post_data = { loginname: formLoginname, password: util.md5(formPassword) };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    try {
      let responseData = await util.fetch(url, { method: 'POST', headers, body: post_data });
      if (responseData.result === 1) {
        return responseData.info;
      }
      else {
        console.warn(responseData.msg);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async postMobileLogin(loginMobile, smsCode) {
    const url = config.Host + '/mobileLogin.aspx';
    const post_data = { mobile: loginMobile, sms_code: smsCode };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    try {
      let responseData = await util.fetch(url, { method: 'POST', headers, body: post_data });
      if (responseData.result === 1) {
        return responseData.info.login_member_id;
      }
      else {
        console.warn(responseData.msg);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async getHelpList() {
    if (cache.helpList.length === 0) {
      let url = config.Host + '/portal/helpList.aspx';
      let headers = {
        'Content-Platform': 'wxapp'
      }
      try {
        let resData = await util.fetch(url, { headers });
        if (resData.result === 1) {
          cache.helpList = resData.list;
        }
        else {
          console.warn(resData.msg);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    return cache.helpList;
  }

  async getTopicList(page, pageSize) {
    if (cache.topicList.length === 0) {
      let url = config.Host + '/portal/topicList.aspx';
      let post_data = 'page=' + page + '&page_size=' + pageSize;
      try {
        let resData = await util.fetch(url + '?' + post_data);
        if (resData.result === 1) {
          cache.topicList = resData.list;
        }
        else {
          console.warn(resData.msg);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    return cache.topicList;
  }

  async getHelpData(code) {
    if (code && code.length > 0) {
      let url = config.Host + '/portal/help.aspx?code=' + code;
      try {
        let resData = await util.fetch(url);
        if (resData.result === 1) {
          return { title: resData.info.title, faq_list: resData.list };
        }
        else {
          console.warn(resData.msg);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
  }
  async existsEmail(email) {
    let url = config.Host + '/handlers/existsLoginEmail.ashx?email=' + email;
    try {
      let resData = await util.fetch(url, { dataType: 'text' });
      return resData === '1' ? true : false;
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  async existsMobile(mobile) {
    let url = config.Host + '/handlers/existsLoginMobile.ashx?mobile=' + mobile;
    try {
      let resData = await util.fetch(url, { dataType: 'text' });
      return resData === '1' ? true : false;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async existsName(userName) {
    let url = config.Host + '/handlers/existsLoginName.ashx?login_name=' + userName;
    try {
      let resData = await util.fetch(url, { dataType: 'text' });
      return resData === '1' ? true : false;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async getAuthCode() {
    let url = config.Host + '/handlers/authCod.ashx';
    try {
      let resData = await util.fetch(url);
      return resData;
    } catch (error) {
      console.error(error);
    }
  }

  async sendEmailCode(email) {
    let url = config.Host + '/handlers/sendEmailSmsCode.ashx';
    let post_data = { email };
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    try {
      let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
      if (resData.result === 1) {
        console.log('EmailCode:' + resData.code);
        return true;
      }
      else {
        console.warn(resData.msg);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }
  async sendMobileCode(mobile) {
    let url = config.Host + '/handlers/sendMobileSmsCode.ashx';
    let post_data = { mobile };
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    try {
      let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
      if (resData.result === 1) {
        console.log('MobileCode:' + resData.code);
        return true;
      }
      else {
        console.warn(resData.msg);
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async equelSmsCode(smsName, smsCode) {
    let url = config.Host + '/handlers/checkSmsCode.ashx';
    let post_data = {
      sms_name: smsName,
      sms_code: smsCode
    };
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    try {
      let resData = await util.fetch(url, { method: 'POST', headers, body: post_data, dataType: 'text' });
      return resData === "1";
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  async getRegionData() {
    if (cache.regionData.length === 0) {
      let url = config.Host + '/temp/region.json';
      try {
        let resData = await util.fetch(url);
        cache.regionData = resData;
      }
      catch (error) {
        console.error(error);
      }
    }
    return cache.regionData;
  }

  async getTopicInfo(code) {
    let url = config.Host + '/portal/topic.aspx?code=' + code;
    try {
      let resData = await util.fetch(url);
      if (resData.result === 1) {
        return resData.info;
      }
      else {
        console.warn(resData.msg);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

}