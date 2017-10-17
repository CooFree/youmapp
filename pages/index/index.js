//index.js
import HomeChannel from '../../channels/home.js';

const app = getApp();
const homeChannel = new HomeChannel();
Page({
    data: {
        swiperData: [],
    },
    onLoad: function (options) {
        homeChannel.getPageModuleList('wap_home_focus_20171013').then(data => {
            this.setData({ swiperData: data.list });
        });
    },
})
