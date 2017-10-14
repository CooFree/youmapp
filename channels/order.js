import Config from '../config';
import Utility from '../utils/utility';
import MemberLoginState from '../utils/memberState';

export default class OrderChannel {
    constructor(options) {
        this.options = options;

        this.cache = {
            basketData: {},
            confirmOrderData: {}
        };
    }

    async getBasketData() {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/basket.aspx?member_id=' + memberId;
            let fetchHeaders = {
                'Content-Platform': 'wap'
            }
            try {
                let responseData = await fetch(command_url, { headers: fetchHeaders }).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async deleteBasket(basketId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let post_data = 'basket_id=' + basketId;
            let command_url = Config.ApiHost + '/order/basket.aspx?post=delete&member_id=' + memberId + '&' + post_data;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async clearBasket() {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/basket.aspx?post=clear&member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async addBasket(productIds, specificateIds, volumes, locations, images) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/basket.aspx?post=add&member_id=' + memberId;
            let post_data = 'product_id=' + productIds + '&specificate_id=' + specificateIds + '&volume=' + volumes + '&location=' + locations + '&image=' + Utility.decodeURI(images);
            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async setBasketVolume(basketId, volume) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/basket.aspx?post=set_volume&member_id=' + memberId;
            let post_data = 'basket_id=' + basketId + '&volume=' + volume;
            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
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
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/basket.aspx?post=get_volume&member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    volume = responseData.info.volume;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return volume;
    }

    async checkBasket(basketId, checkFlag) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let post_data = 'basket_id=' + basketId + '&check_flag=' + checkFlag;
            let command_url = Config.ApiHost + '/order/basket.aspx?post=check&member_id=' + memberId + '&' + post_data;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }
    async checkAllBasket(checkFlag) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let post_data = 'check_flag=' + checkFlag;
            let command_url = Config.ApiHost + '/order/basket.aspx?post=allcheck&member_id=' + memberId + '&' + post_data;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return true;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return false;
    }

    async getOrderConfirmData(ticketId, deliveryId, payType, receiveId, postBuyData) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/orderConfirm.aspx?member_id=' + memberId;
            let post_data = 'ticket_id=' + ticketId + '&delivery_id=' + deliveryId + '&pay_type=' + payType + '&receive_id=' + receiveId + '&' + postBuyData + '&location=';
            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Platform': 'wap'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    this.cache.confirmOrderData = responseData.info.order;
                    return responseData.info;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async postOrderConfirm(ticketId, deliveryId, paytype, receiveId, postBuyData, invoice) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let src = localStorage.getItem('channel_src') || '';//来源
            let src_url = localStorage.getItem('channel_url') || '';//来源地址

            let command_url = Config.ApiHost + '/order/orderConfirm.aspx?post=place_order&member_id=' + memberId;
            let post_data = 'ticket_id=' + ticketId + '&delivery_id=' + deliveryId + '&pay_type=' + paytype + '&receive_id=' + receiveId + '&' + postBuyData
                + '&post_script=&invoice=' + encodeURIComponent(invoice) + '&src=' + encodeURIComponent(src) + '&src_url=' + encodeURIComponent(src_url);

            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Platform': 'wap'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData.info.order_id;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return 0;
    }

    async getReshootOrderConfirmData(postBuyData) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/reshootOrderConfirm.aspx?member_id=' + memberId;
            let post_data = postBuyData + '&location=';
            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData.info;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async postReshootOrderConfirm(paytype, postScript, postBuyData) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/order/reshootOrderConfirm.aspx?post=place_order&member_id=' + memberId;
            let post_data = 'pay_type=' + paytype + '&platform=4&' + postBuyData + '&post_script=' + encodeURIComponent(postScript);

            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData.info.order_id;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return 0;
    }

    async getOrderPayData(orderId, openId) {
        let command_url = Config.ApiHost + '/order/orderPay.aspx?order_id=' + orderId + '&open_id=' + openId;
        let fetchHeaders = {
            'Content-Platform': 'wap'
        }
        try {
            let responseData = await fetch(command_url, { headers: fetchHeaders }).then(response => response.json());
            if (responseData.result === 1) {
                return responseData.info;
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    async payAlipay(outTradeNo, tradeNo, tradeStatusCode, totalAmount, timesTamp, preSign, sign) {
        let command_url = Config.ApiHost + '/alipayReturn.aspx?out_trade_no=' + outTradeNo + '&trade_no=' + tradeNo + '&trade_status_code=' + tradeStatusCode
            + '&total_amount=' + totalAmount + '&timestamp=' + timesTamp;
        let post_data = 'pre_sign=' + encodeURIComponent(preSign) + '&sign=' + encodeURIComponent(sign);
        /*let command_url = 'https://app.camel.com.cn/alipayReturn.aspx?out_trade_no=201611291652530652&trade_no=2016122021001004730200153233&trade_status_code=10000&total_amount=476.00&timestamp=2016-12-20 14:41:17';
        let post_data = 'pre_sign=' + encodeURIComponent('{"code":"10000","msg":"Success","app_id":"2016072900117438","auth_app_id":"2016072900117438","charset":"utf-8","timestamp":"2016-12-20 14:41:17","total_amount":"476.00","trade_no":"2016122021001004730200153233","seller_id":"2088102168995155","out_trade_no":"201611291652530652"}') + '&sign=' + encodeURIComponent('fN0VEXTeV9sqktpJ5EZVrToK9DVXxIPnkOUpEjWY3EljuXd1WlO3V4pLGNg4Ci7OS6WfElB1kVM4dFmHdmaoq+qFBZ+HW6aZJ7bf9vncl6l+LOfSJ5KW2SrLF9cqaQin0l/trhT6k6nKR1VxksLDcY4Pmv1wArXFoJSF5SgXZ3A=');
        */
        let fetchHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        try {
            let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.text());
            if (responseData === 'success') {
                return true;
            }
            else {
                console.warn(responseData);
            }
        }
        catch (error) {
            console.error(error);
        }
        return false;
    }
}