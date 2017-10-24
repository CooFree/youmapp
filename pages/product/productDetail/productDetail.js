// pages/product/productDetail/productDetail.js
import ProductChannel from '../../../channels/product';
import util from '../../../utils/util';
const productChannel = new ProductChannel();

Page({
    data: {
        swiperConfig: {
            indicatorDots: true,
            indicatorColor: '#fff',
            indicatorActiveColor: '#d2ab44',
            autoplay: true,
            interval: 5000,
            duration: 500,
            circular: true
        },
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
        limittime: 0,
        finlVolume: 1,
        storeflag: 0,
    },
    selectOption: function (event, arrayData, selectIndex, seType) {
        let isDis = event.currentTarget.dataset.dis;
        if (isDis === false) {
            let keys = event.currentTarget.dataset.keys[0];
            let index = event.currentTarget.dataset.index;
            let specList = this.data.specificateData.spec_list;
            let colorImageList = this.data.productDetail.color_image_list;
            let tempArr1 = [];
            let tempArr2 = util.deepCopy(arrayData);
            let tempData = arrayData;

            specList.forEach(function (value, index) {
                if (seType === 'color') {
                    if (value.color === keys) {
                        tempArr1.push(value.size);
                    }
                } else {
                    if (value.size === keys) {
                        tempArr1.push(value.color);
                    }
                }
            })

            //设置颜色图片
            colorImageList.forEach(function (value, index) {
                if (value.color === keys) {
                    this.setData({
                        finlImg: value.image_url,
                    });
                }
            }.bind(this));

            for (let i = 0; i < tempArr2.length; i++) {
                let isExist = false;
                for (let j = 0; j < tempArr1.length; j++) {
                    if (tempArr2[i][0] === tempArr1[j]) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    tempArr2[i][1] = 0;
                }
            }

            if (seType === 'color') {
                if (index === this.data.selectColorIndex) {
                    index = -1;
                    this.setData({
                        selectColor: tempData,
                        selectColorIndex: index,
                        finlImg: '',
                        finlColor: ''
                    })
                } else {
                    this.setData({
                        selectColor: tempArr2,
                        selectColorIndex: index,
                        finlColor: keys,
                        finlVolume: 1
                    })
                }
            } else {
                if (index === this.data.selectSizeIndex) {
                    index = -1;
                    this.setData({
                        selectSize: tempData,
                        selectSizeIndex: index,
                        finlSize: ''
                    })
                } else {
                    this.setData({
                        selectSize: tempArr2,
                        selectSizeIndex: index,
                        finlSize: keys,
                        finlVolume: 1
                    })
                }
            }

            let finlColor = this.data.finlColor;
            let finlSize = this.data.finlSize;
            if (this.data.finlColor && this.data.finlSize) {
                let temp = [];
                specList.forEach(function (value, index) {
                    if (value.color === finlColor) {
                        temp.push(value);
                    }
                });
                temp.forEach(function (value, index) {
                    if (value.size === finlSize) {
                        this.setData({
                            specItem: value
                        })
                    }
                }.bind(this));
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
        this.setData({
            showSelector: !this.data.showSelector
        })
    },
    setStore: function (event) {
        let prodId = event.currentTarget.dataset.prodId;
        let {storeflag} = this.data;
        if (storeflag === 1) {
            productChannel.deleteProductStore(prodId).then(data => {
                console.log('0'+ data)
                this.setData({
                    storeflag: 0
                })
            })
        } else {
            productChannel.addProductStore(prodId).then(data => {
                console.log('1'+ data)
                
                this.setData({
                    storeflag: 1
                })
            })
        }
    },
    onLoad: function (options) {
        let prod_id = options.prod_id;
        productChannel.getProductDetail(prod_id).then(data => {
            let specList = data.specificateData.spec_list;
            let limitSeconds = data.specificateData.limittime_seconds;
            let tempArrayColor = [];
            let tempArraySize = [];
            let tempArr1 = [];
            let tempArr2 = [];
            specList.forEach(function (value, index) {
                tempArrayColor.push(value.color);
                tempArraySize.push(value.size);
            });

            tempArrayColor = util.arrayUnique(tempArrayColor).forEach(function (value, index) {
                tempArr1.push([value, 1]);
            })
            tempArraySize = util.arrayUnique(tempArraySize).forEach(function (value, index) {
                tempArr2.push([value, 1]);
            })

            let timeInterval = null;
            if (limitSeconds > 0) {
                timeInterval = setInterval(() => {
                    limitSeconds = --limitSeconds;
                    let time = util.timing(limitSeconds);
                    this.setData({
                        limittime: time.day + ':' + time.hour + ':' + time.minute + ':' + time.second
                    })
                }, 1000)
            } else {
                clearInterval(timeInterval);
            }

            this.setData({
                productDetail: data.productData,
                specificateData: data.specificateData,
                arrayColor: tempArr1,
                arraySize: tempArr2,
                storeflag: data.specificateData.store_flag
            })
        })

        productChannel.getProductCommentList(prod_id, 1, 1).then(data => {
            this.setData({
                productCommentList: data,
            })
        })
    }
})