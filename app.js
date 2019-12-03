//app.js
import config from '/config/config'
import agriknow from './apis/agriknow.js'

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        console.log(e)
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log(custom)
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    wx.BaaS = requirePlugin('sdkPlugin')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo, wx.requestPayment) //让插件帮助完成登录、支付等功能   
    wx.BaaS.init(config.BAAS_CLIENT_ID, { autoLogin: true })



    const userId = this.getUserId()
    if (!userId) {
      wx.BaaS.auth.loginWithWechat()
        .then(res => {
          console.log('BaaS is logined...')
         
        }).catch(err => {
          console.log(err)
        })
    }

    //   wx.request({
    //   url: "http://api.heclouds.com/cmds?device_id=515394264",
    //   data:{
    //     "cmd_uuid": "{blueled}0"

    //   },

    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: { 
    //     'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
    //   }, // 设置请求的 header
    //   success: function (data) {
    //     console.log(data)

    //   },
    //   fail: function (err) {
    //     console.log(err)
    //     //wx.request({
    //     // url: '',
    //     //})
    //   }
    // })

    //   wx.request({
    //   // url: "http://api.heclouds.com/devices/515394264/datastreams/c4b94f65-5fd5-5430-b3f2-d52993efd487",
     
    //     url:"http://api.heclouds.com/devices/515394264/datastreams/GPS",

    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   header: { 
    //     'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
    //   }, // 设置请求的 header
    //   success: function (data) {
    //     console.log(data.data.data,"最新数据流展示")

    //   },
    //   fail: function (err) {
    //     console.log(err)
    //     //wx.request({
    //     // url: '',
    //     //})
    //   }
    // })



    // wx.request({             //上传数据流
    //   // url: "http://api.heclouds.com/devices/515394264/datastreams/c4b94f65-5fd5-5430-b3f2-d52993efd487",

    //   url: "http://api.heclouds.com/devices/515394264/datapoints",

    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   data:{
    //     datastreams: [{ "id": "location", "datapoints":
    //      [{ "value": { "lon": 106, "lat": 29 } }]
    //       }]
    //   },
    //   header: {
    //     'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
    //   }, // 设置请求的 header
    //   success: function (data) {
    //     console.log(data, "上传数据流")

    //   },
    //   fail: function (err) {
    //     console.log(err)
    //     //wx.request({
    //     // url: '',
    //     //})
    //   }
    // })





    



   




  },
  globalData: {
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  },
  
  getUserId() {                   //获取用户id
    if (this.userId) {
      return this.userId
      // console.log(this.userId)
    }
    const userId = wx.BaaS.storage.get('uid')
    this.userId = userId
    console.log(this.userId)
    return userId
  },
  globalData: {
    userInfo: null
  },
  agriknow: new agriknow()


})