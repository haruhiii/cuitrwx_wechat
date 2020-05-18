//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    remoteUserInfo:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    infoUseful:null,
  },
  //事件处理函数
  
  onLoad: function () {
    const requeest = util.requeest.bind(this)
    this.setData({requeest})
    this.setData({
      infoUseful: app.globalData.infoUseful,
    })
    if(app.globalData.remoteUserInfo){
      this.setData({
        remoteUserInfo: app.globalData.remoteUserInfo,
      })
    }
    if(app.globalData.remoteUserInfo.avatarUrl!=null){
      this.setData({
        hasUserInfo: true
      })
    }
    if (app.globalData.userInfo ) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res,remote) => {
        if(res){
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          app.globalData.hasUserInfo = true
        }else if(remote){
          this.setData({
            remoteUserInfo: remote.data.data,
            hasUserInfo: true
          })
        }
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if(this.data.userInfo.avatarUrl==null){
      this.setData({
        userInfo:this.data.remoteUserInfo
      })
    }
  },
  getUserInfo: function(e) {
    console.log('-----------');
    console.log(e);
    console.log('-----------');
    if(e.detail.userInfo){
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      app.globalData.remoteUserInfo =  e.detail.userInfo
      var data = {
        nickName:this.data.userInfo.nickName,
        gender:this.data.userInfo.gender,
        language:this.data.userInfo.language,
        city:this.data.userInfo.city,
        province:this.data.userInfo.province,
        country:this.data.userInfo.country,
        avatarUrl:this.data.userInfo.avatarUrl,
        openid:this.data.remoteUserInfo.openid
      }
      this.data.requeest('https://www.cuitrwx.cn/api/login/update',null,data,'PUT')
    }
  },
  go:function(e){
    wx.showLoading({
      title: '更新中...',
    })
    var data = {
      name:e.detail.value.name,
      studentid:e.detail.value.studentid,
      academy:e.detail.value.academy,
      className:e.detail.value.className,
      phone:e.detail.value.phone,
      openid:this.data.remoteUserInfo.openid
    }
    this.data.requeest('https://www.cuitrwx.cn/api/login/student',null,data,'PUT')
    if(data.phone!=null && data.phone!=''){
      data.compeleted=true
    }
    app.globalData.infoUseful = data
    this.setData({
      infoUseful:data
    })
    wx.hideLoading({
    })
    wx.showToast({
      title: '更新成功',
      icon:'none'
    })
  }
})
