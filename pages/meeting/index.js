// pages/meet/index.js
var util = require('../../utils/util.js')//index.js
const app = getApp()

Page({
  data: {
    index:0,
    meters: ['上交材料', '咨询', '其他'],
    date: '',
    comment:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mettings:[],
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindCommentChange: function (e) {
    this.setData({
      comment: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  meetting:function(){
    console.log(app.globalData.infoUseful);
    let that = this
    if(app.globalData.infoUseful.compeleted==true){
      wx.showModal({
        title: '确认您的用户信息',
        content: app.globalData.infoUseful.name+","+ app.globalData.infoUseful.phone+","+ app.globalData.infoUseful.className,
        confirmText:'提交预约',
        cancelText:'返回修改',
        success (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '提交中...',
              mask:true
            })
            let d = new Date(that.data.date)

            let t = d.getTime(d) // 方法1
            console.log(t);
            
            var data = {
              openid:app.globalData.infoUseful.openid,
              matter:that.data.meters[that.data.index],
              comment:that.data.comment,
              requestDate:t +1,
            }
            that.data.requeest('https://www.cuitrwx.cn/api/login/appointment',null,data,'POST')
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
  onLoad: function () {
    
    const requeest = util.requeest.bind(this)
    this.setData({requeest})
        
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + "-" + month + "-" + strDate;
    this.setData({
      date:currentdate
    })

    requeest('https://www.cuitrwx.cn/api/login/myappointments',"mettings",{openid:app.globalData.infoUseful.openid},'GET');

  }
})
