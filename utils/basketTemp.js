import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import memberState from './memberState';
import OrderChannel from '../channels/order';

const sessionkey = 'basketTemp';
const orderChannel = new OrderChannel();
export default class BasketTemp {
    static clear() {
        wx.removeStorage({ key: sessionkey });
    }
    static addBasket(productId, specificateId, volume, location, image) {
        if (memberState.isLogin()) {
            orderChannel.addBasket(productId, specificateId, volume, location, image);
        }
        else {
            const basketTempData = wx.getStorageSync(sessionkey)
                || { productIdArray: [], specificateIdArray: [], volumeArray: [], locationArray: [], imageArray: [] };

            const index = basketTempData.specificateIdArray.indexOf(specificateId);
            if (index < 0) {
                basketTempData.productIdArray.push(productId);
                basketTempData.specificateIdArray.push(specificateId);
                basketTempData.volumeArray.push(volume);
                basketTempData.locationArray.push(location);
                basketTempData.imageArray.push(image);
            }
            else {
                basketTempData.volumeArray[index] = basketTempData.volumeArray[index] + volume;
            }
            wx.setStorageSync(sessionkey, basketTempData);
        }
    }
    static async getBasketVolume() {
        let volume = 0;
        if (memberState.isLogin()) {
            volume = await orderChannel.getBasketVolume();
        }
        else {
            const basketTempData = wx.getStorageSync(sessionkey);
            if (basketTempData) {
                for (let subvolume of basketTempData.volumeArray) {
                    volume += subvolume;
                }
            }
        }
        return volume;
    }
    static async tempToApi() {
        let result = false;
        const basketTempData = wx.getStorageSync(sessionkey);
        if (basketTempData && basketTempData.productIdArray.length > 0) {
            result = await orderChannel.addBasket(basketTempData.productIdArray, basketTempData.specificateIdArray, basketTempData.volumeArray, basketTempData.locationArray, basketTempData.imageArray);
            if (result) {
                BasketTemp.clear();
            }
        }
        return result;
    }
}

