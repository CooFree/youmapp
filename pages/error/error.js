Page({
  timeout: 0,
  data: {
    msg: '对不起，出错'
  },
  onLoad: function (options) {
    const msg = options.msg;
    if (msg && msg.length > 0) {
      this.setData({ msg });
    }

    this.timeout = setTimeout(() => {
      wx.navigateBack();
    }, 2000);
  },
  onUnload: function () {
    clearTimeout(this.timeout);
  }
})