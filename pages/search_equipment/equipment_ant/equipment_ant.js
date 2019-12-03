// pages/search_equipment/equipment_ant/equipment_ant.js
import F2 from '../../../f2-canvas/lib/f2';


const app = getApp()
let chart = null;
let chart2=null;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    wx.request({
      url: "http://api.heclouds.com/cmds?device_id=515394264",
      data: {
        "cmd_uuid": "{blueled}1"

      },

      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'api-key': 'JJeGOIiHG8=FGgAeKXUKXjubkVg='
      }, // 设置请求的 header
      success: function (data) {
        console.log(data.data.errno)
        
       
        that.lineChart(data.data.errno);

      },
      fail: function (err) {
        console.log(err)
        //wx.request({
        // url: '',
        //})
      }
    })

    
   

  },
  lineChart(aa) {
    /**动态交互时，通过调用传入新的data值*/
    var data = [{ pointer: '当前温度', value: aa, length: 2, y: 1.05 }];
    var that = this;
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
            { x: x, y: 0.3 }
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
              text: text + '%',
              x: cfg.center.x,
              y: cfg.center.y,
              fill: '#1890FF',
              fontSize: 24,
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
          ticks: [0, 25, 50, 75,100],
          nice: false
        },
        length: { type: 'linear', min: 0, max:100 },
        y: { type: 'linear', min: 0, max: 0.85 }
      });

      chart.coord('polar', {
        inner: 0,
        startAngle: -1.25 * Math.PI,
        endAngle: 0.25 * Math.PI,
        radius: 0.8
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



    that.chartComponent2 = that.selectComponent('#gauge2-dom');
    that.chartComponent2.init((canvas, width, height) => {
      const Shape2 = F2.Shape;
      Shape2.registerShape('point', 'dashBoard', {
        getPoints: function (cfg) {
          const x = cfg.x;
          const y = cfg.y;

          return [
            { x: x, y: y },
            { x: x, y: 0.5 }
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
              text: text + '%',
              x: cfg.center.x,
              y: cfg.center.y,
              fill: '#1890FF',
              fontSize: 24,
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
        radius:1.,
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