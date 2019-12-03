// pages/search_equipment/search.js
const app = getApp();
import equipmentUtils from '../../../utils/equipment';
import utils from '../../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    text:'',
    equipmentList:[],
    pwd:'',
    equipmentId:'',

  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    // this.getList();

    // wx.startPullDownRefresh();


  },
  getList(arr){   //onenet平台获取数据  
    var that=this
     app.agriknow.getEquipment(arr)
      .then(res => {  
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 1000)
        console.log(res.data.devices)
        var equipmentList=res.data.devices
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
  findEquipment(){       //用户每次输入5个字符就查找一下数据库
    var that=this
    var text=this.data.text
    if (text.length % 5 != 0 || text.length===0){
      return
    }


    equipmentUtils.getEquipment(text, (res) => {
      console.log(res)
      var equipmentListId = []
      var Lists = res.data.objects
      if (res.data.objects.length === 0) {
        let timeoutId = utils.showLoadingToast('查找不到此设备')
        setTimeout(() => {
          this.setData({
            loadModal: false,
            equipmentList:[]
          })
        }, 1000)
        return
      }
      for (let i = 0; i < res.data.objects.length; i++) {
        equipmentListId.push({
          id: Lists[i].equipment_id
        })
      }
      var arr = []
      for (var key in equipmentListId) {
        console.log(key); //json对象的key  
        console.log(equipmentListId[key]); //json对象的值 
        arr.push(parseInt(equipmentListId[key].id))
      }
      console.log(arr)
      that.setData({
        equipmentList:[]
      })
      that.getList(arr);
   
    })

  },

  bindReplaceInput: function (e) {        //键盘输入时触发
    var value = e.detail.value
    this.setData({
      text: value
    })
    this.findEquipment();
  },
  equipmentPwd:function(e){       //设备密码 
    var value = e.detail.value
    this.setData({
      pwd: value
    })
  },

  searchEquipment: function () {     //用户点击搜索按钮
    var that=this
    var text = this.data.text  
    if(text===''){
      let timeoutId = utils.showLoadingToast('请输入设备号ID')
      return
    }

    this.setData({
      loadModal: true
    })
  
    
    equipmentUtils.getEquipment(text, (res) => {
      console.log(res)
      var equipmentListId=[]
      var Lists=res.data.objects
      if (res.data.objects.length === 0) {
        let timeoutId = utils.showLoadingToast('查找不到此设备')
        setTimeout(() => {
          this.setData({
            loadModal: false,
            equipmentList:[]
          })
        }, 1000)
        return
      }
      for (let i = 0; i < res.data.objects.length; i++) {
        equipmentListId.push({
          id: Lists[i].equipment_id
        })
        
      }
      var arr=[]
      for (var key in equipmentListId) {
        console.log(key); //json对象的key  
        console.log(equipmentListId[key]); //json对象的值 
        arr.push(parseInt(equipmentListId[key].id)) 
      }  
      console.log(arr)
      that.getList(arr);

    })

  },
  showModal(e) {     //遮罩
    this.setData({
      modalName: e.currentTarget.dataset.target,
      equipmentId:e.currentTarget.dataset.id
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  verfication(e){                       //验证密码
    var that=this
    var pwd=this.data.pwd;
    var equipmentId = this.data.equipmentId
    console.log(pwd)
    // this.setData({
    //   modalName: null
    // })
    if(pwd===''){
      wx.showToast({
        title: '请输入密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      loadModal: true
    })
    
    equipmentUtils.checkEquipment(equipmentId, pwd, (res) => {
      console.log(res,'hhhjhjhj')
      if(res){
        wx.showToast({
          title: '验证通过',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
        this.setData({
          modalName: null
        })
        wx.navigateTo({
          url: '../equipment_details/equipment_details?equipmentId=' + equipmentId,
        })
        

      }else{
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
        wx.showToast({
          title: '密码出错',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          pwd:''
        })
        
      }
    
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
  
  },



  //获取文字信息
  getCur(e) {
    console.log(e)
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    console.log(e)
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
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