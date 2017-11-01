// pages/portal/help/help.js
import PortalChannel from '../../../channels/portal';
import util from '../../../utils/util';
const portalChannel = new PortalChannel();
Page({
  data: {
    helpData: {}
  },
  onLoad: function (options) {
    let code = options.code;
    portalChannel.getHelpData(code).then(data => {
      this.setData({ helpData: data });

      wx.setNavigationBarTitle({
        title: util.decodeURI(data.title)
      })
    })
  },
  onShareAppMessage: function () {

  }
})