import MemberChannel from '../../../channels/member';
import util from '../../../utils/util';

const memberChannel = new MemberChannel();
Page({
  data: {
    orderId: 0,
    previewCommentpic: '',
    commentList: [],
  },
  onLoad: function (options) {
    this.loadData();
  },
  loadData: function () {
    wx.showLoading();
    memberChannel.getCommentData(orderId).then(data => {
      if (data) {
        this.setData({ commentList: data });
      }
      wx.hideLoading();
    });
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

    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        tempFilePaths.forEach((file, index) => {
          wx.showLoading();
          const url = '/member/productComment.aspx?post=upload_image';
          wx.uploadFile({
            url,
            filePath: file.path,
            name: 'file',
            success: (res) => {
              const data = JSON.parse(res.data);
              this.addImage(index, data.image_url, data.image_width, data.image_height)
              wx.hideLoading();
            },
            fail: (msg) => {
              console.error(msg);
            }
          });
        });
        util.uploadFile('/member/productComment.aspx?post=upload_image', file, true).then((data) => {
          wx.hideLoading();
          if (data) {
            if (data.result === 1) {
              actions.addProductCommentImage(rowIndex, data.image_url, data.image_width, data.image_height);
            }
            else {
              this.props.showTip(data.msg);
            }
          }
          this.setState({ uploading: false });
        })
      }
    });
    wx.showLoading();
    /*util.uploadFile('/member/productComment.aspx?post=upload_image', file, true).then((data) => {
       wx.hideLoading();
      if (data) {
        if (data.result === 1) {
          actions.addProductCommentImage(rowIndex, data.image_url, data.image_width, data.image_height);
        }
        else {
          this.props.showTip(data.msg);
        }
      }
      this.setState({ uploading: false });
    });*/
  }
})