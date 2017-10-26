import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';
var cache = {
    pageModuleData: [],
    pageListData: []
};

export default class HomeChannel {

    findPageModuleCache(code) {
        let item = cache.pageModuleData.find((item, index) => {
            return item.code === code;
        });
        if (item) {
            return item.data;
        }
    }
    findPageListCache(code) {
        let item = cache.pageListData.find((item, index) => {
            return item.code === code;
        });
        if (item) {
            return item.list;
        }
        else {
            return [];
        }
    }
    async getPageProductList(listCode, page, pageSize) {
        let data = this.findPageListCache(listCode + '_' + page);
        if (data.length === 0) {
            let url = config.Host + '/index.aspx?post=list';
            let post_data = 'code=' + listCode + '&page=' + page + '&page_size=' + pageSize;
            
            try {
                let resData = await util.fetch(url + '&' + post_data);
                if (resData.result === 1) {
                    data = resData.list;
                    if (data.length > 0) {
                        cache.pageListData.push({ code: listCode + '_' + page, list: data });
                    }
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

    async getPageModuleList(moduleCode) {
        let data = this.findPageModuleCache(moduleCode);
        if (!data) {
            let url = config.Host + '/index.aspx?post=module';
            let post_data = 'code=' + moduleCode;
            try {
                const responseData = await util.fetch(url + '&' + post_data);
                if (responseData.result === 1) {
                    data = responseData;
                    cache.pageModuleData.push({ code: moduleCode, data });
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

    async getScoreExchTicketList(ticketActIdArray) {
        let data = [];
        let url = config.Host + '/scoreExchange.aspx';
        let headers = {
            'Content-Platform': 'wxapp'
        }
        let post_data = 'tid=' + ticketActIdArray;
        try {
            let resData = await util.fetch(url + '?' + post_data, { headers });
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
        return data;
    }
    async scoreExchTicket(ticketActId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/scoreExchange.aspx?post=exch_ticket&member_id=' + memberId;
            let headers = {
                'Content-Platform': 'wxapp'
            }
            let post_data = 'exch_id=' + ticketActId;
            try {
                let resData = await util.fetch(url + '&' + post_data, { headers });
                return resData;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async getSearchKeyword() {
        let url = config.Host + '/search.aspx';
        try {
            let resData = await util.fetch(url);
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