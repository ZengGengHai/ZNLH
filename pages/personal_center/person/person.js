//index.js

var config = require('../../../config/config')
var util = require('../../../utils/util.js')
// var BaaS = require('../../utils/sdk-v1.4.0')
const app = getApp()

Page({
  data: {
    open: '',   //页面进入的方式

    userInfo: { avatarUrl:'../../../images/icon/user.png'},
    logged: false,
    takeSession: false,
    requestResult: '',
    first_time: true,
    box: true,
    aiministrator:false,
    latitude: "",
    longitude:"",
    name_open:false,
    validation_open:false

    
  },

  // 用户登录示例



  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {

  },
  publish: function () {  //跳转发布页面
    // wx.navigateTo({
    //   url: '../publish/publish',
    // })
  },
  shoucang: function () {
    // wx.navigateTo({
    //   url: '../shoucang/shoucang',
    // })
  },
  my_focus: function () {
    // wx.navigateTo({
    //   url: '../img_fllow/img_fllow?is_share=' + 'false',
    // })
  },
  leave_word:function(){
    wx.showToast({
      title: '图片留言管理努力开发中',
      icon: 'none',
      duration: 2000
    })

  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   

  var that=this
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {  //如果有授权
 
    //     } else {

    //       that.setData({
    //         box: true,
    //       })
    //     }

    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })


    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {  //如果有授权

        } else {
          wx.removeStorage({
            key: 'userInfo',
            success: function (res) {
              console.log(res.data)
              console.log('meiyou hsouquan')
            }
          })
          that.setData({
            box: true,
          })

        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })



  },


 
  onLoad: function (e) {
    var that=this
    console.log(e)
    var open=e.open||""
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {  //如果有授权
  
        } else {
          wx.removeStorage({
            key: 'userInfo',
            success: function (res) {
              console.log(res.data)
        
            }
          })
          that.setData({
            box: true,
          })

        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })


    if(open!=''){
      try {
        var Student_ID = wx.getStorageSync('Student_ID')
        var identity = wx.getStorageSync('identity')
        var userInfo = wx.getStorageSync('userInfo')
        console.log(userInfo ,'ghjgjhg')
        if (!userInfo) {
          that.setData({
            name_open:true
          })
          console.log('meiyou hsouquan')
        } 
        if (identity !='解除绑定'){
          that.setData({
            nvalidation_open:true
          })
        }
      } catch (e) {

      }
      that.setData({
        open,
      })
    }else{

    }
    var that = this

 


    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data,
          logged: true,
          box: false
        })
      }
    })
   








  },

  usingDocument:function(){
   wx.navigateTo({
     url: '../usingDocuments/usingDocuments',
   })
  },




  userInfoHandler(data) {
    var that = this
    wx.BaaS.auth.loginWithWechat(data).then(res => {
      console.log(res)  //用户授权成功
      that.setData({
        userInfo: res,
        logged: true,
        box: false,
        name_open:false,
      })
      wx.setStorage({//存储到本地
        key: "userInfo",
        data: res
      })
  
    }, res => {
      // that.setData({
      //    box: true,
      //   userInfo: {}
      // })
    })

  },

  onShareAppMessage: function () {
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '韶院校园小程序',
      path: '/pages/index/index',
      imageUrl: "../../images/oo.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  
  },


  //正方系统身份验证
  system_validation:function(){
    // var text ='点击图片放大，长按识别二维码赞赏，你的赞赏，用于小程序的服务维护费用，让地图服务能一直持续下去'

    // wx.navigateTo({
    //   url: '../author/author?image=' +'https://cloud-minapp-13676.cloud.ifanrusercontent.com/1fRd6HFZPmCpdRdw.jpg'+'&text='+text,
    // })
    this.setData({
      nvalidation_open: false
    })

    
    var open = this.data.open
 
    // if (open != '') {
    //   wx.navigateTo({
    //     url: '../system_validation/system_validation?open=' + open,
    //   })
    // }else{
    //   wx.navigateTo({
    //     url: '../system_validation/system_validation?open=' + 'no',
    //   })
    // }

  },
  buyEquipment:function(){
        wx.showToast({
          title: '此功能正在开发中',
          icon: 'none'
        })
  },


 //管理后台
  Management_Backstage:function(){
    // wx.navigateTo({
    //   url: '../Management_Backstage/Management_Backstage',
    // }) 
  },
  my_release:function(){
    // wx.navigateTo({
    //   url:'../my_release/my_release',
    // })
  },

  
  About:function(){
    // wx.navigateTo({
    //   url: '../about/about',
    // }) 
  }




})
