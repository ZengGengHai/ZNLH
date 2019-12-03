// pages/my_equipment/myequipment/myequipment.js
var config = require('../../../config/config')
var util = require('../../../utils/util.js')
// var BaaS = require('../../utils/sdk-v1.4.0')
const app = getApp()
import equipmentUtils from '../../../utils/equipment';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentList:[],
    showbox:false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // userEquipmentList
    var that=this
    that.userEquipmentList();
  },
  userEquipmentList:function(){
    this.setData({
      loadModal: true
    })
    var user_id = app.getUserId();
    equipmentUtils.userEquipmentList(user_id, (res) => {
      setTimeout(() => {
        this.setData({
          loadModal: false
        })
      }, 500)
      console.log(res)
      if(res.data.objects.length===0){              //用户还没有添加设备
        this.setData({
          showbox:true,
          equipmentList:[]

        })
        return
      }
      var arr = []
      for (var key in res.data.objects) {
        console.log(key); //json对象的key  
        console.log(res.data.objects[key]); //json对象的值 
        arr.push(parseInt(res.data.objects[key].equipmentId))
      }
      console.log(arr)
      this.getList(arr);
    })
  },

  getList(arr) {   //onenet平台获取数据  
    var that = this
    app.agriknow.getEquipment(arr)
      .then(res => {
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 1000)
        console.log(res.data.devices)
        var equipmentList = res.data.devices
        that.setData({
          equipmentList,
        })

      })
      .catch(res => {
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 1000)
      })
  },

  showModal(e) {     //点击设备
  
    wx.navigateTo({
      url: '../../search_equipment/equipment_details/equipment_details?equipmentId=' + e.currentTarget.dataset.id,
    })
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