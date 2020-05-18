
function requeest(url,dataName,data,method){
  wx.request({
    url: url, 
    data: data,
    method,method,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success :(res)=> { 
      console.log(res)
      if(dataName){
        this.setData({[dataName]:res.data.data})
      }
    },fail:(res)=>{
      console.log(res)
    }
  }) 
}
function addPosts(url,data,method){
  wx.request({
    url: url, 
    data:data,
    method,method,
    header: {
      'content-type': 'application/json' // 默认值
    },
    success :(res)=> { 
      this.setData({posts:this.data.posts.concat(res.data.data)})
      if(res.data.errCode==="EMPTY"){
        this.setData({hasMorePost:false})
      }
      console.log(res.data.errCode==="EMPTY");
    },fail:(res)=>{
      console.log(res)
    }
  }) 
}
module.exports = {
  requeest : requeest,
  addPosts : addPosts
}
