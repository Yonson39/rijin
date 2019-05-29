<template>
  <el-container>
    <div class="monitorgroup">
      <el-main class="devicegroupmain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="monitorGroupInfo"
          border
          style="width: 100%;"
          >
          <el-table-column
            fixed
            prop="index"
            label="序号"
            header-align="center"
            min-width="8%">
          </el-table-column>
          <el-table-column
            fixed
            prop="devOnline"
            label="状态"
            header-align="center"
            min-width="8%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.promptInfo"  placement="right">
                <el-button type="text" :icon="(scope.row.devOnline === 1) ? 'el-icon-circle-check': 'el-icon-remove'"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            fixed
            prop="name"
            label="设备名称"
            header-align="center"
            min-width="30%">
          </el-table-column>
          <el-table-column
            prop="installTime"
            label="安装时间"
            header-align="center"
            min-width="20%"
            format="yyyy-MM-dd">
          </el-table-column>
          <el-table-column
            prop="devStation"
            label="站号"
            header-align="center"
            min-width="8%">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            header-align="center"
            min-width="30%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer class="bottomfooter" height="60px">
        <div class="addgroup">
          <el-button type="success" icon="el-icon-circle-plus-outline" @click="monitorGroupAddBt">添加设备</el-button>
          
          <el-dialog title="添加新设备" :visible.sync="diaShow" @closed="diaClose" width="740px" center>
            <el-form ref="form" :model="form" label-width="90px" :rules="rules" size="medium">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备名" prop="name">
                    <el-input v-model="form.name" placeholder="填写设备名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="安装日期" required>
                    <el-date-picker
                      class="timePicker"
                      v-model="form.installTime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="查询时间(s)">
                    <el-input-number v-model="form.queryTime" controls-position="right" :min="0" :max="5000"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="连接设备">
                    <el-select v-model="form.linkDevSel" @change="changeLinkDev" placeholder="选择连接设备">
                      <el-option
                        v-for="item in connectDevTypeInfo"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 根据连接设备显示不同表单信息部分 -->
              <el-row>
                <el-col :span="12">
                  <el-form-item label="设备类型">
                    <el-select v-model="form.devTypeSelected" @change="changeDevType" placeholder="选择设备类型">
                      <el-option v-for="item in devTypeOpition" :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="CRC校验" v-show="form.localShow">
                    <el-input v-model="form.crcCheck" readonly></el-input>
                  </el-form-item>
                  <el-form-item label="CRC校验" v-show="form.modbusShow">
                    <el-select v-model="form.crcCheckSelected" placeholder="选择CRC校验">
                      <el-option v-for="item in crcCheckOpition" :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <!-- 情形一 本地设备-->
                  <el-form-item label="传感器" v-show="form.localShow">
                    <el-select v-model="form.sensorSelected" placeholder="选择传感器">
                      <el-option v-for="item in sensorOpition" :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- 情形二 modbus设备-->
                  <el-form-item label="设备站号" v-show="form.modbusShow">
                    <el-input-number v-model="form.devStation" controls-position="right" :min="0" :max="253"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="路数选择" v-show="form.simDevWayShow">
                    <el-input-number v-model="form.interfaceNumber" controls-position="right" :min="simDevWayRange.min" :max="simDevWayRange.max"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="死区设置" v-show="form.deadAreaTypeShow">
                    <el-input-number v-model="form.deadArea" controls-position="right" :min="0" :max="5000"></el-input-number>
                    <span>当值在±{{form.deadArea}}范围内波动时，不上报数据以节省流量</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="diaShow = false">取消</el-button>
              <el-button type="primary" @click="formDiaConfirm('form')">确定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import { back } from 'api'
import { character } from '@/components/config/Character'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'monitorGroupSetDiv',
  data () {
    // ***********表单输入规则校验***********
    // 校验设备名
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('设备名不能为空'))
      } else if (value.length > 16) {
        callback(new Error('设备名长度不能大于16位'))
      } else {
        callback()
      }
    }
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'name': '',
        'type': '',
        'station': '',
        'crc': '',
        'queryTime': '',
        'deadArea': ''
      },
      // 存储监控点分组信息
      monitorGroupInfo: [
        {
          datapointGroupUid: '',
          datapointGroupId: '',
          index: '', // 设备序号
          devOnline: '', // 设备状态
          name: '',
          installTime: '',
          devMac: '',
          devStation: 80,
          devStreams: '',
          devType: ''
        }
      ],
      // 存储设备对话框表单
      form: {
        index: 1,
        name: '',
        // account: '', // 无语
        installTime: '',
        queryTime: 10,
        linkDevSel: '',
        devTypeSelected: '',
        interfaceNumber: 1,
        sensorSelected: '',
        deadArea: 10,
        crcCheck: '低位前',
        crcCheckSelected: '',       // crc校验选择
        devStation: '',          // 设备站号
        localShow: true,              // 选择local设备显示的表单面板
        modbusShow: false,            // 选择modbus设备显示的表单面板
        simDevWayShow: false,          // 模拟设备路数显示标志位
        deadAreaTypeShow: true      // 死区设置显示标志位
      },
      // 深拷贝this.form到新对象this.formOld,用于判断表单内容是否修改
      formOld: {},
      // 存储可以连接的设备列表（COM串口配置）
      connectDevTypeInfo: [
        {
          name: '本地设备',               // 设备名（昵称）
          value: 'local'                 // 设备名（昵称）
        },
        {
          name: 'modbus设备',
          value: 'modbus'
        }
      ],
      // 存储不同连接设备的设备类型列表
      devTypeOpition: [
        { label: '模拟设备', value: 0 },
        { label: '数字设备', value: 1 }
      ],
      // 存储可供选择的模拟设备路数范围
      simDevWayRange: {
        min: 1,
        max: 5
      },
      // 存储可供选择的传感器列表
      sensorOpition: [
        { label: '温度传感器', value: 11 },
        { label: '压力变送器', value: 12 },
        { label: '噪声变送器', value: 13 }
      ],
      // 存储可供选择的crc校验列表
      crcCheckOpition: [
        { label: '低位前', value: 0 },
        { label: '高位前', value: 1 }
      ],
      formAddOrModify: 0,        // 0-添加 1-编辑
      diaShow: false,
      operationName: '', // 操作名称
      // 表单验证
      rules: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ]
      },
      loadingFlag: false     // 表格加载图标
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.userId = sessionGetStore('userId')
    // 修改设备back关键参数 ??????
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
  },
  mounted: function () {
    // 用户网关权限查询

    // 网关信息查询，获取onenet调用关键参数，deviceId,apikey

    // // 获取网关下设备列表，返回设备name,mac,station
    // this.backNetDevListQue()
    // 获取网关下监控点列表
    this.loadingFlag = true
    this.backNetMoniterListQue()
  },
  methods: {
    // 关闭对话框自动调用事件
    diaClose: function () {
      console.log('关闭对话框自动调用事件')
      // 清除表单验证条件和输入内容 // 注意只能清除填写类，不能清除show，下拉框，预定值之类什么的
      this.$refs.form.resetFields()
    },
    // 添加设备小组-打开对话框-初始化表单
    monitorGroupAddBt: function () {
      this.formAddOrModify = 0
      this.diaShow = true
      this.operationName = '添加设备'
      // 给表单设定初值,手动填充 */*不需要了，因为我们有了resetFields()方法
      this.form.name = ''
      this.form.installTime = character.getCurrentTime()
      this.form.queryTime = 10
      this.form.localShow = true
      this.form.modbusShow = false
      this.form.linkDevSel = 'local'
      this.form.devTypeSelected = 0
      this.form.simDevWayShow = true
      this.form.deadAreaTypeShow = true
      this.form.interfaceNumber = 1
      this.form.sensorSelected = 11
      this.form.crcCheck = '低位前'
      this.form.crcCheckSelected = ''
      this.devTypeOpition = [
        { label: '模拟设备', value: 0 },
        { label: '数字设备', value: 1 }
      ]
      this.sensorOpition = [
        { label: '温度传感器', value: 11 },
        { label: '压力变送器', value: 12 },
        { label: '噪声变送器', value: 13 }
      ]
    },
    // 编辑设备组信息-打开对话框-初始化表单
    handleEdit: function (index, row) {
      this.formAddOrModify = 1
      this.diaShow = true
      this.operationName = '编辑设备'
      console.log('编辑设备')
      console.log(index)
      console.log(row)
      // this.param.isUpdate = 1 // 表单内容是否修改
      this.param.mac = row.devMac
      /* 
        back获取当前设备详细信息
        所需param: mac
      */
      console.log(this.form)
      // 用户判断站号。名称是否重复的索引值
      this.form.index = row.index
      this.backDevQue()
    },
    // 删除设备
    handleDelete: function (index, row) {
      this.loadingFlag = true
      console.log('删除设备')
      console.log(index)
      console.log(row)
      let isDelFlag = true
      this.param.mac = row.devMac
      // 1.查询设备详情 2.获取到interfaceNumber 3.在前两部的基础上back删除设备
      this.backDevQue(isDelFlag)
    },
    // 添加/编辑设备信息确定按键-back
    formDiaConfirm: function (formName) {
      // 判断表单校验是否成功
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('正确提交')
          console.log(this.form)
          // 判断当前输入的监控点名称是否重复
          if (this.repeatNameCheck(this.form)) {
            this.notificationInfo('错误提示：', '监控点名称不可重复')
            return
          }
          // 判断当前添加的监控点是否与已有的监控点参数相同（不允许相同的监控点）
          if (this.repeatFormParamCheck(this.form)) {
            this.notificationInfo('错误提示：', '监控点参数与已有监控点重复')
            return
          }
          // 配置param参数 缺连接设备参数
          this.param.name = this.form.name
          this.param.installTime = this.form.installTime
          this.param.type =  this.form.linkDevSel === 'local' ? this.form.sensorSelected : this.form.devTypeSelected
          this.param.station =  this.form.linkDevSel === 'local' ? 254 : Number(this.form.devStation)
          // this.param.station = Number(this.form.devStation) // 传感器 or 设备站号
          this.param.crc = this.form.linkDevSel === 'local' ?  0 : this.form.crcCheckSelected // 需要判断本地设备or modbus设备
          this.param.queryTime = Number(this.form.queryTime)
          this.param.interfaceNumber = Number(this.form.interfaceNumber)
          this.param.deadArea = Number(this.form.deadArea)
          if (this.formAddOrModify === 0) {
            this.backDevAdd()
          } else if (this.formAddOrModify === 1) {
            // 判断表单信息是否修改 即isupdata是否为1 form与之前查过的设备详情进行比对
            // this.checkFormMod(this.form)
            console.log(this.isObjectValueEqual(this.form, this.formOld)) // 暂时永远位true
            if (!this.isObjectValueEqual(this.form, this.formOld)) {
              this.param.isUpdate = 1
              this.backDevMod()
            } else {
              this.param.isUpdate = 0
            }
          }
          this.diaShow = false // 无语，就是因为这个导致form验证拿不到name,因为对话框一关闭就调用清除表单验证/初始化表单验证
          this.loadingFlag = true
        } else {
          console.log('错误提交')
        }
      })
    },
    // 删除选中行的设备
    monitorGroupDelBt: function (index, row) {
      console.log('删除选中行的设备')
    },
    // 连接设备选择改变事件
    changeLinkDev (value) {
      console.log('连接设备选择改变')
      console.log(value)
      console.log(this.form.linkDevSel)
      console.log(this.form.devTypeSelected)
      if (this.form.linkDevSel === 'local') {
        this.form.localShow = true
        this.form.modbusShow = false
        // 表单信息重置
        this.devTypeOpition = [
          { label: '模拟设备', value: 0 },
          { label: '数字设备', value: 1 }
        ]
        this.form.simDevWayShow = true
        // 设定初值
        this.form.devTypeSelected = 0
        this.form.sensorSelected = 11
      } else if (this.form.linkDevSel === 'modbus') {
        this.form.localShow = false
        this.form.modbusShow = true
        this.form.simDevWayShow = false
        // 表单信息重置
        this.devTypeOpition = [
          { label: 'IO模块', value: 3 },
          { label: '变频器', value: 4 },
          { label: '净化器电源', value: 5 },
          { label: '震动传感器', value: 6 },
          { label: '风阀控制转换器', value: 7 }
        ]
        // 设定初值
        this.form.devTypeSelected = 3
        this.form.crcCheckSelected = 0
        this.form.devStation = 1
      }
    },
    // 改变设备类型触发事件-只针对本地设备-决定传感器选项列表
    changeDevType: function (value) {
      console.log('改变设备类型触发事件-只针对本地设备-决定传感器选项列表,是否显示模拟设备路数')
      console.log(value)
      console.log(this.form.devTypeSelected)
      if (this.form.devTypeSelected === 0) { // 模拟设备
        this.form.simDevWayShow = true
        this.sensorOpition = [
          { label: '温度传感器', value: 11 },
          { label: '压力变送器', value: 12 },
          { label: '噪声变送器', value: 13 }
        ]
        // 设定初值
        this.form.sensorSelected = 11
      } else if (this.form.devTypeSelected === 1) { // 数字设备
        this.form.simDevWayShow = false
        this.sensorOpition = [
          { label: '转速传感器', value: 2 }
        ]
        // 设定初值
        this.form.sensorSelected = 2
      } else if (this.form.devTypeSelected === 7) { // 风阀控制转换器
        // this.form.simDevWayShow = true
        this.form.simDevWayShow = false
        this.simDevWayRange = { min: 1, max: 4 }
      } else {
        this.form.simDevWayShow = false
      }
    },
    // 根据返回type 设置表单连接设备，设备类型如何显示
    linkDevAndDevTypeQue: function (type) {
      console.log(type)
      console.log(this.connectDevTypeInfo)
      console.log(this.form.linkDevSel)
      console.log(this.devTypeOpition)
      console.log(this.form.devTypeSelected)
      console.log(this.sensorOpition)
      console.log(this.form.sensorSelected)
      // data数据预置，否则选择框不能够根据value值来动态显示对应label
      if (type === 11 || type === 12 || type === 13 || type === 2) {
        this.devTypeOpition = [
          { label: '模拟设备', value: 0 },
          { label: '数字设备', value: 1 }
        ]
        this.form.localShow = true
        this.form.modbusShow = false
      } else {
        this.devTypeOpition = [
          { label: 'IO模块', value: 3 },
          { label: '变频器', value: 4 },
          { label: '净化器电源', value: 5 },
          { label: '震动传感器', value: 6 },
          { label: '风阀控制转换器', value: 7 }
        ]
        this.form.localShow = false
        this.form.modbusShow = true
      }
      // 根据type 判断选择框显示标志位value值，从而得到对应label
      switch (type) {
        case 3:
          this.form.linkDevSel = 'modbus'
          this.form.devTypeSelected = 3
          break
        case 4:
          this.form.linkDevSel = 'modbus'
          this.form.devTypeSelected = 4 // data初始值一定要有value=4对应的对象，否则不能根据value而显示lable
          break
        case 5:
          this.form.linkDevSel = 'modbus'
          this.form.devTypeSelected = 5
          break
        case 6:
          this.form.linkDevSel = 'modbus'
          this.form.devTypeSelected = 6
          break
        case 7:
          this.form.linkDevSel = 'modbus'
          this.form.devTypeSelected = 7
          break
        case 11:
          this.form.linkDevSel = 'local'
          this.form.devTypeSelected = 0
          this.form.sensorSelected = 11
          break
        case 12:
          this.form.linkDevSel = 'local'
          this.form.devTypeSelected = 0
          this.form.sensorSelected = 12
          break
        case 13:
          this.form.linkDevSel = 'local'
          this.form.devTypeSelected = 0
          this.form.sensorSelected = 13
          break
        case 2:
          this.form.linkDevSel = 'local'
          this.form.devTypeSelected = 1
          this.form.sensorSelected = 2
          break
      }
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // // 获取网关下设备列表
    // backNetDevListQue: function () {
    //   back.netDevListQue(this.param).then(function (response) {
    //     console.log('获取网关下设备列表')
    //     console.log(response)
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //       return
    //     }
    //     let data = []
    //     for (let i = 0; i < response.data.length; i++) {
    //       let obj = {}
    //       obj.name = response.data[i].name
          
    //       obj.devMac = response.data[i].mac
    //       obj.devStation = response.data[i].station
    //       obj.devS = response.data[i].station
    //       data[i] = obj
    //     }
    //     this.monitorGroupInfo = data
    //   }.bind(this))
    // },
    // 获取网关下监控点列表，返回监控点信息,streamId
    backNetMoniterListQue: function () {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 存储后台原始数据，方便下次处理
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.index = i + 1
          obj.devOnline = response.data[i].isOnline // back暂无状态
          if (obj.devOnline === 1) {
            obj.promptInfo = '在线'
          } else {
            obj.promptInfo = '离线'
          }
          obj.devMac = response.data[i].mac
          obj.name = response.data[i].name
          obj.installTime = response.data[i].installTime
          obj.devStation = response.data[i].station
          obj.devStreams = response.data[i].streams
          obj.devType = response.data[i].type
          data[i] = obj
        }
        console.log(data)
        this.monitorGroupInfo = data
      }.bind(this))
    },
    // 添加设备
    backDevAdd: function () {
      console.log(this.param)
      back.devAdd(this.param).then(function (response) {
        console.log('添加设备')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
          return
        }
        // 获取网关下监控点列表 返回dev及其streams
        this.backNetMoniterListQue()
      }.bind(this))
    },
    // 编辑设备
    backDevMod: function () {
      console.log(this.param)
      back.devMod(this.param).then(function (response) {
        console.log('编辑设备')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
          return
        }
        // 获取网关下监控点列表 返回dev及其streams
        this.backNetMoniterListQue()
      }.bind(this))
    },
    // 删除设备
    backDevDel: function () {
      back.devDel(this.param).then(function (response) {
        console.log('删除设备')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
          return
        }
        // 获取网关下监控点列表 返回dev及其streams
        this.backNetMoniterListQue()
      }.bind(this))
    },
    // 查询设备信息 单个设备查询
    backDevQue: function (isDelFlag) {
      back.devQue(this.param).then(function (response) {
        console.log('查询设备信息 单个设备查询')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
          return
        }
        this.form.devMac = response.data.mac
        this.form.name = response.data.name
        this.form.installTime = response.data.installTime
        this.form.devStation = response.data.station
        this.form.queryTime = response.data.queryTime
        this.form.type = response.data.type
        this.linkDevAndDevTypeQue(this.form.type) // 根据返回type 设置表单连接设备，设备类型如何显示
        this.form.deadArea = response.data.deadArea
        this.form.interfaceNumber = response.data.interfaceNumber
        // interfaceNumber移入this.moniterPointGroupInfo 用于比较是否相同

        // 若是本地设备的转速设备
        if (response.data.type === 2) {
          this.form.localShow = true
          this.form.modbusShow = false
          this.form.simDevWayShow = false
          this.form.deadAreaTypeShow = true
          this.sensorOpition = [
            { label: '转速传感器', value: 2 }
          ]
        } else if (response.data.type === 11 || response.data.type === 12 || response.data.type === 13) { // 若是本地设备的温度,风压,噪声
          this.form.localShow = true
          this.form.modbusShow = false
          this.form.simDevWayShow = true
          this.form.deadAreaTypeShow = true
          this.sensorOpition = [
            { label: '温度传感器', value: 11 },
            { label: '压力变送器', value: 12 },
            { label: '噪声变送器', value: 13 }
          ]
        } else { // 若是modbus设备
          this.form.localShow = false
          this.form.modbusShow = true
          this.form.simDevWayShow = false
          this.form.deadAreaTypeShow = true
        }
        if (response.data.crc === 0) {
          this.form.crcCheck = '低位前'
        }
        // this.form.crcCheck = response.data.crc
        this.form.crcCheckSelected = response.data.crc
        // 深拷贝this.form到新对象this.formOld,用于判断表单内容是否修改
        this.formOld = JSON.parse(JSON.stringify(this.form))
        // 如果是删除设备，则先查询当前interfaceNumber在进行后台删除
        if (isDelFlag) {
          this.param.interfaceNumber = response.data.interfaceNumber
          console.log(this.param.interfaceNumber)
          this.backDevDel()
        }
      }.bind(this))
    },
    /*
    **  **********  辅助方法函数  **********
    */
    // ...判断当前输入的监控点名称是否重复
    repeatNameCheck: function (form) {
      for (let i = 0; i < this.monitorGroupInfo.length; i++) {
        if (this.monitorGroupInfo[i].name === form.monitorName) {
          return true
        }
      }
      // 若是编辑设备，允许监控点名称等于当前监控点名称
      if (this.formAddOrModify === 1) {
        if (form.monitorName === this.monitorGroupInfo[form.index - 1].name) {
          return false
        }
      }
      return false
    },
    // ...判断当前添加的监控点是否与已有的监控点参数相同（不允许相同的监控点）
    repeatFormParamCheck: function (formData) {
      console.log(formData)
      console.log(this.monitorGroupInfo)
      // debugger
      let paramCheck = false
      for (let i = 0; i < this.monitorGroupInfo.length; i++) {
        // // 若为模拟量，则判断'路数'是否相同
        // if (formData.devTypeSelected === 0) {
        //   if (formData.interfaceNumber === this.monitorGroupInfo[i].interfaceNumber) {
        //     paramCheck = true
        //   }
        // }
        // 若为modbus设备，则判断站号是否相同
        if (formData.modbusShow) {
          if (formData.devStation === this.monitorGroupInfo[i].devStation) {
            paramCheck = true
          }
        }
      }
      // 若为编辑设备，路数相同/站号相同，不认为重复
      if (this.formAddOrModify === 1) {
        // // 路数相同
        // if (formData.devTypeSelected === 0) {
        //   if (formData.interfaceNumber === this.monitorGroupInfo[formData.index - 1].interfaceNumber) {
        //     paramCheck = false
        //   }
        // }
        // 站号相同
        if (formData.modbusShow) {
          if (formData.devStation === this.monitorGroupInfo[formData.index - 1].devStation) {
            paramCheck = false
          }
        }
      }
      return paramCheck
    },
    // ...判断表单信息是否修改 当前form与之前查到的设备详情进行比对
    checkFormMod: function (form) {
      console.log('hahhahaha')
      console.log(form)
      console.log(this.formOld)
      form.installTime = '2019-10-10 11:11:11'
      this.formOld.installTime = '2019-10-10 11:11:11'
      console.log(form)
      console.log(this.formOld)
      let checkParam = this.isObjectValueEqual(form, this.formOld)
      console.log(checkParam)
    },
    // 判断两个对象是否相等,相等为true,不等为false
    isObjectValueEqual: function (a, b) {
      var aProps = Object.getOwnPropertyNames(a) // 纯object没有object.lentgh属性
      var bProps = Object.getOwnPropertyNames(b)
      // var aProps = a
      // var bProps = b
      if (aProps.length !== bProps.length) {
        return false
      }
      console.log(aProps.length)
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i]
        if (a[propName] !== b[propName]) {
          console.log(i)
          console.log(propName)
          return false
        }
      }
      return true
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
.monitorgroup {
  width: 100%;
  bottom: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.devicegroupmain {
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
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
.addgroup {
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 2px;
  text-align: left;
}
.monitorgroup >>> .el-icon-circle-check {
  color: green;
  font-size: 18px;
}
.monitorgroup >>> .el-icon-remove {
  color: red;
  font-size: 18px;
}
</style>
