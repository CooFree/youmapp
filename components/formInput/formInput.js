import regeneratorRuntime from '../../modules/regenerator-runtime/runtime';
import Match from '../../utils/match';
import util from '../../utils/util';
import PortalChannel from '../../channels/portal';

const portalChannel = new PortalChannel();

export default class FormInput {
    constructor(page, props) {
        this.interval = 0;
        this.page = page;
        this.props = props || {};
        this.data = {
            formIndex: 0,
            formValue: '',
            formError: false,
            formMsg: '',
            formAuthcode: '',
            formAuthcodeSrc: null,
            smsData: null,
            smsSeconds: 0,
            smsState: 0,
            clearShow: false
        }
    }
    load(index, value) {
        const { title, required, range, email, mobile, num, username, remote, password, passwordAgain, authcode, mailcode, mobilecode, placeholder } = this.props;
        let inputType = 'text';
        if (num === true || mobile === true) {
            inputType = 'number';
        }

        let maxLength = 100;
        if (range) {
            if (range.length === 1) {
                maxLength = range[0];
            }
            else if (range.length === 2) {
                maxLength = range[1];
            }
        }
        this.setData({
            formIndex: index || 0,
            formValue: value || '',
            title: title || '',
            required: required || false,
            range,
            email: email || false,
            mobile: mobile || false,
            num: num || false,
            username,
            remote,
            password: password || false,
            passwordAgain,
            authcode,
            mailcode,
            mobilecode,
            inputType,
            maxLength,
            placeholder,
            show: authcode ? false : true
        });
        if (authcode) {
            this.loadAuthcode();
        }
        return this.data;
    }
    setValue(value) {
        this.setData({ formValue: value, clearShow: value.length > 0 });
    }
    setData(obj2) {
        this.data = Object.assign({}, this.data, obj2);
        if (this.page.setFormData) {
            this.page.setFormData(this.data);
        }
    }
    setShow() {
        this.setData({ show: true });
    }
    setError(msg) {
        this.setData({ formError: true, formMsg: msg });
    }
    async match() {
        this.setData({ formError: false, formMsg: '' });

        let { formValue, formAuthcode, smsData, title, required, range, email, mobile, num, username, remote, password, passwordAgain, authcode, mailcode, mobilecode } = this.data;
        //必须
        if (required && Match.isRequired(formValue) === false) {
            this.setError(title + '输入是必须的');
            return;
        }
        //范围
        if (range && range.length > 0) {
            if (range.length === 1 && formValue.length !== range[0]) {
                this.setError(title + '输入长度必须是' + range[0] + '个字符');
                return;
            }
            if (range.length === 2 && (formValue.length < range[0] || formValue.length > range[1])) {
                this.setError(title + '输入长度必须是' + range[0] + '-' + range[1] + '个字符');
                return;
            }
        }
        if (num) {
            if (Match.isNumber(formValue) === false) {
                this.setError(title + '输入必须是数字');
                return;
            }
        }
        //邮箱
        if (email) {
            if (Match.isEmail(formValue) === false) {
                this.setError('邮箱地址格式不符');
                return;
            }
            if (remote !== undefined) {
                let exist = await portalChannel.existsEmail(formValue);
                console.log('exist', exist);
                if (remote === 1 && exist === true) {
                    this.setError('邮箱已经被使用');
                    return;
                }
                if (remote === 0 && exist === false) {
                    this.setError('邮箱不存在');
                    return;
                }
            }
        }
        //手机
        if (mobile) {
            if (Match.isMobile(formValue) === false) {
                this.setError('手机号码格式不符');
                return;
            }
            if (remote !== undefined) {
                let exist = await portalChannel.existsMobile(formValue);
                if (remote === 1 && exist === true) {
                    this.setError('手机号码已经被使用');
                    return;
                }
                if (remote === 0 && exist === false) {
                    this.setError('手机号码不存在');
                    return;
                }
            }
        }
        //用户名
        if (username) {
            if (Match.isNumLetter(formValue) === false) {
                this.setError('用户名必须是只包含数字、字母、下划线的格式');
                return;
            }
            if (remote !== undefined) {
                let exist = await portalChannel.existsName(formValue);
                if (remote === 1 && exist === true) {
                    this.setError('用户名已经被使用');
                    return;
                }
                if (remote === 0 && exist === false) {
                    this.setError('用户名不存在');
                    return;
                }
            }
        }
        //密码一致
        if (password && passwordAgain) {
            let password1 = passwordAgain();
            if (password1 !== formValue) {
                this.setError('两次密码输入不一致');
                return;
            }
        }
        //验证码
        if (authcode && formValue.toUpperCase() !== formAuthcode.toUpperCase()) {
            this.setError('验证码错误');
            this.loadAuthcode();
            return;
        }
        //邮件验证码、手机验证码
        if (mailcode || mobilecode) {
            let now_time = new Date();
            let smsName = '';
            if (mailcode) {
                smsName = await this.props.getEmail();
            }
            if (mobilecode) {
                smsName = await this.props.getMobile();
            }
            if (!smsData || smsData.smsName !== smsName || smsData.expires_time <= now_time) {
                this.setError('验证码无效');
                return;
            }
            let sms_code = formValue.toUpperCase();
            let sms_equel = await portalChannel.equelSmsCode(smsData.smsName, sms_code);

            if (sms_equel === false) {
                this.setError('验证码错误');
                return;
            }
        }
        return formValue;
    }
    required() {
        let { formValue } = this.state;
        return Match.isRequired(formValue);
    }
    getValue() {
        let { formValue } = this.state;
        return formValue;
    }
    clear() {
        this.setData({ formValue: '' });
    }
    loadAuthcode() {
        portalChannel.getAuthCode().then(data => {
            if (data) {
                this.setData({ formAuthcode: data.random_code, formAuthcodeSrc: data.file_url });
            }
        });
    }

    async sendEmailCode() {
        let now_time = new Date();
        const { smsData, smsState } = this.data;
        if (smsState === 1) {//获取中...
            return
        }
        if (smsData && smsData.limit_time > now_time) {//计时
            return;
        }
        clearInterval(this.interval);

        let email = await this.props.getEmail();
        if (!email) {
            return;
        }
        this.setData({ smsState: 1 });
        let data = await portalChannel.sendEmailCode(email);
        this.setData({ smsState: 0 });
        if (data) {
            let limit_time = util.timeAdd(now_time, 1, 'm');
            let expires_time = util.timeAdd(now_time, 10, 'm');
            let seconds = parseInt(util.timeDiff(limit_time, now_time, 's')) || 0;

            this.setData({ smsData: { smsName: email, limit_time, expires_time }, smsSeconds: seconds });
            this.interval = setInterval(() => {
                if (seconds <= 0) {
                    this.setData({ smsSeconds: 0 });
                    clearInterval(this.interval);
                    return;
                }
                seconds--;
                this.setData({ smsSeconds: seconds });
            }, 1000);
        }
    }
    async sendMobileCode() {
        let now_time = new Date();
        const { smsData, smsState } = this.data;
        if (smsState === 1) {//获取中...
            return
        }
        if (smsData && smsData.limit_time > now_time) {//计时
            return;
        }
        clearInterval(this.interval);

        let mobile = await this.props.getMobile();
        if (!mobile) {
            return;
        }
        this.setData({ smsState: 1 });
        let data = await portalChannel.sendMobileCode(mobile);
        this.setData({ smsState: 0 });
        if (data) {
            let limit_time = util.timeAdd(now_time, 1, 'm');
            let expires_time = util.timeAdd(now_time, 10, 'm');
            let seconds = parseInt(util.timeDiff(limit_time, now_time, 's')) || 0;

            this.setData({ smsData: { smsName: mobile, limit_time: limit_time, expires_time: expires_time }, smsSeconds: seconds });
            this.interval = setInterval(() => {
                if (seconds <= 0) {
                    this.setData({ smsSeconds: 0 });
                    clearInterval(this.interval);
                    return;
                }
                seconds--;
                this.setData({ smsSeconds: seconds });
            }, 1000);
        }
    }
}