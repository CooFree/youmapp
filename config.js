const DevConfig = {
  Host: 'https://apptest.camel.com.cn',
}

const ProdConfig = {
  Host: 'https://appyou.camel.com.cn',
}

var Config = {
  Host: ''
}

var systemInfo;
if (!systemInfo) {
  systemInfo = wx.getSystemInfoSync();
}
if (systemInfo.platform === 'devtools') {
  Config = DevConfig;
}
else {
  Config = ProdConfig;
}

export default Config;