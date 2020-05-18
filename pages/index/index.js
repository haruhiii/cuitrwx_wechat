//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    url:"https://www.cuitrwx.cn/api",
    notice:{
      shown:false
    },
    swiperItems:[{},{}],
    posts:{},
    start:0,
    total:5,
    hasMorePost:true,
    toolkitItems:[
      { 
          text:"留学申请",
          discription:"办理进度查询",
          src:"/img/sign.svg",
          href:"/pages/sign/index"
      },
      { 
        text:"会面预约",
        discription:"线下会面安排",
        src:"/img/meeting.svg",
        href:"/pages/meeting/index"
      },
      { 
        text:"常见问题",
        discription:"大家都在问什么呢",
        src:"/img/question.svg",
        href:"/pages/question/index"
      },
      { 
        text:"个人中心",
        discription:"个人信息管理",
        src:"/img/me.svg",
        href:"/pages/me/index"
      },
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    remoteUserInfo: null
  },
  ontapSwiper:function(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/article/index?id='+e.currentTarget.dataset.id,
    })
    
    
  },
  //工具栏跳转
  taptool(even) {
    console.log(even.currentTarget.dataset.href);
    wx.navigateTo({
      url: even.currentTarget.dataset.href
    })
  },
  
  //初始化页面动态内容
  init(){
    const requeest = util.requeest.bind(this)
    const addPosts = util.addPosts.bind(this)
    this.setData({requeest})
    this.setData({addPosts})
    requeest(this.data.url+'/display/slides',"swiperItems",{},'GET');
    requeest(this.data.url+'/display/articles',"posts",{"start":this.data.start,"total":this.data.total},'GET');
    this.setData({start: this.data.start+this.data.total})
  },
  onLoad(){
    this.init()
    if (app.globalData.userInfo && app.globalData.remoteUserInfo) {
      console.log(app.globalData.userInfo);
      console.log(app.globalData.remoteUserInfo);
      
      this.setData({
        userInfo: app.globalData.userInfo,
        remoteUserInfo: app.globalData.remoteUserInfo,
        hasUserInfo: true
      })
      if(this.data.userInfo && this.data.remoteUserInfo){
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

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res,remote) => {
        if(res){
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }else if(remote){
          this.setData({
            remoteUserInfo: remote.data.data,
            hasUserInfo: true
          })
        }
        if(this.data.userInfo && this.data.remoteUserInfo){
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
        console.log('-------------------');
        console.log(this.data.userInfo);
        console.log(this.data.remoteUserInfo);
        console.log('-------------------');
      }
    }
  },
  onReachBottom(){
    if(this.data.hasMorePost){
      wx.showToast({
        title: '加载中...',
        icon:'loading',
        duration:500
      })
      this.data.addPosts(this.data.url+'/display/articles',{"start":this.data.start,"total":this.data.total});     
      this.setData({start: this.data.start+this.data.total})
    }

  },
  tapPost(idData){
    console.log(idData.currentTarget.dataset.id);

    wx.navigateTo({
      url: '/pages/article/index?id='+idData.currentTarget.dataset.id,
    })
    
  },
  goToolkit(hrefData){
    wx.navigateTo({
      url:hrefData.currentTarget.dataset.href,
      success:function(){}, //接口调用成功的回调函数
      fail:function(){}, //接口调用失败的回调函数
      complete:function(){} //接口调用结束的回调函数（调用成功、失败都会执行）
    })
    console.log(hrefData.currentTarget.dataset.href);
  }
})
