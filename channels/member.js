import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';

export default class MemberChannel {
    constructor(options) {
        this.options = options;

        this.cache = {
            orderList: [],
            storeList: [],
            scoreLogList: [],
            ticketList: [],
            commentList: [],
            commentData: [],
            applyList: [],
        };
    }
    async getMemberInfo() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/info.aspx?member_id=' + memberId;
            console.log(memberId);
            try {
                let resData = await util.fetch(url);
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

    async getProfile() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/profile.aspx?member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
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
    async saveProfile(name, sex, birthYear, birthMonth, birthDay, area) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/profile.aspx?post=set_profile&member_id=' + memberId;
            let post_data = {
                name: encodeURIComponent(name),
                sex,
                birth_year: birthYear,
                birth_month: birthMonth,
                birth_day: birthDay,
                area
            }
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

    async getMemberOrderData() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/index.aspx?member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
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

    async getOrderList(showStatus, page, pageSize) {
        let data = [];
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/orderList.aspx?member_id=' + memberId;
            let post_data = 'show_status=' + showStatus + '&page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    data = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getOrderTrace(orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/orderTrace.aspx?member_id=' + memberId;
            let post_data = 'order_id=' + orderId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
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

    async getOrderDetail(orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/orderDetail.aspx?member_id=' + memberId;
            let post_data = 'order_id=' + orderId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
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

    async cancelOrder(orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/orderDetail.aspx?post=cancel&member_id=' + memberId;
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            let post_data = { order_id: orderId };
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

    async receiveOrder(orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/orderDetail.aspx?post=receive&member_id=' + memberId;
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            let post_data = { order_id: orderId };
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

    async getProductStore(page, pageSize) {
        let data = [];
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/productStore.aspx?member_id=' + memberId;
            let post_data = 'page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    data = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async deleteProductStore(storeId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/productStore.aspx?post=delete&member_id=' + memberId;
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            let post_data = { store_id: storeId };
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

    async getReceiveInfo(receiveId) {
        let memberId = memberState.getLoginId();
        if (memberId && receiveId > 0) {
            let url = config.Host + '/member/receive.aspx?member_id=' + memberId;
            let post_data = 'receive_id=' + receiveId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
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

    async deleteReceive(receiveId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/receive.aspx?post=delete&member_id=' + memberId;
            let post_data = {
                receive_id: receiveId
            }
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

    async saveReceive(receiveId, receiveName, receiveAddress, receiveMobile, receiveRegion, receiveDefault) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/receive.aspx?post=save&member_id=' + memberId;
            let post_data = {
                receive_id: receiveId,
                receive_name: Utility.filterUrlBad(receiveName),
                receive_mobile: receiveMobile,
                receive_region: receiveRegion,
                receive_zipcode: '',
                default_flag: receiveDefault,
                receive_address: encodeURIComponent(receiveAddress)
            };
            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let resData = await util.fetch(url, { method: 'POST', headers, body: post_data });
                return resData;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async getReceiveList() {
        let data = [];
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/receiveList.aspx?member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
                if (resData.result === 1) {
                    data = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getAccountData() {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/account.aspx?member_id=' + memberId;
            try {
                let resData = await util.fetch(url);
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
        return;
    }

    async postSetPassword(memberId, formPassword) {
        if (memberId) {
            let url = config.Host + '/member/setPassword.aspx?member_id=' + memberId;
            let password = Utility.md5(formPassword);
            let post_data = { password };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginEmail(memberId, loginEmail) {
        if (memberId) {
            let url = config.Host + '/member/setLoginEmail.aspx?member_id=' + memberId;
            let post_data = { login_email: loginEmail };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginMobile(memberId, loginMobile) {
        if (memberId) {
            let url = config.Host + '/member/setLoginMobile.aspx?member_id=' + memberId;
            let post_data = { login_mobile: loginMobile };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginName(memberId, loginName) {
        if (memberId) {
            let url = config.Host + '/member/setLoginName.aspx?member_id=' + memberId;
            let post_data = { login_name: loginName };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getScoreLog(page, pageSize) {
        let data = [];
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/scoreLog.aspx?member_id=' + memberId;
            let post_data = 'page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    data = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getTicketList(page, pageSize) {
        let data = [];
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/ticketList.aspx?member_id=' + memberId;
            let post_data = 'used_flag=-1&due_flag=-1&page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    data = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async bindTicket(ticketCode) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/ticketList.aspx?post=bind&member_id=' + memberId;
            let post_data = { ticket_code: Utility.filterUrlBad(ticketCode) };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getCommentList(page, pageSize) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/productCommentList.aspx?member_id=' + memberId;
            let post_data = 'page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
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

    async getCommentData(orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/productComment.aspx?member_id=' + memberId;
            let post_data = 'order_id=' + orderId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    return resData.list;
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

    async saveComment(orderItemId, content, imageUrlArray, imageWidthArray, imageHeightArray) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/productComment.aspx?post=save&member_id=' + memberId;
            let post_data = {
                orderitem_id: orderItemId,
                image: imageUrlArray.join(','),
                image_w: imageWidthArray.join(','),
                image_h: imageHeightArray.join(','),
                content: encodeURIComponent(content)
            };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getApplyData(applyId, orderId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/apply.aspx?member_id=' + memberId;
            let post_data = 'apply_id=' + applyId + '&order_id=' + orderId;
            try {
                let resData = await util.fetch(url + '&' + post_data);
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

    async saveApply(orderId, applyType, title, content) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/apply.aspx?post=apply&member_id=' + memberId;
            let post_data = {
                order_id: orderId,
                type: applyType,
                title: Utility.filterUrlBad(title),
                content: encodeURIComponent(content)
            };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async replyApply(applyId, content) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/apply.aspx?post=reply&member_id=' + memberId;
            let post_data = {
                apply_id: applyId,
                content: encodeURIComponent(content)
            };
            let headers = {
                "Content-Type": "application/x-www-form-urlencoded"
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
    async getApplyList(applyType, page, pageSize) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/member/applyList.aspx?member_id=' + memberId;
            let post_data = 'apply_type=' + applyType + '&page=' + page + '&page_size=' + pageSize;
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    return resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return [];
    }

}