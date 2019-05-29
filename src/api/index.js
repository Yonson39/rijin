import axios from 'axios'
import * as url from './urlConfig'

// 
// ********** onenet模块 **********
//
export const onenet = {
  // 设备
  // 批量查询设备最新数据
  // 传入参数：apikey，需要查询的设备id
  // 返回各个设备下所有监控点的最新数据
  onenetDataRequire (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/datapoints?devIds=${param.deviceId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 设备
  // 模糊查询设备
  // 参数：api-Key，不带其它参数
  // 返回：该产品下的所有设备的参数信息
  onenetDevQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点 
  // 批量查询数据流信息 最新数据
  // 传入参数：apikey，需要查询的设备id，数据流id(多选)
  // 返回所查询数据流下的最新数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStreamDataQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datastreams?datastream_ids=${param.datastreamId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartOneHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id，cursor偏移量
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartNextHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&cursor=${param.cursor}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

// 
// *********** back模块 ***********
//
export const back = {
  //
  // ******* 1-关联模块 *******
  //
  // 1.1获取网关下设备列表
  netDevListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/relation/netgate/devices?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.2获取用户下网关列表
  userNetListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/relation/user/netgates`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.3获取网关下的监控点列表
  netMoniterListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/relation/netgate/streams?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 2-工具模块 *******
  //
  // 2.1获取短信验证码
  smsSend (param) {
    return axios({ // 第一个return对应back.smsSend(this.param)  为了封装函数用的  狗屁理解，正确理解应是箭头函数多行表达式的固定写法
      url: `${url.backbasurl}/api/v1/util/sms?mobile=${param.mobile}`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data // 这边返回response.data login页面调用时返回的就是这里了
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 3-报警模块 *******
  //
  // 3.1添加报警联系人
  triContactAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/contact`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,     // 人名，小于16字符
        mobile: param.mobile,
        enable: param.enable  // 1-启用，0-未启用
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.2修改报警联系人
  triContactMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/contact`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        id: param.id,                   // 报警联系人id
        name: param.name,               
        mobile: param.mobile,           
        enable: param.enable            
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.3删除触发器
  triDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        triggerId: param.triggerId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.4获取报警联系人列表
  getTriConList (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/contact/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.5修改触发器
  triMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        streamId: param.streamId,
        type: param.type,
        threshold: param.threshold,
        content: param.content,
        triggerId: param.triggerId // 获取触发器列表的时候会返回，然后修改触发器时需要带上
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.6确认当前报警
  triNowConfirm (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/data/current?id=${param.id}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.7删除报警联系人
  triContactDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/contact?id=${param.id}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.8获取触发器列表
  getTriList (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.9添加触发器
  triAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,         // 触发器名称，小于16字符
        streamId: param.streamId, // 数据流Id
        streamName: param.streamName, // 数据流名称，根据关联模块自动匹配生成的
        type: param.type,         // 触发类型 >
        threshold: param.threshold, // 触发阈值，最长10位小数
        content: param.content      // 报警内容，小于50字符
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.10获取历史报警
  getHisTri (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/data/history?sn=${param.sn}&startTime=${param.startTime}&endTime=${param.endTime}`,
      method: 'get', // 时间类型参数格式：2018-11-11 12:24:56
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.11获取当前未处理的报警信息
  getNowTriNot (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/trigger/data/current?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 4-用户模块  *******
  // 
  // 4.1 修改用户信息
  userMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/users`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        name: param.name,         // 选填
        company: param.company    // 选填
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // // 4.2 修改用户信息(用户管理模块)
  // userManagerMod (param) {
  //   return axios({
  //     url: `${url.backbasurl}/api/v1/manager/user`,
  //     method: 'put',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'userId': param.userId,
  //       'Authorization': param.Authorization
  //     },
  //     data: {
  //       userId: param.userId,
  //       name: param.name,
  //       account: param.account,
  //       mobile: param.mobile,
  //       company: param.company,
  //       password: param.password,
  //       auth: param.auth
  //     }
  //   })
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // },
  // 4.3 修改密码
  userPasswordMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/users/password`,
      method: 'put',
      headers: {
        'userId': param.userId,
        'Content-Type': 'application/json'
      },
      data: {
        mobile: param.mobile,
        password: param.password
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.4 用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name,         // 用户名，16字符以内
        password: param.password, // 密码，16字符以内
        company: param.company,   // 公司，20字符以内 选填
        mobile: param.mobile,     // 手机号，11字符
        code: param.code          // 短信验证码，6位数字
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.5 用户信息获取
  getuserInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/user`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.6 修改手机号
  mobileMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/user/mobile?newMobile=${param.newMobile}&code=${param.code}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.7 用户登录
  userLogin (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        mobile: param.mobile,       // 手机号
        password: param.password    // 密码
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 5-网关模块 *******
  // 
  // 5.1修改网关分组名
  netGroupNameMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate/group`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        groupName: param.groupName,
        groupId: param.groupId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.2新增网关分组
  netGroupAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate/group`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        groupName: param.groupName
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.3添加网关
  netAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,                 // 网关序列号,不超过16字符
        password: param.password,     // 网关密码，6位
        name: param.name,             // 网关名字，不超过16字符
        groupId: param.groupId,       // 网关所在厨房ID
        location: param.location      // 网关三维坐标，JSON格式，object = {lat, lon, ele}
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }, 
  // 5.4根据sn查询单一网关信息
  devInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.5 修改网关信息
  netMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,                           // 网关sn
        name: param.name,                       // 网关名称
        location: param.location               // {"lon":12, "lat": 13, "ele": 13}
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.6删除用户下绑定网关，解除绑定，进行DELETE请求
  userDevDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/netgate?sn=${param.sn}`,
      method: 'delete',
      headers: {
        // 'api-key': param.apiKey,
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 6-设备模块 *******
  // 
  // 6.1添加设备 设备===各种传感器，
  // 返回设备MAC地址
  devAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,                 // 网关序列号,16字符以内
        name: param.name,             // 设备名，20字符以内
        type: param.type,             // 设备类型
        station: param.station,       // 设备站号
        crc: param.crc,               // crc校验，0-低位前 1-高位前
        interfaceNumber: param.interfaceNumber, // 第几路模拟量或者风阀 选填
        queryTime: param.queryTime,   // 查询时间，服务器会默认10s。选填
        deadArea: param.deadArea,     // 死区,服务器会默认0。选填
        installTime: param.installTime // 安装时间。选填
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.2查询设备信息 单个设备查询
  // 传入设备MAC,返回设备mac,name,station,queryTime,type,deadArea,crc
  devQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device?mac=${param.mac}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.3给设备发命令
  devCmd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device/order`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        mac: param.mac,
        streamId: param.streamId,
        value: param.value            // integer类型
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.4删除设备
  devDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        mac: param.mac, // string
        interfaceNumber: param.interfaceNumber // number,模拟量之外设备随便传一个数字即可
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.5修改设备信息
  devMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/device`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        mac: param.mac,
        deviceId: param.deviceId,
        apiKey: param.apiKey,
        isUpdate: param.isUpdate,     // 0-不改 1-修改。该参数表示是否需要修改设备的相关参数
        sn: param.sn,                 // 网关序列号,16字符以内
        name: param.name,             // 设备名，20字符以内
        type: param.type,             // 设备类型
        station: param.station,       // 设备站号
        crc: param.crc,               // crc校验，0-低位前 1-高位前
        interfaceNumber: param.interfaceNumber, // 第几路模拟量或者风阀 选填
        queryTime: param.queryTime,   // 查询时间，服务器会默认10s。选填
        deadArea: param.deadArea,     // 死区,服务器会默认0。选填
        installTime: param.installTime // 安装时间。选填
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 7-场景联动模块模块 *******
  // 
  // 7.1查询规则列表
  ruleListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/rule/list?groupId=${param.groupId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.2添加联动规则
  ruleAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/rule`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        name: param.name,               // 场景名称
        content: param.content,         // 场景描述
        groupId: param.groupId,         // 网关组Id (厨房)
        inputRules: param.inputRules,   // 输入规则
        outputRules: param.outputRules  // 输出规则
        // inputRules: [
        //   {
        //     sn: param.sn,
        //     mac: param.mac,
        //     name: param.name,
        //     streamId: param.streamId,
        //     type: param.type,
        //     condition: param.condition,
        //     value: param.value,
        //     order: param.order      // io模块第几路
        //   },
        //   {
        //     sn: param.sn,
        //     mac: param.mac,
        //     name: param.name,
        //     streamId: param.streamId,
        //     type: param.type,
        //     condition: param.condition,
        //     value: param.value
        //   },
        // ],
        // outputRules: [
        //   {
        //     sn: param.sn,
        //     mac: param.mac,
        //     name: param.name,
        //     streamId: param.streamId,
        //     type: param.type,
        //     condition: param.condition,
        //     value: param.value
        //   },
        //   {
        //     sn: param.sn,
        //     mac: param.mac,
        //     name: param.name,
        //     streamId: param.streamId,
        //     type: param.type,
        //     condition: param.condition,
        //     value: param.value
        //   }
        // ]
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.3修改联动规则
  ruleMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/rule`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        name: param.name,               // 场景名称
        content: param.content,         // 场景描述
        ruleId: param.ruleId,           // 网关组Id (厨房)
        inputRules: param.inputRules,   // 输入规则
        outputRules: param.outputRules  // 输出规则
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.4获取规则详情
  ruleInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/rule?ruleId=${param.ruleId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.5删除规则
  ruleDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/rule?ruleId=${param.ruleId}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  //
  // ******* 8-用户管理模块 *******
  // 
  // 8.1 新增用户
  userAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        name: param.name,
        account: param.account,
        password: param.password,
        mobile: param.mobile,         // 选填
        company: param.company,       // 选填
        auth: param.auth              // 0-超级(不可添加) 1-管理员 2-查看者 3-普通用户
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.2 修改用户信息
  userManagerMod (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/user`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        userId: param.userIdMod,
        name: param.name,
        account: param.account,
        password: param.password,
        mobile: param.mobile,        // 选填
        company: param.company,      // 选填 
        auth: param.auth
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.3 获取用户列表
  userInfoListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/user/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 8.4 删除用户
  userDel (param) {
    return axios({
      url: `${url.backbasurl}/api/v1/manager/user?userId=${param.userId}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  /*
    ***** 获取oss签名数据 *****
  */
  ossInfo () {
    return axios({
      url: `http://picture.thingcom.com/web/token`,
      method: 'get',
      headers: {},
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
