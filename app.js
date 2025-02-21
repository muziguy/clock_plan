//app.js
const defaultTime = {
  defaultWorkTime: 30,
  defaultRestTime: 5
}

App({
  globalData: {
    memoList: []
  },
  onLaunch: function() {
    let workTime = wx.getStorageSync('workTime')
    let restTime = wx.getStorageSync('restTime')
    
    if (!workTime) {
      wx.setStorage({
        key: 'workTime',
        data: defaultTime.defaultWorkTime
      })
    }
    if (!restTime) {
      wx.setStorage({
        key: 'restTime',
        data: defaultTime.defaultRestTime
      })
    }
    // 初始化全局数据（例如从本地存储中读取）
    const memoList = wx.getStorageSync('memoList') || [];
    this.globalData.memoList = memoList;
    console.log(this.globalData.memoList)
  },

  // viblong: function(){

  //   var vibison = wx.getStorageSync('vibison')
  //   console.log(vibison)
  // }
})
