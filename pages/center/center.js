// pages/center/center.js
import MemberChannel from '../../channels/member';
import util from '../../utils/util';
const memberChannel = new MemberChannel();
import memberState from '../../utils/memberState';

const defaultData = {
    loginName: '',
    headPortrait: 'http://img02.camel.com.cn/image/headportrait345.png',
    memberLevel: '',
    unpayCount: 0,
    undeliveryCount: 0,
    deliveredCount: 0,
    uncommentCount: 0,
    isLogin: false,
}
Page({
    data: defaultData,
    onLoad: function (options) {
        this.loadData();
    },
    onShow: function () {
        this.loadData();
    },
    loadData: function () {
        wx.showLoading();
        memberChannel.getMemberOrderData().then((data) => {
            if (data) {
                this.setData({
                    isLogin: true,
                    loginName: data.member_login_name,
                    headPortrait: data.head_portrait,
                    memberLevel: data.member_level,
                    unpayCount: data.unpay_count,
                    undeliveryCount: data.undelivery_count,
                    deliveredCount: data.delivered_count,
                    uncommentCount: data.uncomment_count
                });
            }
            wx.hideLoading();
        });
    },
    logout: function () {
        memberState.clearLogin();
        this.setData(defaultData);
    },
    goOrderList: function (event) {
        const { isLogin } = this.data;
        if (isLogin) {
            const show_status = event.currentTarget.dataset.showstatus || '';
            wx.navigateTo({ url: '../member/orderList/orderList?show_status=' + show_status });
        }
        else {
            this.login();
        }
    },
    login: function () {
        wx.navigateTo({ url: '../login/login' });
    },
    goProfile: function (event) {
        const { isLogin } = this.data;
        if (isLogin) {
            wx.navigateTo({ url: '../member/profile/profile' });
        }
        else {
            this.login();
        }
    }
})