// pages/product/productDetail/productDetail.js
import ProductChannel from '../../../channels/product';
import util from '../../../utils/util';
const productChannel = new ProductChannel();

Page({
    timeout: 0,
    data: {
        previewCommentpic: '',
        selectColorIndex: -1,
        selectSizeIndex: -1,
        showSelector: false,
        specificateData: [],
        arrayColor: [],
        arraySize: [],
        selectColor: [],
        selectSize: [],
        specItem: null,
        finlImg: '',
        finlColor: '',
        finlSize: '',
        limittime: null,
        finlVolume: 1,
        storeflag: 0,
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
            if (tempArraySize1.indexOf(value.color) < 0) {
                tempArraySize1.push(value.size);
                tempArraySize2.push({ size: spec_item.size, sale: 1 });
            }
        });

        this.setData({ arrayColor: tempArrayColor2, arraySize: tempArraySize2 });
    },
    selectOption: function (event, arrayData, selectIndex, seType) {
        const { dis, option, index } = event.currentTarget.dataset;
        if (dis === false) {
            let specList = this.data.specificateData.spec_list;
            let tempArr1 = [];
            let tempArr2 = util.deepCopy(arrayData);
            let tempData = arrayData;

            specList.forEach((item, index) => {
                if (seType === 'color') {
                    if (item.color === option.color) {
                        tempArr1.push(item.size);
                    }
                } else {
                    if (item.size === option.size) {
                        tempArr1.push(item.color);
                    }
                }
            });

            tempArr2.forEach((item2, index2) => {
                let saleFlag = false;
                tempArr1.some((item1, index1) => {
                    if (item2.value === item1.value) {
                        saleFlag = true;
                        return true;
                    }
                });
                if (saleFlag === false) {
                    item2.sale = 0;
                }
            });

            if (seType === 'color') {
                if (index === this.data.selectColorIndex) {
                    this.setData({ selectColor: tempData, selectColorIndex: -1, finlImg: '', finlColor: '' });
                } else {
                    this.setData({ selectColor: tempArr2, selectColorIndex: index, finlColor: value, finlVolume: 1 });
                }
            } else {
                if (index === this.data.selectSizeIndex) {
                    this.setData({ selectSize: tempData, selectSizeIndex: -1, finlSize: '' });
                } else {
                    this.setData({ selectSize: tempArr2, selectSizeIndex: index, finlSize: value, finlVolume: 1 });
                }
            }

            let { finlColor, finlSize } = this.data;
            if (finlColor.length > 0 && finlSize.length > 0) {
                let temp = [];
                specList.forEach((value, index) => {
                    if (value.color === finlColor) {
                        temp.push(value);
                    }
                });
                temp.forEach((value, index) => {
                    if (value.size === finlSize) {
                        this.setData({
                            specItem: value
                        })
                    }
                });
            }
        }
    },
    selectColor: function (event) {
        this.selectOption(event, this.data.arraySize, this.data.selectColorIndex, 'color');
    },
    selectSize: function (event) {
        this.selectOption(event, this.data.arrayColor, this.data.selectSizeIndex, 'size');
    },
    setVolume: function (event) {
        let value = event.detail.value;
        let reserve = this.data.specItem !== null ? this.data.specItem.reserve : this.data.productDetail.product.reserve;
        if (reserve) {
            if (value > reserve) {
                this.setData({
                    finlVolume: reserve
                })
            } else if (value < 1) {
                this.setData({
                    finlVolume: 1
                })
            } else {
                this.setData({
                    finlVolume: value
                })
            }
        }
    },
    addVolume: function (event) {
        let finlVolume = this.data.finlVolume;
        let reserve = this.data.specItem !== null ? this.data.specItem.reserve : this.data.productDetail.product.reserve;

        if (finlVolume < reserve) {
            this.setData({
                finlVolume: ++finlVolume
            })
        }
    },
    reduceVolume: function (event) {
        let finlVolume = this.data.finlVolume;
        if (finlVolume > 1) {
            this.setData({
                finlVolume: --finlVolume
            })
        }
    },
    toggleSelector: function (event) {
        this.setData({ showSelector: !this.data.showSelector });
    },
    setStore: function (event) {
        let prodId = event.currentTarget.dataset.prodId;
        let { storeflag } = this.data;
        if (storeflag === 1) {
            productChannel.deleteProductStore(prodId).then(data => {
                this.setData({
                    storeflag: 0
                })
            })
        } else {
            productChannel.addProductStore(prodId).then(data => {
                this.setData({
                    storeflag: 1
                })
            })
        }
    },
    onLoad: function (options) {
        let prod_id = options.prod_id;
        productChannel.getProductDetail(prod_id).then(data => {

            this.setData({
                productDetail: data.productData,
                specificateData: data.specificateData,
                storeflag: data.specificateData.store_flag
            });

            this.onTiming(data.specificateData.limittime_seconds);
            this.onOption();
        });

        productChannel.getProductCommentList(prod_id, 1, 1).then(data => {
            this.setData({ productCommentList: data });
        });
    },
    onTiming: function (limitSeconds) {
        if (limitSeconds > 0) {
            limitSeconds--;
            let time = util.timing(limitSeconds);
            this.setData({ limittime: time.day + ':' + time.hour + ':' + time.minute + ':' + time.second });
            this.timeout = setTimeout(() => this.onTiming(limitSeconds), 1000);
        }
        else {
            this.setData({ limittime: null });
        }
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearTimeout(this.timeout);
    }
})