//index.js
//获取应用实例
const app = getApp()
import config from '../../config/config'
Page({
  data: {
    list: [{
      title: '查找设备',
      img: 'https://cloud-minapp-21236.cloud.ifanrusercontent.com/1htT9bGC8PNjYze8.jpg',
      url: '/search_equipment/search/search'
    },
    {
      title: '我的设备',
      img: 'https://cloud-minapp-21236.cloud.ifanrusercontent.com/1htT9b4yfyTV2W99.jpg',
      url: '/my_equipment/myequipment/myequipment'
    },
    {
      title: '个人中心',
      img: 'https://cloud-minapp-21236.cloud.ifanrusercontent.com/1htT9bijeyN6MSqt.jpg',
      url: '/personal_center/person/person'
    }
    // ,
    // {
    //   title: '购买设备',
    //   img: 'https://cloud-minapp-21236.cloud.ifanrusercontent.com/1hMBuhVHn5DCRjmr.jpg',
    //   url: '/personal_center/person'
    // }
    ]
  
  },
  //事件处理函数

  onLoad: function () {
  
  },
  aa:function(){
    // let tableID = config.IMAGE_ID.MERCHANTS
  
    // let recordID = '5c1def0c44af4e727313a7c5'

    // let Product = new wx.BaaS.TableObject(tableID)

    // Product.get(recordID).then(res => {
    //   // success
    //   console.log(res)
    // }, err => {
    //   // err
    // })
     wx.request({
      //  url:'http://api.heclouds.com/devices/515394264/datastreams/GPS',
       url: "http://api.heclouds.com/devices/515394264/datastreams",
      //  data: {
      //    "cmd_uuid": "{blueled}1"

      //  },

      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
      }, // 设置请求的 header
      success: function (data) {
        console.log(data)

      },
      fail: function (err) {
        console.log(err)
        //wx.request({
        // url: '',
        //})
      }
    })



  },
  toChild(e) {
      console.log(e)
      wx.navigateTo({
        url: '/pages' + e.currentTarget.dataset.url
      })
    
  },
  onShareAppMessage() {
    return {
      title: '智能绿化研发',
      imageUrl: '/images/134aa9cd7c6b.png',
      path: '/pages/index/index'
    }
  }
  
})
