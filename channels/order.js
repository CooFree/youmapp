import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';
var cache = {
    basketData: {},
    confirmOrderData: {}
};
export default class OrderChannel {

    async getBasketData() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?member_id=' + memberId;
            let headers = {
                'Content-Platform': 'wxapp'
            }
            try {
                let resData = await util.fetch(url, { headers });
                console.log('resData', resData);
                if (resData.result === 1) {
                    return resData;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async deleteBasket(basketId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=delete&member_id=' + memberId;
            let post_data = 'basket_id=' + basketId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async clearBasket() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=clear&member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async addBasket(productId, specificateId, volume, location, image) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=add&member_id=' + memberId;
            let post_data = {
                product_id: productId,
                specificate_id: specificateId,
                volume: volume,
                location: location,
                image: image
            };
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async setBasketVolume(basketId, volume) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=set_volume&member_id=' + memberId;
            let post_data = {
                basket_id: basketId,
                volume: volume
            };
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async getBasketVolume() {
        let volume = 0;
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=get_volume&member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
                if (resData.result === 1) {
                    volume = resData.info.volume;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return volume;
    }

    async checkBasket(basketId, checkFlag) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=check&member_id=' + memberId;
            let post_data = 'basket_id=' + basketId + '&check_flag=' + checkFlag;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }
    async checkAllBasket(checkFlag) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/basket.aspx?post=allcheck&member_id=' + memberId;
            let post_data = 'check_flag=' + checkFlag;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    return true;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async getOrderConfirmData(ticketId, deliveryId, payType, receiveId, postBuyData) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/orderConfirm.aspx?member_id=' + memberId;
            let post_data = { ticket_id: ticketId, delivery_id: deliveryId, pay_type: payType, receive_id: receiveId };
            post_data = Object.assign({}, post_data, postBuyData);
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Platform': 'wxapp'
            }

            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    console.log(resData);
                    cache.confirmOrderData = resData.info;
                    return resData.info;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    getOrderConfirmCache() {
        return cache.confirmOrderData;
    }

    async postOrderConfirm(ticketId, deliveryId, paytype, receiveId, postBuyData, invoice) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/orderConfirm.aspx?post=place_order&member_id=' + memberId;
            let post_data = {
                ticket_id: ticketId,
                delivery_id: deliveryId,
                pay_type: paytype,
                receive_id: receiveId,
                post_script: '',
                invoice: invoice
            };
            post_data = Object.assign({}, post_data, postBuyData);
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Platform': 'wxapp'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    return resData.info.order_id;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return 0;
    }

    /*async getReshootOrderConfirmData(postBuyData) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/reshootOrderConfirm.aspx?member_id=' + memberId;
            let post_data = postBuyData + '&location=';
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    return resData.info;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async postReshootOrderConfirm(paytype, postScript, postBuyData) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/order/reshootOrderConfirm.aspx?post=place_order&member_id=' + memberId;
            let post_data = 'pay_type=' + paytype + '&platform=4&' + postBuyData + '&post_script=' + encodeURIComponent(postScript);

            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                if (resData.result === 1) {
                    return resData.info.order_id;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return 0;
    }*/

    async getOrderPayData(orderId, openId) {
        let url = config.Host + '/order/orderPay.aspx';
        let post_data = 'order_id=' + orderId + '&open_id=' + openId;
        let headers = {
            'Content-Platform': 'wxapp'
        }
        try {
            let resData = await util.fetch(url + '?' + post_data, { headers });
            if (resData.result === 1) {
                return resData.info;
            }
            else {
                console.warn(resData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}