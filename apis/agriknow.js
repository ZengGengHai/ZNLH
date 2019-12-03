import request from './request.js'
import config from '../config/config'

class agriknow {
  constructor() {
    this._baseUrl = 'https://api.heclouds.com'
    this._defaultHeader = { 'data-tupe': 'application/json' }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 从onenet平台查询所有设备列表
   */
  getEquipment(arr) {          
  
    let data=''
    let header = {
      'api-key': config.ONENET_KEY
    }
    console.log(arr)
    return this._request.getRequest(this._baseUrl + '/devices?device_id=' +arr, data,header).then(res => res.data)
  }




  /**
   * 从onenet平台查询某个设备详情
   */
  getEquipmentDetails(id) {
    let data = ''
    let header = {
      'api-key': config.ONENET_KEY
    }
   
    return this._request.getRequest(this._baseUrl +'/devices/'+id+'/datastreams', data, header).then(res => res.data)
  }

  

  /**
   * 发送命令
   */

  putEquipmentDetails(id,command) {
    let data = {
      "cmd_uuid": command
    }
    let header = {
      'api-key': config.ONENET_KEY
    }

    return this._request.postRequest(this._baseUrl + '/cmds?device_id=' + id , data, header).then(res => res)
  }

 

  /**
   * 获取所有课程
   */
  getCourseList(page = 1, size = 10, key = null) {
    let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
    return this._request.getRequest(this._baseUrl + '/course/mobile', data).then(res => res.data)
  }
}



export default agriknow