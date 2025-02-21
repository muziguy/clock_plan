Page({
  data: {
    id: "",
    title: "",
    content: "",
  },

  onLoad: function(options) {
    const { id } = options;
    const memoList = wx.getStorageSync('memoList') || [];
    const memo = memoList.find(item => item.id == id);
    if (memo) {
      this.setData({
        id: memo.id,
        title: memo.title,
        content: memo.content,
      });
    }
  },

  // 输入标题
  onTitleInput: function(e) {
    this.setData({
      title: e.detail.value
    });
  },

  // 输入内容
  onContentInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 保存编辑后的备忘录
  saveMemo: function() {
    // 保存备忘录到全局数据
    const app = getApp();
    const { id, title, content } = this.data;
    const memoList = wx.getStorageSync('memoList') || [];
    const index = memoList.findIndex(item => item.id === id);
    if (index !== -1) {
      memoList[index] = {
        id,
        title,
        content,
        timestamp: Date.now(),
      };
      wx.setStorageSync('memoList', memoList);
      app.globalData.memoList = memoList;
      wx.showToast({
        title: '备忘录已保存',
        icon: 'success',
      });
      wx.navigateBack();
    }
  }
});
