import Config from '../config';
import Utility from '../utils/utility';
import MemberLoginState from '../utils/memberState';

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
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/info.aspx?member_id=' + memberId;

            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async getProfile() {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/profile.aspx?member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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
    async saveProfile(name, sex, birthYear, birthMonth, birthDay, area) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/profile.aspx?member_id=' + memberId + '&post=set_profile';
            let post_data = 'name=' + encodeURIComponent(name) + '&sex=' + sex + '&birth_year=' + birthYear + '&birth_month=' + birthMonth + '&birth_day=' + birthDay + '&area=' + area;
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

    async getMemberOrderData() {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/index.aspx?member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async getOrderList(showStatus, page, pageSize) {
        let data = [];
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/orderList.aspx?member_id=' + memberId + '&show_status=' + showStatus + '&page=' + page + '&page_size=' + pageSize;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    data = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getOrderTrace(orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/orderTrace.aspx?member_id=' + memberId + '&order_id=' + orderId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async getOrderDetail(orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/orderDetail.aspx?member_id=' + memberId + '&order_id=' + orderId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async cancelOrder(orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/orderDetail.aspx?post=cancel&member_id=' + memberId;
            let post_data = 'order_id=' + orderId;
            try {
                let responseData = await fetch(command_url + '&' + post_data).then(response => response.json());
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

    async receiveOrder(orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/orderDetail.aspx?post=receive&member_id=' + memberId;
            let post_data = 'order_id=' + orderId;
            try {
                let responseData = await fetch(command_url + '&' + post_data).then(response => response.json());
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

    async getProductStore(page, pageSize) {
        let data = [];
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/productStore.aspx?member_id=' + memberId + '&page=' + page + '&page_size=' + pageSize;

            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    data = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async deleteProductStore(storeId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/productStore.aspx?post=delete&member_id=' + memberId;
            let post_data = 'store_id=' + storeId;
            try {
                let responseData = await fetch(command_url + '&' + post_data).then(response => response.json());
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

    async getReceiveInfo(receiveId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId && receiveId > 0) {
            let command_url = Config.ApiHost + '/member/receive.aspx?member_id=' + memberId + '&receive_id=' + receiveId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async deleteReceive(receiveId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/receive.aspx?post=delete&member_id=' + memberId;
            let post_data = 'receive_id=' + receiveId;
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

    async saveReceive(receiveId, receiveName, receiveAddress, receiveMobile, receiveRegion, receiveDefault) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/receive.aspx?post=save&member_id=' + memberId;
            let post_data = 'receive_id=' + receiveId + '&receive_name=' + Utility.filterUrlBad(receiveName) + '&receive_mobile=' + receiveMobile
                + '&receive_region=' + receiveRegion + '&receive_zipcode=&default_flag=' + receiveDefault + '&receive_address=' + encodeURIComponent(receiveAddress);
            let fetchHeaders = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            try {
                let responseData = await fetch(command_url, { method: 'POST', headers: fetchHeaders, body: post_data }).then(response => response.json());
                return responseData;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async getReceiveList() {
        let data = [];
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/receiveList.aspx?member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    data = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async getAccountData() {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/account.aspx?member_id=' + memberId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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
        return;
    }

    async postSetPassword(memberId, formPassword) {
        if (memberId) {
            let command_url = Config.ApiHost + '/member/setPassword.aspx?member_id=' + memberId;
            let password = Utility.md5(formPassword);
            let post_data = 'password=' + password;
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginEmail(memberId, loginEmail) {
        if (memberId) {
            let command_url = Config.ApiHost + '/member/setLoginEmail.aspx?member_id=' + memberId;
            let post_data = 'login_email=' + loginEmail;
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginMobile(memberId, loginMobile) {
        if (memberId) {
            let command_url = Config.ApiHost + '/member/setLoginMobile.aspx?member_id=' + memberId;
            let post_data = 'login_mobile=' + loginMobile;
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async postSetLoginName(memberId, loginName) {
        if (memberId) {
            let command_url = Config.ApiHost + '/member/setLoginName.aspx?member_id=' + memberId;
            let post_data = 'login_name=' + loginName;
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getScoreLog(page, pageSize) {
        let data = [];
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/scoreLog.aspx?member_id=' + memberId + '&page=' + page + '&page_size=' + pageSize;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    data = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
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
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/ticketList.aspx?member_id=' + memberId + '&used_flag=-1&due_flag=-1&page=' + page + '&page_size=' + pageSize;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    data = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return data;
    }

    async bindTicket(ticketCode) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/ticketList.aspx?post=bind&member_id=' + memberId;
            let post_data = 'ticket_code=' + Utility.filterUrlBad(ticketCode);
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getCommentList(page, pageSize) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/productCommentList.aspx?member_id=' + memberId + '&page=' + page + '&page_size=' + pageSize;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async getCommentData(orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/productComment.aspx?member_id=' + memberId + '&order_id=' + orderId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData.list;
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

    async saveComment(orderItemId, content, imageUrlArray, imageWidthArray, imageHeightArray) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/productComment.aspx?post=save&member_id=' + memberId;
            let post_data = 'orderitem_id=' + orderItemId + '&image=' + imageUrlArray.join(',') + '&image_w=' + imageWidthArray.join(',') + '&image_h=' + imageHeightArray.join(',') + '&content=' + encodeURIComponent(content);
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async getApplyData(applyId, orderId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/apply.aspx?member_id=' + memberId + '&apply_id=' + applyId + '&order_id=' + orderId;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
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

    async saveApply(orderId, applyType, title, content) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/apply.aspx?post=apply&member_id=' + memberId;
            let post_data = 'order_id=' + orderId + '&type=' + applyType + '&title=' + Utility.filterUrlBad(title)+'&content=' + encodeURIComponent(content);
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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

    async replyApply(applyId, content) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/apply.aspx?post=reply&member_id=' + memberId;
            let post_data = 'apply_id=' + applyId + '&content=' + encodeURIComponent(content);
            let fetchHeaders = {
                "Content-Type": "application/x-www-form-urlencoded"
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
    async getApplyList(applyType, page, pageSize) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/member/applyList.aspx?member_id=' + memberId + '&apply_type=' + applyType + '&page=' + page + '&page_size=' + pageSize;
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    return responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return [];
    }

}