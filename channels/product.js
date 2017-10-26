import config from '../config';
import regeneratorRuntime from '../modules/regenerator-runtime/runtime';
import util from '../utils/util';
import memberState from '../utils/memberState';
import { TopCategoryArray } from '../constant';
var cache = {
    tagData: [],
    categoryData: [],
    productList: [],
    commentList: [],
    vproductList: [],
    topicProductList: [],
    productSearch: []
};
export default class ProductChannel {

    async getCategoryData() {
        if (cache.categoryData.length === 0) {
            let url = config.Host + '/category.aspx';
            try {
                let resData = await util.fetch(url);
                if (resData.result === 1) {
                    cache.categoryData = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return cache.categoryData;
    }

    async getTagData() {
        if (cache.tagData.length === 0) {
            let url = config.Host + '/product/tagList.aspx';
            try {
                let resData = await util.fetch(url);
                if (resData.result === 1) {
                    cache.tagData = resData.list;
                }
                else {
                    console.warn(resData.msg);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        return cache.tagData;
    }
    async getProductInfo(productId) {
        let url = config.Host + '/product/productDetail.aspx';
        let post_data = 'product_id=' + productId;
        try {
            let resData = await util.fetch(url + '?' + post_data);
            if (resData.result === 1) {
                return resData.info.product;
            }
            else {
                console.warn(resData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async getProductDetail(productId) {
        let url = config.Host + '/product/productDetail.aspx';
        let post_data = 'product_id=' + productId;
        try {
            let resData = await util.fetch(url + '?' + post_data);
            if (resData.result === 1) {
                let memberId = memberState.getLoginIdStr();
                let spec_url = config.Host + '/handlers/getSpecificateListJson.ashx?product_id=' + productId + '&member_id=' + memberId;
                let responseSpecData = await util.fetch(spec_url);
                if (responseSpecData.result === 1) {
                    return { productData: resData.info, specificateData: responseSpecData.info };
                }
                else {
                    console.warn(resData.msg);
                }
            }
            else {
                console.warn(resData.msg);
            }
        }
        catch (error) {
            console.error(error);
        }
        return null;
    }
    async getProductPrefer(productId) {
        let data = [];
        let memberId = memberState.getLoginIdStr();
        let url = config.Host + '/product/productDetail.aspx?post=get_prefer';
        let post_data = 'product_id=' + productId + '&member_id=' + memberId;
        let headers = {
            'Content-Platform': 'wxapp'
        }
        try {
            let resData = await util.fetch(url + '&' + post_data, { headers });
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
    async addProductStore(productId) {
        let memberId = memberState.getLoginId();
        if (memberId) {
            let url = config.Host + '/product/productDetail.aspx?post=add_store&member_id=' + memberId;
            let post_data = {
                product_id: productId
            }
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

    async deleteProductStore(productId) {
        let memberId = memberState.getLoginId();
        
        if (memberId) {
            let url = config.Host + '/product/productDetail.aspx?post=delete_store&member_id=' + memberId;
            let post_data = {
                product_id: productId
            }
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

    async getProductCommentList(productId, page, pageSize) {
        let data = [];
        let memberId = memberState.getLoginIdStr();
        let url = config.Host + '/product/productDetail.aspx?post=get_comment&member_id=' + memberId;
        let post_data = 'product_id=' + productId + '&page=' + page + '&page_size=' + pageSize;
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
        return data;
    }

    async getProductList(classId, brand, sort, page, pageSize) {
        let data = [];
        let url = config.Host + '/product/productList.aspx';
        let post_data = 'class_id=' + classId + '&brand=' + brand + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;
        try {
            let resData = await util.fetch(url + '?' + post_data);
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

    async getTopProductList(classId, pageSize) {
        let data = [];
        let url = config.Host + '/product/productList.aspx?post=toplist';
        let post_data = 'class_id=' + classId + '&page_size=' + pageSize;
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
        return data;
    }

    async getVProductList(classId, sort, page, pageSize) {
        let data = [];
        let url = config.Host + '/product/vproductList.aspx';
        let post_data = 'class_id=' + classId + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;
        try {
            let resData = await util.fetch(url + '?' + post_data);
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

    async getTopicProductList(classId, preferId, page, pageSize) {
        let data = [];
        let url = config.Host + '/product/topicProductList.aspx';
        let post_data = 'class_id=' + classId + '&prefer_id=' + preferId + '&page=' + page + '&page_size=' + pageSize;
        try {
            let resData = await util.fetch(url + '?' + post_data);
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

    async getProductSearch(keyword, sort, page, pageSize) {
        let data = [];
        let url = config.Host + '/product/productSearch.aspx';
        let post_data = 'keyword=' + encodeURIComponent(keyword) + '&sort=' + sort + '&page=' + page + '&page_size=' + pageSize;

        try {
            let resData = await util.fetch(url + '?' + post_data);
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

    async getProductClassInfo(classId) {
        let url = config.Host + '/product/productList.aspx?post=get_class';
        let post_data = 'class_id=' + classId;
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

    async getVProductClassInfo(classId) {
        let url = config.Host + '/product/vproductList.aspx?post=get_class';
        let post_data = 'class_id=' + classId;
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

    async getTopicProductPrefer(preferId) {
        let url = config.Host + '/product/topicProductList.aspx?post=get_prefer';
        let post_data = 'prefer_id=' + preferId;
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