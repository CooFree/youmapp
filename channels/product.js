import Config from '../config';
import Utility from '../utils/utility';
import MemberLoginState from '../utils/memberState';
import { TopCategoryArray } from '../constant';

export default class ProductChannel {
    constructor(options) {
        this.options = options;

        this.cache = {
            tagData: [],
            categoryData: [],
            productList: [],
            commentList: [],
            vproductList: [],
            topicProductList: [],
            productSearch: []
        };
    }

    async getCategoryData() {
        if (this.cache.categoryData.length === 0) {
            let command_url = Config.ApiHost + '/category.aspx';
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    this.cache.categoryData = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.categoryData;
    }

    async getTagData() {
        if (this.cache.tagData.length === 0) {
            let command_url = Config.ApiHost + '/product/tagList.aspx';
            try {
                let responseData = await fetch(command_url).then(response => response.json());
                if (responseData.result === 1) {
                    this.cache.tagData = responseData.list;
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return this.cache.tagData;
    }
    async getProductInfo(productId) {
        let command_url = Config.ApiHost + '/product/productDetail.aspx?product_id=' + productId;

        try {
            let responseData = await fetch(command_url).then(response => response.json());
            if (responseData.result === 1) {
                return responseData.info.product;
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async getProductDetail(productId) {
        let command_url = Config.ApiHost + '/product/productDetail.aspx?product_id=' + productId;
        try {
            let responseData = await fetch(command_url).then(response => response.json());
            if (responseData.result === 1) {
                let memberId = MemberLoginState.getLoginIdStr();
                let spec_command_url = Config.ApiHost + '/handlers/getSpecificateListJson.ashx?product_id=' + productId + '&member_id=' + memberId;
                let responseSpecData = await fetch(spec_command_url).then(response => response.json());
                if (responseSpecData.result === 1) {
                    return { productData: responseData.info, specificateData: responseSpecData.info };
                }
                else {
                    console.warn(responseData.msg);
                }
            }
            else {
                console.warn(responseData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
        return null;
    }
    async getProductPrefer(productId) {
        let data = [];
        let memberId = MemberLoginState.getLoginIdStr();
        let command_url = Config.ApiHost + '/product/productDetail.aspx?post=get_prefer&product_id=' + productId + '&member_id=' + memberId;
        let fetchHeaders = {
            'Content-Platform': 'wap'
        }
        try {
            let responseData = await fetch(command_url, { headers: fetchHeaders }).then(response => response.json());
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
        return data;
    }
    async addProductStore(productId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/product/productDetail.aspx?post=add_store&member_id=' + memberId;
            let post_data = 'product_id=' + productId;
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

    async deleteProductStore(productId) {
        let memberId = MemberLoginState.getLoginId();
        if (memberId) {
            let command_url = Config.ApiHost + '/product/productDetail.aspx?post=delete_store&member_id=' + memberId;
            let post_data = 'product_id=' + productId;
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

    async getProductCommentList(productId, page, pageSize) {
        let data = [];
        let memberId = MemberLoginState.getLoginIdStr();
        let command_url = Config.ApiHost + '/product/productDetail.aspx?post=get_comment&member_id=' + memberId + '&product_id=' + productId + '&page=' + page + '&page_size=' + pageSize;

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
        return data;
    }

    async getProductList(productClassId, brand, sort, page, pageSize) {
        let data = [];
        let command_url = Config.ApiHost + '/product/productList.aspx?class_id=' + productClassId + '&brand=' + brand + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;
  
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
        return data;
    }

    async getTopProductList(productClassId, pageSize) {
        let data = [];
        let command_url = Config.ApiHost + '/product/productList.aspx?post=toplist&class_id=' + productClassId + '&page_size=' + pageSize;

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
        return data;
    }

    async getVProductList(vproductClassId, sort, page, pageSize) {
        let data = [];
        let command_url = Config.ApiHost + '/product/vproductList.aspx?class_id=' + vproductClassId + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;
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
        return data;
    }

    async getTopicProductList(vproductClassId, preferId, page, pageSize) {
        let data = [];
        let command_url = Config.ApiHost + '/product/topicProductList.aspx?class_id=' + vproductClassId + '&prefer_id=' + preferId + '&page=' + page + '&page_size=' + pageSize;

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
        return data;
    }

    async getProductSearch(keyword, sort, page, pageSize) {
        let data = [];
        let command_url = Config.ApiHost + '/product/productSearch.aspx?keyword=' + encodeURIComponent(keyword) + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;

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
        return data;
    }

    async getProductClassInfo(productClassId) {
        let command_url = Config.ApiHost + '/product/productList.aspx?post=get_class&class_id=' + productClassId;
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

    async getVProductClassInfo(productClassId) {
        let command_url = Config.ApiHost + '/product/vproductList.aspx?post=get_class&class_id=' + productClassId;
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

    async getTopicProductPrefer(preferId) {
        let command_url = Config.ApiHost + '/product/topicProductList.aspx?post=get_prefer&prefer_id=' + preferId;
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