// pages/sign/index.js
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperItems:[],
    index:0,

  },
  download:function(e){
    console.log(e.currentTarget.dataset.url);
    var url = e.currentTarget.dataset.url
    wx.showLoading({
      title: '下载中',
      mask:true
    })
    wx.downloadFile({
      url: url,
      success:(res)=>{
        var filePath = res.tempFilePath;
            console.log(filePath);
            wx.hideLoading()
            wx.showToast({
              title: '下载完成',
            })
            wx.openDocument({
                filePath: filePath,
                success: function(res) {
                    console.log('打开文档成功')
                },
                fail: function(res) {
                    console.log(res);
                },
                complete: function(res) {
                    console.log(res);
                }
            })

      },
      fail:(res)=>{
        console.log(res);
        wx.hideLoading()
        wx.showToast({
          title: '下载失败，请检查网络或重试',
          icon:'none'
        })
      }
    })
  },
  ask:function(){
    wx.showModal({
      title: '可以联系老师微信',
      content: "xxxxxxxx",
    }) 
  },

  onSwipe:function(e){
    this.setData({
      index:e.detail.current
    })
  },
  sign:function(){
    let that = this
    console.log(app.globalData.infoUseful);
    if(app.globalData.infoUseful.compeleted){
      wx.showModal({
        title: '请确认您的个人信息',
        content: app.globalData.infoUseful.name+","+ app.globalData.infoUseful.phone+","+ app.globalData.infoUseful.className,
        confirmText:'提交申请',
        cancelText:'再想想',
        success (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中...',
              mask:true
            })
            console.log('用户点击确定')

            let _data = {
              name:app.globalData.infoUseful.name,
              program_id:that.data.swiperItems[that.data.index].id,
              tel:app.globalData.infoUseful.phone,
              openid:app.globalData.infoUseful.openid
            }
            that.data.requeest('https://www.cuitrwx.cn/api/database/overseas',null,_data,'POST')
            wx.hideLoading({
              complete: (res) => {},
            })
            wx.showToast({
              title: '提交成功',
              icon:"none"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })  
    }else{
      wx.redirectTo({
        url: '/pages/me/index',
      })
      wx.showToast({
        title: '请先完善你的个人信息',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const requeest = util.requeest.bind(this)
    this.setData({requeest})
    requeest('https://www.cuitrwx.cn/api/display/programs',"swiperItems");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})