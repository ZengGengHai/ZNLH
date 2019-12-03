// pages/search_equipment/equipment_details/equipment_details.js
const app = getApp();
import equipmentUtils from '../../../utils/equipment';
import utils from '../../../utils/utils'
import F2 from '../../../f2-canvas/lib/f2';
let chart = null;
let chart2 = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    List:[],
    collectionBox:false,
    equipmentId:'',
    sign:false,
    markers:[],
    location:{},    
    newtime:{}, 
    showLight:false,


    mapshow:false,        //地图展示
    temperatureshow:false,  //温度展示
    timeshow:false,      //时间展示
    bluelightshow:false, //蓝灯展示
    yellowlightshow:false,//黄灯展示
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    this.setData({
      loadModal: true
    })
    console.log(options)
    var equipmentId = options.equipmentId;
    let user_id = wx.BaaS.storage.get('uid');
    console.log(user_id);
    this.equipmentDetail(equipmentId);
    this.checkUserEquipment(equipmentId,user_id);
    that.setData({
      equipmentId,
    })
    this.time(equipmentId);//刷新数据

  },
  time:function(equipmentId){
    var that=this
   
    that.setData({
     
      time:setInterval(function () {
      //循环执行代码 
       
      console.log(that.data.sign)
      that.equipmentDetail(equipmentId)
      
      if (that.data.sign) {
        clearInterval(that.data.time)
      }
    }, 1500) 

    })
    
  },

  
  equipmentDetail:function(id){            //获取设备数据
    var that=this
    console.log(id)
    app.agriknow.getEquipmentDetails(id)
      .then(res => {
        console.log(res)
        var List=res.data
        console.log(List)


        var newList=[]    //温度和湿度
        var location={}   //地理位置
        var markers=[]     //地图标点
        var newtime=[]     //数据流最新时间
        var showLight=false     //灯状态 
        List.forEach((elem, idx) => {
          if (elem.id == "温度" || elem.id =="湿度") {
            newList.push({
              update_at: elem.update_at,
              id:elem.id,
              uuid:elem.uuid,
              current_value:elem.current_value
            })
            that.setData({
              temperatureshow:true //温度展示
            })
          }


          if (elem.id =="蓝色LED"){     //水泵
            if (elem.current_value===0){
              showLight=false
            }else{
              showLight=true
            }
            that.setData({
              bluelightshow:true
            })
          }

          if (elem.id == "黄色LED") {   //水阀
            if (elem.current_value === 0) {
              showLight = false
            } else {
              showLight = true
            }
            that.setData({
              yellowlightshow: true
            })
          }


          if (elem.id=="GPS"){           //获取地理位置
            location={
              update_at: elem.update_at,
              id: elem.id,
              uuid: elem.uuid,
              current_value: elem.current_value
            }
            markers.push({
              latitude: elem.current_value.lat,
              longitude: elem.current_value.lon,
              name: elem.id,
              iconPath:'../../../images/icon/map1.png',
              width: 35,
              height:35 
            })
            

            var bb = that.data.markers[0] || ""
            if (bb != '') {                    //加载第一次图标
              if (bb.latitude != markers[0].latitude && bb.longitude != markers[0].longitude) {     //位置有变化是改变图标
                console.log("位置有变化过")
                that.setData({
                  markers,
                })
              }
            } else {
              that.setData({
                markers,
                mapshow: true
              })
            }

            var aa = that.data.location.current_value || ""    //视野加载一次      
            if (aa === "") {
              that.setData({
                location
              })
            }


          }
          if (elem.id =="实时时间"){      //获取数据流最新时间
            newtime={
              id:elem.id,
              update_at:elem.update_at
            }
            that.setData({
              timeshow:true
            })

          }
        }) 

              

        that.setData({
          List:res.data,
          newList,
          newtime,
          showLight,
          
        })



        newList.forEach((elem, idx) => {
          if (elem.id == "温度" ) {
            console.log(elem.current_value)
            that.temperatureChart(elem.current_value.toFixed(2))  
          }
          if (elem.id == "湿度") {
            console.log(elem.current_value)
            that.humidityChart(elem.current_value.toFixed(2))
          }
        }) 




        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
      
      })
      .catch(res => {
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
        clearInterval(that.data.time)

        console.log(res,'出错了')
        // wx.showToast({
        //   title: '出错了！',
        //   icon: 'none'
        // })
      })
  },
  checkUserEquipment: function (equipmentId, user_id){         //验证用户是否添加过设备
    var that=this
    equipmentUtils.checkUserEquipment(equipmentId, user_id, (res) => {
      console.log(res)
      if(!res){    //如果没有添加设备
        that.setData({
          collectionBox:true
        })
      }
    })

  },
  collectEquipment:function(){            //添加设备
    this.setData({
      loadModal: true
    })

    var that = this
    var equipmentId = this.data.equipmentId
    var user_id = app.getUserId();
    console.log(equipmentId,user_id) 

    equipmentUtils.collectEquipment(equipmentId, user_id, (res) => {
      console.log(res)
      that.setData({
        collectionBox: false
      })
      setTimeout(() => {
        this.setData({
          loadModal: false
        })
      }, 500)

     
      setTimeout(() => {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        })
      }, 500)


     
    })


  },
  deleteEquipment:function(){    //从我的设备表收藏表移除设备
    this.setData({
      loadModal: true
    })
    var that=this
    var equipmentId = this.data.equipmentId
    var user_id = app.getUserId();
    equipmentUtils.deleteEquipment(equipmentId, user_id, (res) => {
      console.log(res)
      if(res){ //移除设备成功
        that.setData({
          collectionBox: true
        })
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
        setTimeout(() => {
          wx.showToast({
            title: '移除成功',
            icon: 'none',
            duration: 2000
          })
        }, 500)
      

        setTimeout(() => {
          that.verificationPage();                          //验证是从哪个页面进入
        }, 1500)
      }else{
        setTimeout(() => {
          this.setData({
            loadModal: false
          })
        }, 500)
        setTimeout(() => {
          wx.showToast({
            title: '移除失败',
            icon: 'none',
            duration: 2000
          })
        }, 500)

      }
     
    })

  },

  verificationPage(){               //验证此页面从哪个页面进入
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面
    console.log(prevPage)
    if (prevPage.route ==='pages/my_equipment/myequipment/myequipment'){
      console.log('从我的设备页面进入设备详情页面得')
      prevPage.userEquipmentList();
      
      wx.navigateBack({
        delta:1
      });
    }

  },



  loadModal() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 2000)
  },



  temperatureChart(value) {                            //温度表
    /**动态交互时，通过调用传入新的data值*/
    var that = this;
    var data = [{ pointer: '当前温度', value: value, length: 1, y: 1.05 }];
    /*在这里改变一下结构即可*/
    that.chartComponent = that.selectComponent('#gauge-dom');
    that.chartComponent.init((canvas, width, height) => {
      const Shape = F2.Shape;
      Shape.registerShape('point', 'dashBoard', {
        getPoints: function (cfg) {
          const x = cfg.x;
          const y = cfg.y;

          return [
            { x: x, y: y },
            { x: x, y: 0.6 }
          ];
        },
        draw: function (cfg, container) {
          let point1 = cfg.points[0];
          let point2 = cfg.points[1];
          point1 = this.parsePoint(point1);
          point2 = this.parsePoint(point2);

          const line = container.addShape('Polyline', {
            attrs: {
              points: [point1, point2],
              stroke: '#1890FF',
              lineWidth: 2
            }
          });

          const text = cfg.origin._origin.value.toString();
          const text1 = container.addShape('Text', {
            attrs: {
              text: text + 'º',
              x: cfg.center.x,
              y: cfg.center.y,
              fill: '#1890FF',
              fontSize: 18,
              textAlign: 'center',
              textBaseline: 'bottom'
            }
          });
          const text2 = container.addShape('Text', {
            attrs: {
              text: cfg.origin._origin.pointer,
              x: cfg.center.x,
              y: cfg.center.y,
              fillStyle: '#ccc',
              textAlign: 'center',
              textBaseline: 'top'
            }
          });

          return [line, text1, text2];
        }
      });
      chart = new F2.Chart({
        el: canvas,
        width,
        height,
        animate: false
      });
      chart.source(data, {
        value: {
          type: 'linear',
          min: 0,
          max: 100,
          ticks: [0, 25, 50, 75, 100],
          nice: false
        },
        length: { type: 'linear', min: 0, max: 100 },
        y: { type: 'linear', min: 0, max: 1 }
      });

      chart.coord('polar', {
        inner: 0,
        startAngle: -1.25 * Math.PI,
        endAngle: 0.25 * Math.PI,
        radius: 1
      });

      //配置value轴刻度线
      chart.axis('value', {
        tickLine: {
          strokeStyle: '#ccc',
          lineWidth: 2,
          length: -5
        },
        label: null,
        grid: null,
        line: null
      });

      chart.axis('y', false);

      //绘制仪表盘辅助元素
      chart.guide().arc({
        start: [0, 1.05],
        end: [24, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [26, 1.05],
        end: [49, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [51, 1.05],
        end: [74, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [76, 1.05],
        end: [100, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [0, 1.2],
        end: [100, 1.2],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 1
        }
      });

      chart.guide().text({
        position: [-0.5, 1.3],
        content: '0º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart.guide().text({
        position: [50, 0.7],
        content: '50º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart.guide().text({
        position: [100, 1.3],
        content: '100º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });

      chart.point().position('value*y')
        .size('length')
        .color('#1890FF')
        .shape('dashBoard');
      chart.render();


    })



   
   
  },
  humidityChart(value){                                //湿度表
    var that = this;
    var data = [{ pointer: '当前湿度', value:value, length: 1, y: 1.05 }];
    /*在这里改变一下结构即可*/
    that.chartComponent2 = that.selectComponent('#gauge2-dom');
    that.chartComponent2.init((canvas, width, height) => {
      const Shape2 = F2.Shape;
      Shape2.registerShape('point', 'dashBoard', {
        getPoints: function (cfg) {
          const x = cfg.x;
          const y = cfg.y;

          return [
            { x: x, y: y },
            { x: x, y: 0.6 }
          ];
        },
        draw: function (cfg, container) {
          let point1 = cfg.points[0];
          let point2 = cfg.points[1];
          point1 = this.parsePoint(point1);
          point2 = this.parsePoint(point2);

          const line = container.addShape('Polyline', {
            attrs: {
              points: [point1, point2],
              stroke: '#1890FF',
              lineWidth: 2
            }
          });

          const text = cfg.origin._origin.value.toString();
          const text1 = container.addShape('Text', {
            attrs: {
              text: text + 'º',
              x: cfg.center.x,
              y: cfg.center.y,
              fill: '#1890FF',
              fontSize: 18,
              textAlign: 'center',
              textBaseline: 'bottom'
            }
          });
          const text2 = container.addShape('Text', {
            attrs: {
              text: cfg.origin._origin.pointer,
              x: cfg.center.x,
              y: cfg.center.y,
              fillStyle: '#ccc',
              textAlign: 'center',
              textBaseline: 'top'
            }
          });

          return [line, text1, text2];
        }
      });
      chart2 = new F2.Chart({
        el: canvas,
        width,
        height,
        animate: false
      });
      chart2.source(data, {
        value: {
          type: 'linear',
          min: 0,
          max: 100,
          ticks: [0, 25, 50, 75, 100],
          nice: false
        },
        length: { type: 'linear', min: 0, max: 100 },
        y: { type: 'linear', min: 0, max: 0.95 }
      });

      chart2.coord('polar', {
        inner: 0,
        startAngle: -1.25 * Math.PI,
        endAngle: 0.25 * Math.PI,
        radius: 1.7,
      });

      //配置value轴刻度线
      chart2.axis('value', {
        tickLine: {
          strokeStyle: '#ccc',
          lineWidth: 2,
          length: -5
        },
        label: null,
        grid: null,
        line: null
      });

      chart2.axis('y', false);

      //绘制仪表盘辅助元素
      chart2.guide().arc({
        start: [0, 1.05],
        end: [24, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart2.guide().arc({
        start: [26, 1.05],
        end: [49, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart2.guide().arc({
        start: [51, 1.05],
        end: [74, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart2.guide().arc({
        start: [76, 1.05],
        end: [100, 1.05],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart2.guide().arc({
        start: [0, 1.2],
        end: [100, 1.2],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 1
        }
      });

      chart2.guide().text({
        position: [-0.5, 1.3],
        content: '0º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart2.guide().text({
        position: [50, 0.7],
        content: '50º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart2.guide().text({
        position: [100, 1.3],
        content: '100º',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });

      chart2.point().position('value*y')
        .size('length')
        .color('#1890FF')
        .shape('dashBoard');
      chart2.render();


    })

  },

 

  openBLight:function(){   //水泵开
    var equipmentid = this.data.equipmentId

    app.agriknow.putEquipmentDetails(equipmentid, '{blueled}1').then(res => {
      console.log(res)
      var List = res.data
      console.log(List)
      if(List.error==="succ"){
        console.log('成功')
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
      } else if (List.errono===10){
        设备不再线
        wx.showToast({
          title: ' 设备不再线！',
          icon: 'none'
        })

      }else{
        wx.showToast({
          title: ' 发送失败',
          icon: 'none'
        })
      }
    })
      .catch(res => {
        console.log(res, '出错了')
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
      })

  },
  closeBLight:function(){    //水泵关
    var equipmentid = this.data.equipmentId
    app.agriknow.putEquipmentDetails(equipmentid, '{blueled}0').then(res => {
      console.log(res)
      var List = res.data
      console.log(List)
      if (List.error === "succ") {
        console.log('成功')
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
      } else if(List.errono === 10) {
        wx.showToast({
          title: ' 设备不再线！',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: ' 发送失败',
          icon: 'none'
        })
      }
    })
      .catch(res => {
        console.log(res, '出错了')
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
      })



  },


  openYLight: function () {     //水阀
    var equipmentid = this.data.equipmentId

    app.agriknow.putEquipmentDetails(equipmentid, '{yellowled}1').then(res => {
      console.log(res)
      var List = res.data
      console.log(List)
      if (List.error === "succ") {
        console.log('成功')
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
      } else if (List.errono === 10) {
        设备不再线
        wx.showToast({
          title: ' 设备不再线！',
          icon: 'none'
        })

      } else {
        wx.showToast({
          title: ' 发送失败',
          icon: 'none'
        })
      }
    })
      .catch(res => {
        console.log(res, '出错了')
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
      })

  },
  closeYLight: function () {    //水阀关
    var equipmentid = this.data.equipmentId
    app.agriknow.putEquipmentDetails(equipmentid, '{yellowled}0').then(res => {
      console.log(res)
      var List = res.data
      console.log(List)
      if (List.error === "succ") {
        console.log('成功')
        wx.showToast({
          title: '发送成功',
          icon: 'none'
        })
      } else if (List.errono === 10) {
        wx.showToast({
          title: ' 设备不再线！',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: ' 发送失败',
          icon: 'none'
        })
      }
    })
      .catch(res => {
        console.log(res, '出错了')
        wx.showToast({
          title: '出错了！',
          icon: 'none'
        })
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
    var that=this
    
    clearInterval(that.data.time)
    // that.setData({
    //   sing:true
    // })
    console.log("关闭定时器")

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