import Config from '../config';
import Utility from '../utils/utility';

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
        let command_url = Config.ApiHost + '/config.aspx';
        try {
            let responseData = await fetch(command_url).then(response => response.json());
            return responseData;
        } catch (error) {
            console.error(error);
        }
    }

    async postLogin(formLoginname, formPassword) {
        let command_url = Config.ApiHost + '/login.aspx';
        let password = Utility.md5(formPassword);
        let post_data = 'loginname=' + formLoginname + '&password=' + password;
        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
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
        let command_url = Config.ApiHost + '/mobileLogin.aspx';
        let post_data = 'mobile=' + loginMobile + '&sms_code=' + smsCode;
        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
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
        if (this.cache.helpList.length === 0) {
            let command_url = Config.ApiHost + '/portal/helpList.aspx';
            let fetchHeaders = {
                'Content-Platform': 'wap'
            }
            try {
                let responseData = await fetch(command_url, { headers: fetchHeaders }).then(response => response.json());
                if (responseData.result === 1) {
                    this.cache.helpList = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
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
            let command_url = Config.ApiHost + '/portal/topicList.aspx?page=' + page + '&page_size=' + pageSize;

            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    this.cache.topicList = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
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
            let command_url = Config.ApiHost + '/portal/help.aspx?code=' + code;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return { title: responseData.info.title, faq_list: responseData.list };
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async existsEmail(email) {
        let command_url = Config.ApiHost + '/handlers/existsLoginEmail.ashx?email=' + email;
        try {
            let responseData = await fetch(command_url).then(response => response.text());
            return responseData === '1' ? true : false;
        } catch (error) {
            console.error(error);
        }
        return false;
    }
    async existsMobile(mobile) {
        let command_url = Config.ApiHost + '/handlers/existsLoginMobile.ashx?mobile=' + mobile;
        try {
            let responseData = await fetch(command_url).then(response => response.text());
            return responseData === '1' ? true : false;
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async existsName(userName) {
        let command_url = Config.ApiHost + '/handlers/existsLoginName.ashx?login_name=' + userName;
        try {
            let responseData = await fetch(command_url).then(response => response.text());
            return responseData === '1' ? true : false;
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async getAuthCode() {
        let command_url = Config.ApiHost + '/handlers/authCod.ashx';
        try {
            let responseData = await fetch(command_url).then(response => response.json());
            return responseData;
        } catch (error) {
            console.error(error);
        }
    }

    async sendEmailCode(email) {
        let command_url = Config.ApiHost + '/handlers/sendEmailSmsCode.ashx';
        let post_data = 'email=' + email;
        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
            if (responseData.result === 1) {
                console.log('EmailCode:' + responseData.code);
                return true;
            }
            else {
                console.warn(responseData.msg);
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }
    async sendMobileCode(mobile) {
        let command_url = Config.ApiHost + '/handlers/sendMobileSmsCode.ashx';
        let post_data = 'mobile=' + mobile;
        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
            if (responseData.result === 1) {
                console.log('MobileCode:' + responseData.code);
                return true;
            }
            else {
                console.warn(responseData.msg);
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async equelSmsCode(smsName, smsCode) {
        let command_url = Config.ApiHost + '/handlers/checkSmsCode.ashx';
        let post_data = 'sms_name=' + smsName + '&sms_code=' + smsCode;
        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.text());
            return responseData === "1";
        } catch (error) {
            console.error(error);
        }
        return false;
    }

    async postRegist(formMobile, formPassword) {
        let src = localStorage.getItem('channel_src') || '';//来源
        let src_url = localStorage.getItem('channel_url') || '';//来源地址

        let command_url = Config.ApiHost + '/regist.aspx';
        let password = Utility.md5(formPassword);
        let post_data = 'mobile=' + formMobile + '&password=' + password + '&src=' + encodeURIComponent(src) + '&src_url=' + encodeURIComponent(src_url);

        let fetchHeaders = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
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

    async postFindpwd(memberId, formPassword) {
        if (memberId) {
            let command_url = Config.ApiHost + '/member/setPassword.aspx?member_id=' + memberId;
            let password = Utility.md5(formPassword);
            let post_data = 'password=' + password;
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async getRegionData() {
        if (this.cache.regionData.length === 0) {
            let command_url = Config.ApiHost + '/temp/region.json';
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                this.cache.regionData = responseData;
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.regionData;
    }

    async recordVisit(src, src_cid) {
        let command_url = Utility.httpsURI('http://union.camel.com.cn/av.aspx');
        if (src === undefined) {
            src = '';
        }
        if (src_cid === undefined) {
            src_cid = '';
        }
        let first = parseInt(localStorage.getItem('first_visit'), 0);
        if (isNaN(first) === true) {
            first = 1;
        }
        if (first === 1) {
            localStorage.setItem('first_visit', '0');
        }
        let page_url = 'http://app.camel.com.cn/youapp_' + (first === 1 ? '_download' : '_visit') + '.aspx';
        let post_data = 'page_url=' + encodeURIComponent(page_url) + '&src=' + encodeURIComponent(src) + '&src_cid=' + encodeURIComponent(src_cid);
        try {
            fetch(command_url, { method: 'POST', body: post_data });
        }
        catch (error) {
            console.error(error);
        }
    }
    async getTopicInfo(code) {
        let command_url = Config.ApiHost + '/portal/topic.aspx?code=' + code;

        try {
            let responseData = await fetch(command_url).then(response => response.json());
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

}