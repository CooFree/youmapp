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

        homeChannel.getPageModuleList('wap_home_sudi_20171013').then(data => {
            this.setData({ home_sudi: data.list });
        });

        homeChannel.getPageModuleList('wap_home_jingxuan_20171013').then(data => {
            this.setData({ home_jingxuan: data.list });
        });

        homeChannel.getPageModuleList('wap_home_yujia_20171013').then(data => {
            this.setData({ home_yujia: data.list });
        });

        homeChannel.getPageProductList('wap_home_yujia_20171013',0,8).then(data => {
            this.setData({ home_yujia_list: data });
        });

        homeChannel.getPageModuleList('wap_home_yundong_20171013').then(data => {
            this.setData({ home_yundong: data.list });
        });

        homeChannel.getPageProductList('wap_home_yundong_20171013', 0, 8).then(data => {
            this.setData({ home_yundong_list: data });
        });

        homeChannel.getPageModuleList('wap_home_huwai_20171013').then(data => {
            this.setData({ home_huwai: data.list });
        });

        homeChannel.getPageProductList('wap_home_huwai_20171013', 0, 8).then(data => {
            this.setData({ home_huwai_list: data });
        });
    },
})
