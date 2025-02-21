Page({
  data: {
    text: '',    // 文字内容
    images: [],  // 图片列表
    video: '',   // 视频路径
    likes: 0,    // 点赞数
    isLiked: false,  // 点赞状态
  },

  // 输入文字内容
  onTextInput: function(event) {
    this.setData({
      text: event.detail.value
    });
  },

  // 选择图片
  chooseImage: function() {
    wx.chooseImage({
      count: 9, // 最多选择9张图片
      success: (res) => {
        this.setData({
          images: res.tempFilePaths
        });
      }
    });
  },

  // 选择视频
  chooseVideo: function() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: (res) => {
        this.setData({
          video: res.tempFilePath
        });
      }
    });
  },

  // 发布内容
  publishPost: function() {
    const { text, images, video } = this.data;
    
    if (!text && images.length === 0 && !video) {
      wx.showToast({
        title: '请填写内容或选择文件',
        icon: 'none'
      });
      return;
    }

    // 这里可以将内容保存到本地存储或者通过接口上传到服务器
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });
  },

  // 点赞功能
  likePost: function() {
    let { likes, isLiked } = this.data;
    if (isLiked) {
      likes--;
    } else {
      likes++;
    }

    this.setData({
      likes,
      isLiked: !isLiked
    });
  },

  // 分享功能
  sharePost: function() {
    wx.showShareMenu({
      withShareTicket: true,
    });
  },

  // 收藏功能
  savePost: function() {
    wx.showToast({
      title: '已收藏',
      icon: 'success'
    });
  }
});
