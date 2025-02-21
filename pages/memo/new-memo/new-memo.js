Page({
  data: {
    title: "",
    content: "",
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

  // 保存备忘录
  saveMemo: function() {
    const { title, content } = this.data;
    if (!title || !content) {
      wx.showToast({
        title: '标题和内容不能为空',
        icon: 'none',
      });
      return;
    }

    const timestamp = Date.now();
    const memo = {
      id: timestamp,
      title,
      content,
      timestamp,
    };

    // 保存备忘录到全局数据
    const app = getApp();
    console.log("app.globalData.memoList", app.globalData.memoList)
    let memoList = wx.getStorageSync('memoList') || [];
    console.log(memoList)
    memoList.push(memo);
    wx.setStorageSync('memoList', memoList);
    app.globalData.memoList = memoList;
    console.log(app.globalData.memoList)

    wx.showToast({
      title: '备忘录已保存',
      icon: 'success',
    });

    // 返回上一页并自动更新数据
    wx.navigateBack();
  }
});
