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
        specificateData: [],
        arrayColor: [],
        arraySize: [],
        selectColor: [],
        selectSize: [],
        selectImg: '',
        finlColor:'',
        finlSize:'',
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
            colorImageList.forEach(function (value, index) {
                if (value.color === keys) {
                    this.setData({
                        selectImg: value.image_url,
                    })
                }
            }.bind(this))

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
                        selectImg: '',
                        finlColor: ''
                    })
                } else {
                    this.setData({
                        selectColor: tempArr2,
                        selectColorIndex: index,
                        finlColor: keys
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
                        finlSize: keys
                    })
                }
            }
        }
    },
    selectColor: function (event) {
        this.selectOption(event, this.data.arraySize, this.data.selectColorIndex, 'color');
    },
    selectSize: function (event) {
        this.selectOption(event, this.data.arrayColor, this.data.selectSizeIndex, 'size');
    },
    onLoad: function (options) {
        console.log(options)
        let prod_id = options.prod_id;
        productChannel.getProductInfo(prod_id).then(data => {
            this.setData({
                productInfo: data
            })
        })

        productChannel.getProductDetail(prod_id).then(data => {
            let specList = data.specificateData.spec_list;
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

            this.setData({
                productDetail: data.productData,
                specificateData: data.specificateData,
                arrayColor: tempArr1,
                arraySize: tempArr2
            })
        })

        productChannel.getProductCommentList(prod_id, 1, 1).then(data => {
            this.setData({
                productCommentList: data,
            })
        })
    }
})