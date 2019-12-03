import config from '../config/config'

let getEquipment = (ctx, cb) => {                  //从知晓云数据库查找设备
  console.log(ctx)
 
  let tableId = config.EQUIPMENT_ID.MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
 
  let query = new wx.BaaS.Query()
  query.contains('equipment_id', ctx)
  Merchants.setQuery(query).limit(1000).offset(0).orderBy('-created_at').find(
    )
    .then(res => {
      cb(res);
      
    })
    .catch(err => console.dir(err))
}
let checkEquipment = (ctx,pwd, cb) => {                  //验证设备密码
  
  let tableId = config.EQUIPMENT_ID.MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
  let query = new wx.BaaS.Query()
  query.compare('equipment_id',"=", ctx)
   let query1= new wx.BaaS.Query()
  query1.compare('password', '=', pwd)
  let andQuery = wx.BaaS.Query.and(query, query1)

  // Merchants.orderBy('-created_at')
  Merchants.setQuery(andQuery).find(
  )
    .then(res => {    
      // cb(res);
      if(res.data.objects.length>0){
        cb(true);
      }else{
        cb(false);
      }
    })
    .catch(err => console.dir(err))
}

let checkUserEquipment = (equipmentId, uid, cb) => {                  //查找用户是否添加设备

  let tableId = config.COLLECTION.MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
  let query = new wx.BaaS.Query()
  query.compare('equipmentId', "=", equipmentId)
  let query1 = new wx.BaaS.Query()
  query1.compare('created_by', '=', uid)
  let andQuery = wx.BaaS.Query.and(query, query1)

  Merchants.setQuery(andQuery).limit(1000).offset(0).find(
  ).then(res => {
      cb(res);
      if (res.data.objects.length > 0) {
        cb(true);   //用户已经添加过设备
      } else {
        cb(false);  //用户还没有添加过设备
      }
    })
    .catch(err => console.dir(err))
}


let collectEquipment = (equipmentId, uid, cb) => {                  //用户添加设备

  let tableId = config.COLLECTION.MERCHANTS,
    Merchants = new wx.BaaS.TableObject(tableId)
  let product = Merchants.create()

  let equipment = {
    equipmentId: equipmentId
   
 
  }

  product.set(equipment).save(
  ).then(res => {
     
      if(res.errMsg==='request:ok'){
        cb(true);
      }else{
        cb(false);
      }
      
    })
    .catch(err => console.dir(err))
}


let userEquipmentList = (uid, cb) => {                  //查找用户添加设备的设备列表
  let tableId = config.COLLECTION.MERCHANTS
    let Product = new wx.BaaS.TableObject(config.COLLECTION.MERCHANTS)
  let query1 = new wx.BaaS.Query()
  console.log(uid)
  query1.compare('created_by', '=', uid)
  
  Product.setQuery(query1).find().then(res => {
    console.log(res)
    cb(res);
    // success
  }, err => {
    // err
  }).catch(err => console.dir(err))
}

   

let deleteEquipment = (equipmentId, uid, cb) => {                  //用户查找设备后移除
  let tableId = config.COLLECTION.MERCHANTS
  let Product = new wx.BaaS.TableObject(config.COLLECTION.MERCHANTS)
  let query = new wx.BaaS.Query()
  query.compare('equipmentId', "=", equipmentId)
  let query1 = new wx.BaaS.Query()
  query1.compare('created_by', '=', uid)
  let andQuery = wx.BaaS.Query.and(query, query1)

  Product.setQuery(andQuery).find().then(res => {
    console.log(res)
    var recordID=res.data.objects[0].id
    Product.delete(recordID).then(res => {
      // success
      cb(true)
    }, err => {
      // err
      cb(false)
    })
    
   
    // success
  }, err => {
    // err
  }).catch(err => console.dir(err))
}





module.exports = {
  getEquipment,
  checkEquipment,
  checkUserEquipment,
  collectEquipment,
  userEquipmentList,
  deleteEquipment

  
}