Page({
  data: {
    msg: '恭喜，正确'
  },
  onLoad: function (options) {
    const msg = options.msg;
    if (msg && msg.length > 0) {
      this.setData({ msg });
    }
  }
})