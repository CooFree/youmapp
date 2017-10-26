import ProductChannel from '../../../channels/product';
import OrderChannel from '../../../channels/order';
import util from '../../../utils/util';
import buyTemp from '../../../utils/buyTemp';

const orderChannel = new OrderChannel();
const productChannel = new ProductChannel();
Page({
    timeout: 0,
    data: {
        productId: 0,
        location: '',
        previewCommentpic: '',
        showSelector: false,
        detailImageList: [],
        specificateData: [],
        arrayColor: [],
        arraySize: [],
        specItem: null,
        finlImg: '',
        finlColor: '',
        finlSize: '',
        finlVolume: 1,
        limitseconds: 0,
        limittime: '',
        storeflag: 0,
        tagList: [],
    },
    showPreview: function (event) {
        let url = event.currentTarget.dataset.url;
        this.setData({ previewCommentpic: url });
    },
    hidePreview: function (event) {
        this.setData({ previewCommentpic: '' });
    },
    onOption: function () {
        const { specificateData, productDetail } = this.data;

        let tempArrayColor1 = [], tempArraySize1 = [], tempArrayColor2 = [], tempArraySize2 = [];
        specificateData.spec_list.forEach(function (spec_item, index) {
            if (tempArrayColor1.indexOf(spec_item.color) < 0) {
                tempArrayColor1.push(spec_item.color);

                let image_url = '';
                productDetail.color_image_list.some((item, index) => {
                    if (spec_item.color === item.color) {
                        image_url = item.image_url;
                        return true;
                    }
                });
                tempArrayColor2.push({ color: spec_item.color, sale: 1, image_url });
            }
            if (tempArraySize1.indexOf(spec_item.size) < 0) {
                tempArraySize1.push(spec_item.size);
                tempArraySize2.push({ size: spec_item.size, sale: 1 });
            }
        });

        this.setData({ arrayColor: tempArrayColor2, arraySize: tempArraySize2 });
    },
    selectColor: function (event) {
        const { specitem } = event.currentTarget.dataset;
        let { specificateData, arraySize, finlColor } = this.data;
        if (specitem.sale === 1) {
            if (specitem.color === finlColor) {
                arraySize.forEach((item, index) => { item.sale = 1; });
                this.setData({ selectColorIndex: -1, finlImg: '', finlColor: '', arraySize });
            }
            else {
                arraySize.forEach((item, index) => { item.sale = 0; });
                specificateData.spec_list.forEach((spec, index) => {
                    if (spec.color === specitem.color) {
                        arraySize.some((item, index) => {
                            if (item.size === spec.size) {
                                item.sale = 1;
                                return true;
                            }
                        });
                    }
                });
                this.setData({ finlImg: specitem.image_url, finlColor: specitem.color, finlVolume: 1, arraySize });
            }
        }

        this.selectSpecItem();
    },
    selectSize: function (event) {
        const { specitem } = event.currentTarget.dataset;
        const { specificateData, arrayColor, finlSize } = this.data;
        if (specitem.sale === 1) {
            if (specitem.size === finlSize) {
                arrayColor.forEach((item, index) => { item.sale = 1; });
                this.setData({ finlSize: '', arrayColor });
            }
            else {
                arrayColor.forEach((item, index) => { item.sale = 0; });
                specificateData.spec_list.forEach((spec, index) => {
                    if (spec.size === specitem.size) {
                        arrayColor.some((item, index) => {
                            if (item.color === spec.color) {
                                item.sale = 1;
                                return true;
                            }
                        });
                    }
                });
                this.setData({ finlSize: specitem.size, finlVolume: 1, arrayColor });
            }
        }

        this.selectSpecItem();
    },
    selectSpecItem: function () {
        const { finlColor, finlSize, specificateData } = this.data;
        let specItem = null;
        specificateData.spec_list.some((spec, index) => {
            if (spec.size === finlSize && spec.color === finlColor) {
                specItem = spec;
                return true;
            }
        });
        this.setData({ specItem });
    },
    setVolume: function (event) {
        const { specItem, productDetail } = this.data;
        const reserve = specItem ? specItem.reserve : productDetail.product.reserve;
        let volume = parseInt(event.detail.value) || 0;
        if (volume === 0) {
            volume = 1;
        }
        if (volume > reserve) {
            volume = reserve;
        }
        this.setData({ finlVolume: volume });
    },
    addVolume: function (event) {
        let { finlVolume, specItem, productDetail } = this.data;
        const reserve = specItem ? specItem.reserve : productDetail.product.reserve;

        if (finlVolume < reserve) {
            this.setData({ finlVolume: ++finlVolume });
        }
    },
    reduceVolume: function (event) {
        let { finlVolume } = this.data;
        if (finlVolume > 1) {
            this.setData({ finlVolume: --finlVolume });
        }
    },
    toggleSelector: function (event) {
        this.setData({ showSelector: !this.data.showSelector });
    },
    setStore: function (event) {
        const { prodid } = event.currentTarget.dataset;
        let { storeflag } = this.data;
        if (storeflag === 1) {
            productChannel.deleteProductStore(prodid).then(data => {
                if (data) {
                    this.setData({ storeflag: 0 });
                }
            });
        } else {
            productChannel.addProductStore(prodid).then(data => {
                if (data) {
                    this.setData({ storeflag: 1 });
                }
            });
        }
    },
    onBuy: function (event) {
        let { specItem, finlImg, finlColor, finlSize, finlVolume, location } = this.data;
        if (!specItem) {
            this.setData({ showSelector: true });
            return;
        }
        if (finlVolume === 0) {
            this.setData({ showSelector: true });
            return;
        }
        buyTemp.addBuy(specItem.id, finlVolume, location, finlImg);
        this.setData({ showSelector: false });
        wx.navigateTo({ url: '../../order/orderConfirm/orderConfirm' });
    },
    onBasket: function (event) {
        let { specItem, finlImg, finlColor, finlSize, finlVolume, productId, location } = this.data;
        if (!specItem) {
            this.setData({ showSelector: true });
            return;
        }
        if (finlVolume === 0) {
            this.setData({ showSelector: true });
            return;
        }
        orderChannel.addBasket(productId, specItem.id, finlVolume, location, finlImg);
        this.setData({ showSelector: false });
        wx.showToast({ title: '已加入购物车', icon: 'success', duration: 2000 });
    },
    onLoad: function (options) {

        const productId = parseInt(options.prod_id) || 0;

        wx.showLoading();
        productChannel.getProductDetail(productId).then(data => {
            if (data) {
                this.setData({
                    location: options.location || '',
                    productId,
                    productDetail: data.productData,
                    specificateData: data.specificateData,
                    storeflag: data.specificateData.store_flag
                });

                this.onTiming(data.specificateData.limittime_seconds);
                this.onOption();
            }
            wx.hideLoading();
        });

        productChannel.getProductCommentList(productId, 1, 1).then(data => {
            this.setData({ productCommentList: data });
        });

        productChannel.getTagData().then(data => {
            this.setData({ tagList: data });
        });
    },
    onTiming: function (limitSeconds) {
        if (limitSeconds > 0) {
            limitSeconds--;
            let time = util.timing(limitSeconds);
            this.setData({ limittime: time.day + ':' + time.hour + ':' + time.minute + ':' + time.second, limitseconds: limitSeconds });
            this.timeout = setTimeout(() => this.onTiming(limitSeconds), 1000);
        }
        else {
            this.setData({ limittime: '', limitseconds: 0 });
        }
    },
    onReachBottom: function () {
        const { productDetail, detailImageList } = this.data;
        if (detailImageList.length === 0) {
            this.setData({ detailImageList: productDetail.detail_image_list });
        }
    },
    onUnload: function () {
        clearTimeout(this.timeout);
    }
})