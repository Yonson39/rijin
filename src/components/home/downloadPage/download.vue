<template>
  <el-container>
    <div class="download">
      <el-main class="downloadmain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="tableData"
          border
          style="width: 100%"
          max-height = "450">
          <el-table-column
            fixed
            prop="name"
            label="别名"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="device"
            label="设备"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="communication"
            label="通讯方式"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="com"
            label="COM"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            min-width="20%">
            <template slot-scope="scope">
              <el-tooltip content="远程下载功能由客户端实现" placement="bottom" effect="light">
                <el-button type="success" size="small" icon="el-icon-sort" v-show = "(param.auth <= shareAdminAuth)">透传</el-button>
              </el-tooltip>
              <el-button type="success" size="small" icon="el-icon-setting" v-show="(param.auth <= shareAdminAuth)" @click="SerialBindSelectedEditBt(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer class="bottomfooter" height="60px">
        <div class="addpoint">
          <el-button type="success" class="adduser" icon="el-icon-setting" v-show="(param.auth <= shareAdminAuth)" @click="deviceSetInitBt">设备管理</el-button>
          
          <el-dialog title="设备设置" width="785px" top="10vh" :visible.sync="dialogFormVisible" center>
            <el-tabs type="border-card">
              <el-tab-pane label="串口配置">
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="串口选择">
                    <el-select v-model="formInline.com" placeholder="" @change="serialPortChangeEvent()">
                      <el-option
                        v-for= "item in comDataOption"
                          :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-radio-group v-model="connectRadio">
                  <el-radio :label="0">未使用</el-radio>
                  <el-radio :label="1">连接设备（做主设备）</el-radio>
                  <div class="deviceset">
                    <div v-show="openorclose" >
                      <el-button type="text"></el-button>

                      <el-row>
                        <el-col :span="12">
                          <div class="grid-left">
                            <el-form :model="formInline" :inline="true" label-width="80px" class="demo-form-inline">
                              <el-form-item label="制造厂商">
                                <el-select v-model="formInline.bindDeviceType" placeholder="" @change="deviceTypeChangeEvent()">
                                  <el-option
                                    v-for= "item in bindDeviceTypeDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="设备别名">
                                <el-input v-model="formInline.bindDeviceNickName" placeholder=""></el-input>
                              </el-form-item>
                            </el-form>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="grid-right">
                            <el-form :model="formInline" :inline="true" label-width="80px">
                              <el-form-item label="设备类型">
                                <el-select v-model="formInline.bindDeviceName" placeholder="">
                                  <el-option
                                    v-for= "item in bindDeviceNameDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-form>
                          </div>
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col :span="24"><div class="line grid-content bg-purple-dark">
                          <span>通讯型</span><hr/>
                          </div>
                        </el-col>
                      </el-row>

                      <el-row>
                        <el-col :span="12">
                          <div class="grid-left">
                            <el-form :model="formInline" :inline="true" label-width="80px" class="demo-form-inline">
                              <el-form-item label="通讯类型">
                                <el-select v-model="formInline.communicationType" placeholder="">
                                  <el-option
                                    v-for= "item in communicationTypeDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="数据位">
                                <el-select v-model="formInline.dataLength" placeholder="" @change="dataBitchangeEvent">
                                  <el-option
                                    v-for= "item in dataLengthDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="校验位">
                                <el-select v-model="formInline.parityCheck" placeholder="">
                                  <el-option
                                    v-for= "item in parityCheckDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="通信协议">
                                <el-select v-model="formInline.protocol" placeholder="">
                                  <el-option
                                    v-for= "item in protocalDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-form>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="grid-right">
                            <el-form :model="formInline" :inline="true" label-width="80px">
                              <el-form-item label="波特率">
                                <el-select v-model="formInline.baud" placeholder="">
                                  <el-option
                                    v-for= "item in baudDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="停止位">
                                <el-select v-model="formInline.stopLength" placeholder="">
                                  <el-option
                                    v-for= "item in stopLengthDataOption"
                                      :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                              <el-form-item label="兼容型号">
                                <el-input
                                  type="textarea"
                                  placeholder="型号内容"
                                  v-model="formInline.content">
                                </el-input>
                              </el-form-item>
                              <el-form-item label=" ">
                                <el-button type="success" @click="communicationdefaultSet">恢复默认</el-button>
                              </el-form-item>
                            </el-form>
                          </div>
                        </el-col>
                      </el-row>

                    </div>
                  </div>

                    <div class="dialog-footer">
                      <el-button @click="dialogFormVisible = false">取 消</el-button>
                      <el-button type="primary" @click="backSerialBindBt">确 定</el-button>
                    </div>
                  </el-radio-group>
                
              </el-tab-pane>
              <el-tab-pane label="其 它">其它</el-tab-pane>
            </el-tabs>
          </el-dialog>
        </div>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import axios from 'axios'
import { back, onenet } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import { plcRegister } from '@/components/config/register'

export default {
  name: 'alarmAuthorityDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': 'fdfd',
        'apiKey': '',                      // apikey值
        'auth': 2,                         // 权限
        'deviceId': '20417400',            // 当前设备ID号
        'deviceName': '',                  // 当前设备名
        'online': 0,                       // 在线，离线
        'com': '',                         // 串口
        'bindDeviceName': '',              // 绑定的设备名称
        'bindDeviceNickName': '',          // 绑定的设备别名
        'bindDeviceType': '',              // 绑定的设备厂家
        'isBind': 1,                       // 1为已绑定
        'protocol': '',                    // 使用的协议ASCII,RTU
        'communicationType': '',           // 通讯类型，485，232等
        'baud': 9600,                      // 波特率
        'dataLength': 7,                   // 数据域长度
        'stopLength': 1,                   // 停止位长度
        'parityCheck': ''                  // 奇偶校验方式
      },
      // plc设备信息，本地json文件获取
      plcInfo: {
        'errno': 0,
        'error': 'succ',
        'plcName': 'DELTA DVP',
        'protocol': 'ASCII',
        'bit': [],
        'bit16': []
      },
      // 存储获取到的串口数据
      serialInfoData: [{
        com: 'com1',            // 串口
        bindDeviceType: '',     // 绑定的设备厂家
        bindDeviceName: '',     // 绑定的设备名称
        bindDeviceNickName: '', // 绑定的设备别名
        isBind: 1,              // 1为已绑定
        communicationType: '',  // 通讯类型，485，232等
        baud: 9600,             // 波特率
        dataLength: 7,          // 数据域长度
        stopLength: 1,          // 停止位长度
        parityCheck: '',        // 奇偶校验方式
        protocol: 'ASCII',      // 使用的协议ASCII,RTU
        content: ''
      }],
      // 串口配置信息（表单数据）
      tableData: [{
        com: '',                // com1
        name: '',               // DELTA DVP name
        device: '',             // DELTA DVP
        communication: '',      // RS485
        remote: 1
      }],
      // 对话框参数信息
      formInline: {
        com: 'com1',            // 串口
        bindDeviceType: '',     // 绑定的设备厂家
        bindDeviceName: '',     // 绑定的设备名称
        bindDeviceNickName: '', // 绑定的设备别名
        isBind: 1,              // 1为已绑定
        communicationType: '',  // 通讯类型，485，232等
        baud: 9600,             // 波特率
        dataLength: 7,          // 数据域长度
        stopLength: 1,          // 停止位长度
        parityCheck: '',        // 奇偶校验方式
        protocol: 'ASCII',      // 使用的协议ASCII,RTU
        content: ''
      },
      // COM选框信息
      comDataOption: [{
        label: 'COM1',
        value: 'com1'
      }, {
        label: 'COM2',
        value: 'com2'
      }],
      bindDeviceTypeDataOption: [],       // 绑定的设备厂家
      bindDeviceNameDataOption: [],       // 绑定的设备名称
      // bindDeviceNickNameDataOption: [],
      communicationTypeDataOption: [],    // 通讯类型，485，232等
      baudDataOption: [],                 // 波特率
      dataLengthDataOption: [],           // 数据域长度
      stopLengthDataOption: [],           // 停止位长度
      parityCheckDataOption: [],          // 奇偶校验方式
      protocalDataOption: [{              // 使用的协议ASCII,RTU
        label: 'ASCII',
        value: 'ASCII'
      }, {
        label: 'RTU',
        value: 'RTU'
      }],
      ownerAuth: 1,                   // 拥有者权限
      shareAdminAuth: 2,              // 分享者管理员权限
      shareOperateAuth: 3,            // 分享者操作工权限
      shareNoteAuth: 4,               // 分享者记录员权限
      openorclose: false,             // 参数内容是否显示
      connectRadio: 0,                // 当前串口1已连接或者0未连接
      loadingFlag: false,
      formLabelWidth: '80px',
      dialogFormVisible: false,
      serialSetLoading: null
    }
  },
  watch: {
    connectRadio: function (val) {
      if (val === 1) {
        this.openorclose = true
      } else if (val === 0) {
        this.openorclose = false
      }
      // 参数加入
      // 设备参数填充
      this.serialParamInfoLoad()
      // 默认通讯参数加入
      this.communicationInfoLoad()
    }
  },
  //
  // ***************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
    // 表格内容初始化
    this.tableData = []
  },
  // 生命周期，安装期
  mounted: async function () {
    // 获取设备下挂plc的寄存器相关信息
    axios.get('static/plcInfo.json').then(function (res) {
      this.plcInfo = res.data
      this.$nextTick(() => {
        console.log('plcInfoGet')
      })
    }.bind(this))
    try {
      // 设备信息查询
      await this.backDevInfoQue()
      // 用户设备权限查询
      this.backUserDevAuthQue()
      // 查询网关串口绑定配置信息
      this.backSerialBindQue()
      // 查询onenet上设备的状态信息，离线还是在线
      await this.querydevicestate()
    } catch (err) {
      console.log(err)
    }
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    //
    // ****************按键对应的方法函数***********************
    //
    // 打开设备管理对话框，进行相关参数的配置
    deviceSetInitBt: function () {
      this.formInline.com = 'com1'
      // 根据参数判断是否显示配置框
      if (!this.serialBindStatueQue(this.formInline.com)) {
        this.connectRadio = 0
      } else {
        this.connectRadio = 1
      }
      // 参数加入
      // 设备参数填充
      this.serialParamInfoLoad()
      // 默认通讯参数加入
      this.communicationInfoLoad()
      // 默认参数选择
      this.dialogFormVisible = true
      console.log('deviceSetInitBt')
    },
    // 切换串口事件，自动切换不同的参数内容
    serialPortChangeEvent: function () {
      console.log('PortChange')
      // 参数加入
      // 设备参数填充
      this.serialParamInfoLoad()
      // 默认通讯参数加入
      this.communicationInfoLoad()
      if (this.serialBindStatueQue(this.formInline.com)) {
        this.connectRadio = 1
        this.openorclose = true
      } else {
        this.connectRadio = 0
        this.openorclose = false
      }
    },
    // 切换制造厂商，自动切换不同的设备类型和设备别名
    deviceTypeChangeEvent: function () {
      this.bindDeviceNameParamInit(this.formInline.bindDeviceType)
      this.formInline.bindDeviceName = this.bindDeviceNameDataOption[0].value
      this.formInline.bindDeviceNickName = this.bindDeviceNameDataOption[0].value
      // 默认通讯参数加入
      this.communicationInfoLoad()
    },
    // 数据位改变，自动切换校验位内容
    dataBitchangeEvent: function () {
      if (this.formInline.dataLength === 7) {
        this.parityCheckParamInit2()
      }
      if (this.formInline.dataLength === 8) {
        this.parityCheckParamInit3()
      }
      this.formInline.parityCheck = '偶校验'
    },
    // 选中行进行数据透传
    handleContent: function () {
      this.dialogFormVisible = true
      console.log('handleContent')
    },
    // 选中行进行参数编辑
    SerialBindSelectedEditBt: function (index, row) {
      console.log(index)
      console.log(row)
      this.formInline.com = row.com
      // 根据参数判断是否显示配置框
      if (!this.serialBindStatueQue(this.formInline.com)) {
        this.connectRadio = 0
      } else {
        this.connectRadio = 1
      }
      // 参数加入
      // 设备参数填充
      this.serialParamInfoLoad()
      // 默认通讯参数加入
      this.communicationInfoLoad()
      // 默认参数选择
      this.dialogFormVisible = true
    },
    // 确认当前页面串口参数配置
    backSerialBindBt: async function () {
      // 重名检查
      if (this.serialNickNameCheck(this.formInline.com, this.formInline.bindDeviceNickName)) {
        this.notificationInfo('错误提示：', '设备别名不能重复')
        return
      }
      // 非空检查
      if (this.formInline.bindDeviceNickName === '') {
        this.notificationInfo('错误提示：', '设备别名不能为空')
        return
      }
      this.serialSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      // 查询onenet上设备的状态信息，离线还是在线
      await this.querydevicestate()
        .catch(function (err) {
          console.log(err)
        })
      if (this.param.online === 0) {
        this.notificationInfo('错误提示：', '设备不在线，无法配置')
        this.serialSetLoading.close()
        return
      }
      this.serialSetLoading.close()
      if (this.connectRadio === 1) {
        this.param.com = this.formInline.com
        this.param.bindDeviceType = this.formInline.bindDeviceType
        this.param.bindDeviceName = this.formInline.bindDeviceName
        this.param.bindDeviceNickName = this.formInline.bindDeviceNickName
        this.param.isBind = 1
        this.param.protocol = this.formInline.protocol
        this.param.communicationType = this.formInline.communicationType
        this.param.baud = this.formInline.baud
        this.param.dataLength = this.formInline.dataLength
        this.param.stopLength = this.formInline.stopLength
        this.param.parityCheck = this.formInline.parityCheck
        // 修改网关串口绑定配置信息
        this.backSerialBindEdit()
      } else {
        this.param.com = this.formInline.com
        this.param.isBind = 0
        // 删除网关串口绑定配置信息
        this.backSerialBindDel()
      }
      this.dialogFormVisible = false
    },
    //
    // ****************API方法调用***********************
    //
    // 设备信息查询
    backDevInfoQue: function () {
      return new Promise(function (resolve, reject) {
        back.devInfoQue(this.param).then(function (response) {
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            resolve()
          }
          this.param.apiKey = response.data[0].apiKey
          this.param.deviceId = response.data[0].deviceId
          this.param.deviceName = response.data[0].title
          this.param.location = response.data[0].location
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 用户设备权限查询
    backUserDevAuthQue: function () {
      back.userDevAuthQue(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.param.auth = 4
        } else {
          this.param.auth = response.data[0].auth
        }
      }.bind(this))
    },
    // 查询网关串口绑定配置信息
    backSerialBindQue: function () {
      back.serialInfoQue(this.param).then(function (response) {
        console.log(response)
        // 存储所有的串口绑定信息
        this.serialConnectInfoStroge(response.data)
        // 存储绑定本地信息(列表显示)
        this.serialTableInfoStroge(response.data)
      }.bind(this))
    },
    // 修改网关串口绑定配置信息
    backSerialBindEdit: function () {
      this.serialSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      back.serialInfoMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
        }
        this.serialSetLoading.close()
        // 查询网关串口绑定配置信息
        this.backSerialBindQue()
      }.bind(this)).catch(function (response) {
        this.serialSetLoading.close()
      })
    },
    // 删除网关串口绑定配置信息
    backSerialBindDel: function () {
      this.serialSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      back.serialInfoDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
        }
        this.serialSetLoading.close()
        // 查询网关串口绑定配置信息
        this.backSerialBindQue()
      }.bind(this)).catch(function (response) {
        this.serialSetLoading.close()
      })
    },
    // 查询设备的状态:在线离线(精确查询单个设备)
    querydevicestate: async function () {
      return new Promise(function (resolve, reject) {
        // onenet.devquery
        onenet.onenetDevSingleQue(this.param).then(function (response) {
          // console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示：', response.error)
          }
          if (!response.data.online) {
            this.param.online = 0
          } else {
            this.param.online = 1
          }
          console.log('OKque')
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    //
    // ****************方法函数中调用的子方法***********************
    //
    // 存储所有的串口绑定信息
    serialConnectInfoStroge: function (Info) {
      console.log(Info)
      this.serialInfoData = Info
    },
    // 存储绑定本地信息(列表显示)
    serialTableInfoStroge: function (Info) {
      console.log(Info)
      let serialTableData = []
      for (let i = 0; i < Info.length; i++) {
        if (Info[i].isBind === 1) {
          let obj = {}
          obj.com = Info[i].com
          obj.name = Info[i].bindDeviceNickName
          obj.device = Info[i].bindDeviceName
          obj.communication = Info[i].communicationType
          serialTableData.push(obj)
        }
      }
      this.tableData = serialTableData
    },
    // 串口配置参数加入
    serialParamInfoLoad: function () {
      // 根据当前串口号获取串口的绑定状态
      if (this.serialBindStatueQue(this.formInline.com)) {
        // 绑定的设备厂家
        this.bindDeviceTypeParamInit()
        // 根据当前串口号获取串口的数据
        let serialInfo = this.serialInfoQue(this.formInline.com)
        this.formInline.bindDeviceType = serialInfo.bindDeviceType
        // 绑定的设备名称
        this.bindDeviceNameParamInit(this.formInline.bindDeviceType)
        this.formInline.bindDeviceName = serialInfo.bindDeviceName
        this.formInline.bindDeviceNickName = serialInfo.bindDeviceNickName
      } else {
        // 串口配置默认参数加入
        this.serialDefaultParamInfoLoad()
      }
    },
    // 根据当前串口号获取串口的绑定状态
    // 若已绑定，则返回true，否则返回false
    serialBindStatueQue: function (com) {
      for (let i = 0; i < this.serialInfoData.length; i++) {
        if (this.serialInfoData[i].com === com) {
          if (this.serialInfoData[i].isBind === 1) {
            return true
          }
        }
      }
      return false
    },
    // 根据当前串口号获取串口的数据
    serialInfoQue: function (com) {
      for (let i = 0; i < this.serialInfoData.length; i++) {
        if (this.serialInfoData[i].com === com) {
          return this.serialInfoData[i]
        }
      }
      return false
    },
    // 根据当前设备昵称判断是否昵称重复
    // 重复返回true，不重复返回false
    serialNickNameCheck: function (com, NickName) {
      for (let i = 0; i < this.serialInfoData.length; i++) {
        if (this.serialInfoData[i].bindDeviceNickName !== undefined) {
          if (this.serialInfoData[i].com !== com) {
            if (this.serialInfoData[i].bindDeviceNickName === NickName) {
              return true
            }
          }
        }
      }
      return false
    },
    // 串口配置默认参数加入
    serialDefaultParamInfoLoad: function () {
      // 绑定的设备厂家
      this.bindDeviceTypeParamInit()
      this.formInline.bindDeviceType = 'DELTA'
      // 绑定的设备名称
      this.bindDeviceNameParamInit(this.formInline.bindDeviceType)
      this.formInline.bindDeviceName = this.bindDeviceNameDataOption[0].value
      this.formInline.bindDeviceNickName = this.bindDeviceNameDataOption[0].value
    },
    // 通讯参数加入
    communicationInfoLoad: function () {
      // 根据当前串口号获取串口的绑定状态
      if (this.serialBindStatueQue(this.formInline.com)) {
        // 默认通讯参数加入
        this.communicationDefaultParamInfoLoad()
        // 根据当前串口号获取串口的数据
        let serialInfo = this.serialInfoQue(this.formInline.com)
        if (serialInfo.dataLength === 8) {
          this.parityCheckParamInit3()
        } else {
          this.parityCheckParamInit2()
        }
        this.communicationParamSet(serialInfo.communicationType, serialInfo.baud, serialInfo.dataLength, serialInfo.stopLength, serialInfo.parityCheck, serialInfo.protocol)
      } else {
        // 默认通讯参数加入
        this.communicationDefaultParamInfoLoad()
        // 设置通讯配置参数数据
        if (this.formInline.com === 'com1') {
          this.communicationParamSet('RS485', 9600, 7, 1, '偶校验', 'ASCII')
        } else if (this.formInline.com === 'com2') {
          this.communicationParamSet('RS232', 9600, 7, 1, '偶校验', 'ASCII')
        }
        // MODBUS设备通信参数固定配置
        if (this.formInline.bindDeviceType === 'MODBUS') {
          this.parityCheckParamInit3()
          if (this.formInline.com === 'com1') {
            this.communicationParamSet('RS485', 9600, 8, 1, '无校验', 'RTU')
          } else if (this.formInline.com === 'com2') {
            this.communicationParamSet('RS232', 9600, 8, 1, '无校验', 'RTU')
          }
        }
      }
    },
    // 恢复默认通讯参数
    communicationdefaultSet: function () {
      this.communicationDefaultParamInfoLoad()
      // 设置通讯配置参数数据
      if (this.formInline.com === 'com1') {
        this.communicationParamSet('RS485', 9600, 7, 1, '偶校验', 'ASCII')
      } else if (this.formInline.com === 'com2') {
        this.communicationParamSet('RS232', 9600, 7, 1, '偶校验', 'ASCII')
      }
    },
    // 默认通讯参数加入
    communicationDefaultParamInfoLoad: function () {
      console.log('参数信息加入')
      if (this.formInline.com === 'com1') {
        this.communicationTypeParamInit('RS485')
      } else if (this.formInline.com === 'com2') {
        this.communicationTypeParamInit('RS232')
      }
      this.baudParamInit()
      this.dataLengthParamInit()
      this.stopLengthParamInit()
      this.parityCheckParamInit2()
    },
    // 绑定的设备厂家
    bindDeviceTypeParamInit: function () {
      this.bindDeviceTypeDataOption = [{
        label: 'DELTA',
        value: 'DELTA'
      }, {
        label: 'MODBUS',
        value: 'MODBUS'
      }]
    },
    // 绑定的设备名称
    bindDeviceNameParamInit: function (bindDeviceType) {
      let NameDataOption = []
      if (bindDeviceType === 'MODBUS') {
        let obj = {}
        obj.label = 'MODBUS'
        obj.value = 'MODBUS'
        NameDataOption[0] = obj
      } else {
        let devlist = plcRegister.plcDeviceNameQue(bindDeviceType, this.plcInfo)
        for (let i = 0; i < devlist.length; i++) {
          let option = {}
          option.label = devlist[i].name
          option.value = devlist[i].name
          NameDataOption[i] = option
        }
      }
      console.log(NameDataOption)
      this.bindDeviceNameDataOption = NameDataOption
    },
    // 通讯类型，485，232等
    communicationTypeParamInit: function (communicationType) {
      this.communicationTypeDataOption = [{
        label: communicationType,
        value: communicationType
      }]
    },
    // 波特率
    baudParamInit: function () {
      this.baudDataOption = [{
        label: '4800',
        value: 4800
      }, {
        label: '9600',
        value: 9600
      }, {
        label: '19200',
        value: 19200
      }, {
        label: '38400',
        value: 38400
      }, {
        label: '57600',
        value: 57600
      }, {
        label: '115200',
        value: 115200
      }]
    },
    // 数据域长度
    dataLengthParamInit: function () {
      this.dataLengthDataOption = [{
        label: '7',
        value: 7
      }, {
        label: '8',
        value: 8
      }]
    },
    // 停止位长度
    stopLengthParamInit: function () {
      this.stopLengthDataOption = [{
        label: '1',
        value: 1
      }, {
        label: '2',
        value: 2
      }]
    },
    // 奇偶校验方式1，数据位7，对应两个校验方式
    parityCheckParamInit2: function () {
      this.parityCheckDataOption = [{
        label: '偶校验',
        value: '偶校验'
      }, {
        label: '奇校验',
        value: '奇校验'
      }]
    },
    // 奇偶校验方式2，数据位8，对应三个校验方式
    parityCheckParamInit3: function () {
      this.parityCheckDataOption = [{
        label: '无校验',
        value: '无校验'
      }, {
        label: '偶校验',
        value: '偶校验'
      }, {
        label: '奇校验',
        value: '奇校验'
      }]
    },
    // 表单通信方式配置
    communicationParamSet: function (communicationType, baud, dataLength, stopLength, parityCheck, protocol) {
      this.formInline.communicationType = communicationType
      this.formInline.baud = baud
      this.formInline.dataLength = dataLength
      this.formInline.stopLength = stopLength
      this.formInline.parityCheck = parityCheck
      this.formInline.protocol = protocol
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.download {
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.downloadmain {
  padding: 0;
  overflow-x: hidden;
  height: 70%;
}
.el-main {
  padding: 0;
  flex: 1;
}
.el-footer {
  bottom:0px;
  left: 0px;
  background-color: #FFFFFF;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.adduser {
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.dialog-footer {
  float: right;
}
.deviceset {
  width: 700px;
  height: 350px;
}
.line {
  margin-bottom: 22px;
}
</style>
