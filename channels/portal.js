import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';

export default class PortalChannel {
    constructor(options) {
        this.options = options;

        this.cache = {
            regionData: [],
            helpList: [],
            topicList: []
        };
    }

    async getGeneralConfig() {
        let url = config.Host + '/config.aspx';
        try {
            let resData = await util.fetch(url);
            return resData;
        } catch (error) {
            console.error(error);
        }
    }

    /*async postLogin(formLoginname, formPassword) {
        let url = config.Host + '/login.aspx';
        let password = Utility.md5(formPassword);
        let post_data = 'loginname=' + formLoginname + '&password=' + password;
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
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

    async postMobileLogin(loginMobile, smsCode) {
        let url = config.Host + '/mobileLogin.aspx';
        let post_data = 'mobile=' + loginMobile + '&sms_code=' + smsCode;
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
            if (resData.result === 1) {
                return resData.info.login_member_id;
            }
            else {
                console.warn(resData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }*/

    async getHelpList() {
        if (this.cache.helpList.length === 0) {
            let url = config.Host + '/portal/helpList.aspx';
            let headers = {
                'Content-Platform': 'wxapp'
            }
            try {
                let resData = await util.fetch(url, { headers });
                if (resData.result === 1) {
                    this.cache.helpList = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.helpList;
    }

    async getTopicList(page, pageSize) {
        if (this.cache.topicList.length === 0) {
            let url = config.Host + '/portal/topicList.aspx';
            let post_data = 'page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '?' + post_data);
                if (resData.result === 1) {
                    this.cache.topicList = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.topicList;
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
            let resData = await util.fetch(url, { method: 'POST', headers, body: post_data,  dataType: 'text'  });
            return resData === "1";
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async getRegionData() {
        if (this.cache.regionData.length === 0) {
            let url = config.Host + '/temp/region.json';
            try {
                let resData = await util.fetch(url);
                this.cache.regionData = resData;
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.regionData;
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