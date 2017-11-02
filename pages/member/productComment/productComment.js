import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';
import config from '../../../config';
import memberState from '../../../utils/memberState';

const memberChannel = new MemberChannel();
Page({
  data: {
    orderId: 0,
    previewCommentpic: '',
    commentList: [],
  },
  onLoad: function (options) {
    const orderId = parseInt(options.order_id) || 0;
    this.setData({ orderId });
    this.loadData();
  },
  loadData: function () {
    const { orderId } = this.data;

    wx.showLoading();
    memberChannel.getCommentData(orderId).then(data => {
      if (data) {
        this.setData({ commentList: data });
      }
      wx.hideLoading();
    });
  },
  onInputContent: function (event) {
    const { index } = event.currentTarget.dataset;
    const { value } = event.detail;
    const { commentList } = this.data;
    commentList[index].content = encodeURIComponent(value);
    this.setData({ commentList });
  },
  onSubmit: function (event) {

    const { index } = event.currentTarget.dataset;
    const { orderId, commentList } = this.data;

    const item = commentList[index];
    let content = util.decodeURI(item.content);

    if (content.length > 0) {
      let imageUrlArray = [], imageWidthArray = [], imageHeightArray = [];
      item.image_list.forEach((item, index) => {
        imageUrlArray.push(item.image_url);
        imageWidthArray.push(item.image_width);
        imageHeightArray.push(item.image_height);
      });

      memberChannel.saveComment(item.orderitem_id, content, imageUrlArray, imageWidthArray, imageHeightArray).then(result => {
        if (result) {
          this.loadData();
        }
        else {
          wx.showToast({ title: '提交失败', image: '../../../images/errorx.png' });
        }
      });
    }
    else {
      wx.showToast({ title: '评价内容不为空', image: '../../../images/alertx.png' });
    }
  },
  addImage: function (index, image_url, image_width, image_height) {
    const { commentList } = this.data;
    const item = commentList[index];
    item.image_list.push({ image_url, image_width, image_height });
    this.setData({ commentList });
  },
  onFileUpload: function (event) {
    const { index } = event.currentTarget.dataset;
    const memberId = memberState.getLoginId();
    wx.chooseImage({
      count: 1,
      success: (res) => {
        res.tempFilePaths.forEach((file, index) => {
          if (memberId) {
            wx.showLoading();
            const url = config.Host + '/member/productComment.aspx?post=upload_image&member_id=' + memberId;
            wx.uploadFile({
              url,
              filePath: file,
              name: 'file',
              success: (res) => {
                const data = JSON.parse(res.data);
                this.addImage(index, data.image_url, data.image_width, data.image_height);

                wx.hideLoading();
              },
              fail: (msg) => {
                console.error(msg);
              }
            });
          }
        });
      }
    });
  },
  showPreview: function (event) {
    const { image } = event.currentTarget.dataset;
    this.setData({ previewCommentpic: image });
  },
  hidePreview: function () {
    this.setData({ previewCommentpic: '' });
  },
})