import ProductChannel from '../../../channels/product';

const productChannel = new ProductChannel();
const pageSize = 10;
Page({
  page: 1,
  data: {
    productClassId: 0,
    productClassParentId: 0,
    categoryInfo: {},
    categoryData: [],
    productList: [],
    loadEnd: false,
  },
  onLoad: function (options) {

    const productClassId = parseInt(options.prod_classid) || 0;
    const productClassParentId = parseInt(options.prod_class_parentid) || 0;

    if (productClassId > 0 && productClassParentId > 0) {
      this.setData({ productClassId, productClassParentId });

      productChannel.getCategoryData().then(categoryData => {
        let subCategoryData = [];
        categoryData.some((item, index) => {
          if (item.id === productClassParentId) {
            subCategoryData = item.sub_class_list;
            return true;
          }
        });
        this.setData({ categoryData: subCategoryData });
      });

      productChannel.getProductClassInfo(productClassId).then(data => {
        if (data) {
          this.setData({ categoryInfo: data });
        }
      });

      this.loadData();
    }
  },
  loadData: function (more) {
    const { productClassId, loadEnd, productList } = this.data;
    if (more) {
      if (loadEnd === false) {
        wx.showLoading();

        this.page++;
        productChannel.getProductList(productClassId, 0, '', this.page, pageSize).then(data => {
          this.setData({
            productList: productList.concat(data),
            loadEnd: data.length === 0
          });

          wx.hideLoading();
        });
      }
    }
    else {
      wx.showLoading();

      this.page = 1;
      productChannel.getProductList(productClassId, 0, '', this.page, pageSize).then(data => {
        this.setData({
          productList: data,
          loadEnd: data.length === 0
        });

        wx.hideLoading();
      });
    }
  },
  onChangeTab: function (event) {
    const { cateid } = event.currentTarget.dataset;
    this.setData({ productClassId: cateid });
    this.loadData();
  },
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadData(true);
  },
  onShareAppMessage: function () {

  }
})