// pages/portal/helpList/helpList.js
import PortalChannel from '../../../channels/portal';
const portalChannel = new PortalChannel();
Page({
  data: {
    helpList:[]
  },
  onLoad: function (options) {
    portalChannel.getHelpList().then(data => {
      this.setData({
        helpList: data
      })
    })
  },
  onShareAppMessage: function () {

  }
})