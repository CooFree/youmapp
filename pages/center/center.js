// pages/center/center.js
import MemberChannel from '../../channels/member';
import util from '../../utils/util';
const memberChannel = new MemberChannel();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginName: '',
        headPortrait: '',
        memberLevel: '',
        unpayCount: 0,
        undeliveryCount: 0,
        deliveredCount: 0,
        uncommentCount: 0
    },
    onLoad: function (options) {
        memberChannel.getMemberOrderData().then((data) => {
            if (data) {
                this.setData({
                    loginName: data.member_login_name,
                    headPortrait: data.head_portrait,
                    memberLevel: data.member_level,
                    unpayCount: data.unpay_count,
                    undeliveryCount: data.undelivery_count,
                    deliveredCount: data.delivered_count,
                    uncommentCount: data.uncomment_count
                });
            }
        });
    },
})