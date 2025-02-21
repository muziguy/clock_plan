let interstitialAd = null
import lottie from 'lottie-miniprogram'

Page({
  data: {
    animationStarted: false,  // 控制动画是否开始的状态
  },
  
  onLoad() {
    setTimeout(() => {
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }, 1000);
  },

  onShow() {
    // 页面切换完成后再执行
    this.setData({ animationStarted: true });
    setTimeout(() => {
      if (this.data.animationStarted) {
        this.loadAnimation()
      }
    }, 1000);
  },

  loadAnimation: function() {
    wx.createSelectorQuery().selectAll('#c1').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 300
      canvas.height = 300

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../../json/catrim.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
      return {
        title: '管理时间，保持专注，让自律成为习惯！',
        path: '/pages/index/index',
        imageUrl: '/image/about.png', // 不设置则默认为当前页面的截图
      }
    }
  },

  onShareTimeline: function (res) {
    return {
      title: '管理时间，保持专注，让自律成为习惯！',
      query: {
        // key: 'value' //要携带的参数
      },
      imageUrl: '/image/about.png',
    }
  },
})
