Component({
  properties: {
    avatar: {
      type: String,
      value: ''
    },
    username: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    images: {
      type: Array,
      value: []
    },
    videoUrl: {
      type: String,
      value: ''
    },
    time: {
      type: String,
      value: ''
    }
  },

  data: {
    isLiked: false,
    isCollected: false
  },

  methods: {
    // 切换点赞状态
    toggleLike() {
      this.setData({
        isLiked: !this.data.isLiked
      });
    },

    // 切换收藏状态
    toggleCollect() {
      this.setData({
        isCollected: !this.data.isCollected
      });
    },

    // 触发分享功能
    sharePost() {
      wx.showShareMenu({
        withShareTicket: true,
        success() {
          wx.showToast({
            title: '分享成功',
            icon: 'success'
          });
        },
        fail() {
          wx.showToast({
            title: '分享失败',
            icon: 'error'
          });
        }
      });
    }
  }
});
