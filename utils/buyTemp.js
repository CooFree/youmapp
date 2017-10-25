
const sessionkey = 'buyTemp';
export default class BuyTemp {
  static clear() {
    sessionStorage.removeItem(sessionkey);
  }
  static addBuy(specificateId, volume, location, image) {
    const buyTempData = { specificateIdArray: [specificateId], volumeArray: [volume], locationArray: [location], imageArray: [image] };
    wx.setStorageSync(sessionkey, buyTempData);
  }
  static addBasketBuy(specificateIds, volumes, locations, images) {
    const buyTempData = { specificateIdArray: specificateIds, volumeArray: volumes, locationArray: locations, imageArray: images };
    wx.setStorageSync(sessionkey, buyTempData);
  }
  static jsonData() {
    const buyTempType = wx.getStorageSync(sessionkey);
    if (buyTempType) {
      return { specificate: buyTempData.specificateIdArray, volume: buyTempData.volumeArray, location: buyTempData.locationArray, image: buyTempData.imageArray };
    }
    else {
      console.warn('没有购买的商品');
    }
  }
  static getVolume() {
    let totalVolume = 0;
    const buyTempType = wx.getStorageSync(sessionkey);
    if (buyTempType) {
      for (let volume of buyTempData.volumeArray) {
        totalVolume += volume;
      }
    }
    return totalVolume;
  }
  static getBuyType() {
    return wx.getStorageSync(typeSessionkey);
  }
}

