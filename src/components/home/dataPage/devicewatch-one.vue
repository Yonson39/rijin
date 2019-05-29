<template>
  <el-container>
    <div class="deviceonepage">
      <el-main class="deviceonemain">
        <!--监控点小组选择和组内查询-->
        <el-row :gutter="20" class="thirdtitle">
          <el-col :span="4">
            <div class="grid-content bg-purple span-right span-top">
              <span>设备选择：</span>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple span-left">
              <el-select v-model="pointGroupSelected" placeholder="全部" @change="devSelChange">
                <el-option
                  v-for="item in pointGroupInfo"
                  :key="item.id"
                  :label="item.name"
                  :value="item.mac"
                ></el-option>
              </el-select>
              <el-button type="primary" size="medium" @click="moniterBtn">监控查询</el-button>
            </div>
          </el-col>
        </el-row>

        <p></p>

        <!--小组监控点信息表格-->
        <!-- <el-table :data="monitorTableData" border class="spHeight" :height="tableHeight"> -->
        <el-table :data="monitorTableData" border class="spHeight">
          <el-table-column prop="devName" label="设备名称" header-align="center" min-width="8%"></el-table-column>
          <el-table-column prop="moniterName" label="监控点名称" header-align="center" min-width="13%"></el-table-column>
          <el-table-column prop="display" label="数值" header-align="center" min-width="10%"></el-table-column>
          <el-table-column label="控制" header-align="center" min-width="10%">
            <template class="switch" slot-scope="scope">
              <el-button type="text" size="medium" icon="el-icon-edit-outline" v-show="scope.row.editShowFlag" @click="changevalue(scope.$index, scope.row)">修改</el-button>
              <el-switch v-model="scope.row.switchFlag" :active-value="true" :inactive-value="false" v-show="scope.row.switchShowFlag" @change="changeswitch(scope.$index, scope.row)"></el-switch>
              <el-button type="text" size="medium" icon="el-icon-circle-plus" v-show="scope.row.isFFShowFlag" @click="changenumber(scope.$index, scope.row)"></el-button>
              <el-button type="text" size="medium" icon="el-icon-view" v-show="scope.row.readOnlyShowFlag">只读</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" header-align="center" min-width="16%">
            <template>
              <el-button type="text" size="small" icon="el-icon-edit">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <p></p>
    </div>
  </el-container>
</template>

<script>
// 组名称 === 设备(各种传感器)；监控点名称 === 监控点
import { back, onenet } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import { character } from '@/components/config/Character'

export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': ''
      },
      // 当前选择的监控点分组的ID号（小组UID号（用于后台））
      pointGroupSelected: '',
      // 监控点分组存储列表(用于分组选择)
      pointGroupInfo: [
        {
          mac: '',          // 组UID号（用于后台）
          name: ''          // 组名
        }
      ],
      // 实际存储当前页面中设备的某一小组的所有监控点信息（表格信息）
      monitorTableData: [
        {
          status: '',                    // 标识当前监控点是在线还是离线
          devName: '',                   // 设备名称
          moniterName: '',               // 监控点名称
          display: '',                   // 监控点显示内容
          description: '',               // 监控点描述
          editShowFlag: false,           // 16，32位控制图标是否显示
          switchFlag: false,             // 位控制（开关控制）当前是开还是关
          switchShowFlag: false,         // 位控制图标是否显示
          isFF: 1,                      // 置FF数值
          isFFShowFlag: false,           // 置FF图标是否显示
          readOnlyShowFlag: true         // 只读图标是否显示
        }
      ],
      screenHeight: document.body.clientHeight, // 这里是给到了一个默认值(很重要，若没有则)
      // tableHeight: document.body.clientHeight * 0.74,              // 表格高度
      tableHeight: null,              // 表格高度
      onenetQueTimer: null,             // onenet查询定时器
      monitorSetLoading: null,          // 全局Loading标志位
      monitorTableDataCopy: []          // 备份原始监控点表格数据
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.userId = sessionGetStore('userId')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    // // 表格高度自适应
    // this.tableHeight = document.body.clientHeight * 0.74
    // let _this = this
    // setInterval(function () {
    //   _this.tableHeight = document.body.clientHeight * 0.74
    // }, 3000)
  },
  watch: {
    // 监听屏幕高度改变表格高度
    screenHeight (val) {
      console.log('屏幕高度变化')
      this.tableHeight = document.body.clientHeight * 0.74
    }
  },
  mounted: function () {
    // 用户网关权限查询

    // 网关信息查询，获取onenet调用关键参数，deviceId,apikey

    // 网关在线离线信息查询，配置到param参数中
    this.param.online = sessionGetStore('deviceOnlineNow')
    // 获取网关下监控点列表，返回监控点信息,streamId ->处理显示数据格式 -> 开启定时器定时查询onenet数据
    this.backNetMoniterListQue()
    // 监听屏幕高度
    const that = this
    window.onresize = function () {
      // 方法1：监听变化修改tableHeight
      that.screenHeight = document.body.clientHeight
      console.log(that.screenHeight)
      // // 方法2：直接修改tableHeight
      // that.tableHeight = document.body.clientHeight
      // console.log(that.tableHeight)
    }
  },
  // 生命周期，销毁前
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.onenetQueTimer)
    console.log(this.onenetQueTimer)
    console.log('leave one')
  },
  methods: {
    // 设备下拉框选择改变事件 - 筛选监控点表格显示
    devSelChange: function () {
      // 选择'全部'时
      if (this.pointGroupSelected === 'selAll') {
        this.monitorTableData = this.monitorTableDataCopy
        return
      }
      // 选择'非全部'时
      let data = []
      for (let i = 0; i < this.monitorTableDataCopy.length; i++) {
        if (this.pointGroupSelected === this.monitorTableDataCopy[i].mac) {
          data.push(this.monitorTableDataCopy[i])
        }
      }
      this.monitorTableData = data
      // // 数据流streamID param设置
      // for (let i = 0, lentgh = this.monitorTableData.length; i < length; i++) {
      //   this.param.datastreamId[i] = this.monitorTableData[i].streamId
      // }
    },
    /* 监控查询按钮
       是传deviceId(网关ID)查询该网关下全部的监控点数据流最新数据点之后处理显示
       还是分批次传一批streamId查询所选择的监控点最新数据
    */
    moniterBtn: function () {
      console.log('监控查询')
      if (this.pointGroupSelected === '') {
        return
      }
      // 只在设备在线的情况下查询设备下的最新数据
      if (this.param.online === '在线') {
        // 查询onenet上的最新监控点数据（只返回有数据的监控点的信息）
        this.oneonenetDataRequire()
      }
    },
    /*
    **  **********  监控控制逻辑事件模块  **********
    */
    // 发送命令，修改数据内容
    changeswitch: function (index, row) {
      console.log(index)
      console.log(row)
      // 设备状态等预判断

      this.monitorSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      // param 参数配置 需sn,mac,steamId,value
      this.param.mac = row.mac
      this.param.streamId = row.streamId
      this.param.value = this.sendFlag ? 1 : 0

      // 命令重发存储

      // 通过后台->onenet发送命令(控制设备)
      this.backDevCmd()
      // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息
      //
    },
    // 发送命令，修改数据内容
    changevalue: function (index, row) {
      console.log(index)
      console.log(row)
      console.log(this.param)
      // if (this.param.online === '离线') {
      //   this.notificationInfo('错误提示：', '设备不在线，不可控制')
      //   return
      // }
      // if (this.monitorTableData[index].promptInfo === '条目未下发') {
      //   this.notificationInfo('错误提示：', '条目未下发，不可控制')
      //   return
      // }
      // if (this.monitorTableData[index].promptInfo === '设备已变更') {
      //   this.notificationInfo('错误提示：', '设备已变更，不可控制')
      //   return
      // }
      if (row.type === 7) {
        // 如果设备为风阀，则处理修改对话框的单位为'°'
        this.$prompt('请输入数据, 单位为‘ ° ’', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[.][0-9]{1,6}$)/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          // if (this.monitorTableData[index].decimalBit !== '') {
          //   value = Math.round(Number(value * Math.pow(10, this.monitorTableData[index].decimalBit)))
          // }
          if (Number(value) > 65535) {
            value = '65535'
          }
          /* 
            写value值转化之后发送
          */
          // 输入值为度数，转化为正常值发送给back
          if (row.type === 7) {
            let moniterDataLast = this.moniterDataChange(0, 90, 0, 4095, value)
            value = moniterDataLast
          }
          // if (this.monitorTableData[index].value !== '') {
          //   this.monitorTableData[index].value = value
          // }
          this.monitorSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          // param 参数配置 需sn,mac,steamId,value
          this.param.mac = row.mac
          this.param.streamId = row.streamId
          this.param.value = value
          // 命令重发存储

          // 通过后台->onenet发送命令(控制设备)
          this.backDevCmd()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      } else if (row.type === 11) {
        // 如果设备为温度传感器，则处理修改对话框的单位为'°'
        this.$prompt('请输入数据, 单位为‘ ° ’', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[.][0-9]{1,6}$)/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          // if (this.monitorTableData[index].decimalBit !== '') {
          //   value = Math.round(Number(value * Math.pow(10, this.monitorTableData[index].decimalBit)))
          // }
          if (Number(value) > 65535) {
            value = '65535'
          }
          /* 
            写value值转化之后发送
          */
          // 输入值为度数，转化为正常值发送给back
          if (row.type === 11) {
            let moniterDataLast = this.moniterDataChange(-50, 150, 600, 3000, value)
            value = moniterDataLast
          }
          // if (this.monitorTableData[index].value !== '') {
          //   this.monitorTableData[index].value = value
          // }
          this.monitorSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          // param 参数配置 需sn,mac,steamId,value
          this.param.mac = row.mac
          this.param.streamId = row.streamId
          this.param.value = value
          // 命令重发存储

          // 通过后台->onenet发送命令(控制设备)
          this.backDevCmd()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }  else if (row.type === 12) {
        // 如果设备为压力变送器，则处理修改对话框的单位为'°'
        this.$prompt('请输入数据, 单位为‘ pa ’', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[.][0-9]{1,6}$)/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          // if (this.monitorTableData[index].decimalBit !== '') {
          //   value = Math.round(Number(value * Math.pow(10, this.monitorTableData[index].decimalBit)))
          // }
          if (Number(value) > 65535) {
            value = '65535'
          }
          /* 
            写value值转化之后发送
          */
          // 输入值为度数，转化为正常值发送给back
          if (row.type === 12) {
            let moniterDataLast = this.moniterDataChange(0, 5000, 600, 3000, value)
            value = moniterDataLast
          }
          // if (this.monitorTableData[index].value !== '') {
          //   this.monitorTableData[index].value = value
          // }
          this.monitorSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          // param 参数配置 需sn,mac,steamId,value
          this.param.mac = row.mac
          this.param.streamId = row.streamId
          this.param.value = value
          // 命令重发存储

          // 通过后台->onenet发送命令(控制设备)
          this.backDevCmd()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }  else if (row.type === 13) {
        // 如果设备为噪声传感器，则处理修改对话框的单位为'°'
        this.$prompt('请输入数据, 单位为‘ dB ’', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[.][0-9]{1,6}$)/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          // if (this.monitorTableData[index].decimalBit !== '') {
          //   value = Math.round(Number(value * Math.pow(10, this.monitorTableData[index].decimalBit)))
          // }
          if (Number(value) > 65535) {
            value = '65535'
          }
          /* 
            写value值转化之后发送
          */
          // 输入值为度数，转化为正常值发送给back
          if (row.type === 13) {
            let moniterDataLast = this.moniterDataChange(30, 120, 600, 3000, value)
            value = moniterDataLast
          }
          // if (this.monitorTableData[index].value !== '') {
          //   this.monitorTableData[index].value = value
          // }
          this.monitorSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          // param 参数配置 需sn,mac,steamId,value
          this.param.mac = row.mac
          this.param.streamId = row.streamId
          this.param.value = value
          // 命令重发存储

          // 通过后台->onenet发送命令(控制设备)
          this.backDevCmd()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      } else {
        // 非风阀设备，修改对话框无单位
        this.$prompt('请输入数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /(^[0-9]{1,6}$)|(^[0-9]{1,6}[.][0-9]{1,6}$)/,
          inputErrorMessage: '输入格式不正确'
        }).then(({ value }) => {
          // if (this.monitorTableData[index].decimalBit !== '') {
          //   value = Math.round(Number(value * Math.pow(10, this.monitorTableData[index].decimalBit)))
          // }
          if (Number(value) > 65535) {
            value = '65535'
          }
          /* 
            写value值转化之后发送
          */
          // 输入值为度数，转化为正常值发送给back
          if (row.type === 7) {
            let moniterDataLast = this.moniterDataChange(0, 90, 0, 4095, value)
            value = moniterDataLast
          }
          // if (this.monitorTableData[index].value !== '') {
          //   this.monitorTableData[index].value = value
          // }
          this.monitorSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          // param 参数配置 需sn,mac,steamId,value
          this.param.mac = row.mac
          this.param.streamId = row.streamId
          this.param.value = value
          // 命令重发存储

          // 通过后台->onenet发送命令(控制设备)
          this.backDevCmd()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }
    },
    // 发送命令，修改数据内容
    changenumber: function (index, row) {
      console.log(index)
      console.log(row)
      // 设备状态等预判断

      this.monitorSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      // param 参数配置 需sn,mac,steamId,value
      this.param.mac = row.mac
      this.param.streamId = row.streamId
      // this.param.value = row.isFF
      this.param.value = 255
      // 命令重发存储

      // 通过后台->onenet发送命令(控制设备)
      this.backDevCmd()
      // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息
      // 
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // 获取网关下监控点列表，返回监控点信息,streamId
    backNetMoniterListQue: function () {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 将监控点数据存到session以备联动规则所用
        sessionSetStore('moniterPointerList', response.data)
        // 直接将response.data最最原始数据赋值给选择框列表选项
        this.pointGroupInfo = response.data
        // 如果设备列表不为空，则选项列表开头加入一个'全部',
        // * 为什么这会反过来影响response.data
        if (this.pointGroupInfo.length !== 0) {
          let data = [{mac: 'selAll', name: '全部'}]
          this.pointGroupInfo = data.concat(this.pointGroupInfo) // Array.concat()浅拷贝，不会更改原始数组
          // this.pointGroupInfo.unshift(obj) // 深拷贝，会改变原始数组，指针，数组对象的引用
          this.pointGroupSelected = this.pointGroupInfo[0].mac
        }
        // 存储后台原始数据，方便下次处理
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.status = '在线'
          obj.mac = response.data[i].mac
          obj.devName = response.data[i].name
          obj.streams = response.data[i].streams
          obj.type = response.data[i].type
          data[i] = obj
        }
        // 处理监控点表格数据格式数据格式 -> onenet查询
        this.fillMoniterData(data)
      }.bind(this))
    },
    // 给设备发命令
    backDevCmd: function () {
      back.devCmd(this.param).then(function (response) {
        console.log('给设备发命令')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        }
        this.monitorSetLoading.close()
      }.bind(this))
    },
    // 批量查询设备最新数据-查的是当前网关下所有streamId不为Null的数值。
    oneonenetDataRequire: function () {
      onenet.onenetDataRequire(this.param).then(function (response) {
        console.log('onenet批量查询设备最新数据')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
          return
        }
        for (let i = 0; i < response.data.devices[0].datastreams.length; i++) {
          for (let j = 0; j < this.monitorTableData.length; j++) {
            if (response.data.devices[0].datastreams[i].id === this.monitorTableData[j].streamId) {
              if (this.monitorTableData[j].unit === undefined) {
                // 1.若返回的是开关状态位5，则unit为空
                this.monitorTableData[j].display = response.data.devices[0].datastreams[i].value
              } else if (this.monitorTableData[j].type === 7 || this.monitorTableData[j].type === 11 || this.monitorTableData[j].type === 12 || this.monitorTableData[j].type === 13) {
                // 2.若为模拟设备量，则不加单位
                this.monitorTableData[j].display = response.data.devices[0].datastreams[i].value
              } else {
                // 3.其他设备量，根据后台返回数据unit加入单位
                this.monitorTableData[j].display = response.data.devices[0].datastreams[i].value + ' ' + this.monitorTableData[j].unit
              }
            }
          }
        }
        // 遍历监控点表格数据，1.数据格式转换 2.实现控制逻辑
        for (let k = 0; k < this.monitorTableData.length; k++) {
          /* 1.数据格式转换
          */
          // 若数值为空，则让其显示为暂无数据
          if (this.monitorTableData[k].display === '') {
            this.monitorTableData[k].display = '暂无数据'
          }
          // IO模块-原始数据转换为实际显示数据
          if (this.monitorTableData[k].typeFlag === 'io模块') {
            let switchValue16 = character.intTostring(this.monitorTableData[k].display, 12)
            let value = switchValue16.toString()
            console.log(this.monitorTableData[k].display)
            console.log(switchValue16)
            console.log(value)
            console.log(this.monitorTableData[k])
            // this.monitorTableData[k].display = value[this.monitorTableData[k].typeFlagNum - 1] === '0' ? '关' : '开'
            this.monitorTableData[k].display = value[12 - this.monitorTableData[k].typeFlagNum] === '0' ? '关' : '开'
            this.monitorTableData[k].moniterName = '第' + this.monitorTableData[k].typeFlagNum + '路'
          }
          // 风阀-原始数据转换为实际显示数据
          if (this.monitorTableData[k].type === 7) {
            let moniterDataLast = this.moniterDataChange(0, 4095, 0, 90, this.monitorTableData[k].display)
            this.monitorTableData[k].display = moniterDataLast.toFixed(2) + ' ' + '°'
            if (this.monitorTableData[k].display === 'NaN °') {
              this.monitorTableData[k].display = '暂无数据'
            }
          }
          /* 
            4ma-20ma 设备 数据格式转换
          */
          // 温度传感器-原始数据转换为实际显示数据
          if (this.monitorTableData[k].type === 11) {
            let moniterDataLast = this.moniterDataChange(600, 3000, -50, 150, this.monitorTableData[k].display)
            this.monitorTableData[k].display = moniterDataLast.toFixed(2) + ' ' + '°'
            if (this.monitorTableData[k].display === 'NaN °') {
              this.monitorTableData[k].display = '暂无数据'
            }
          }
          // 压力变送器-原始数据转换为实际显示数据
          if (this.monitorTableData[k].type === 12) {
            let moniterDataLast = this.moniterDataChange(600, 3000, 0, 5000, this.monitorTableData[k].display)
            this.monitorTableData[k].display = moniterDataLast.toFixed(2) + ' ' + 'pa'
            if (this.monitorTableData[k].display === 'NaN pa') {
              this.monitorTableData[k].display = '暂无数据'
            }
          }
          // 噪声变送器-原始数据转换为实际显示数据
          if (this.monitorTableData[k].type === 13) {
            let moniterDataLast = this.moniterDataChange(600, 3000, 30, 120, this.monitorTableData[k].display)
            this.monitorTableData[k].display = moniterDataLast.toFixed(2) + ' ' + 'db'
            if (this.monitorTableData[k].display === 'NaN db') {
              this.monitorTableData[k].display = '暂无数据'
            }
          }
          /* 2.实现控制逻辑
          */
        }
      }.bind(this))
    },
    // // 批量查询监控点最新数据-批量查询某些数据流
    // oneonenetStreamDataQue: function () {
    //   onenet.onenetStreamDataQue(this.param).then(function (response) {
    //     console.log('批量查询监控点最新数据')
    //     console.log(response)
    //   })
    // },
    /*
    **  **********  辅助方法函数  **********
    */
    // 处理监控点表格数据格式数据格式
    fillMoniterData: function (data) {
      console.log('处理监控点表格数据格式数据格式')
      console.log(data)
      // 把监控点添加到数组中去
      for (let i = 0; i < data.length; i++) {
        if (data[i].streams !== undefined) {
          for (let j = 0; j < data[i].streams.length; j++) {
            let obj = {} // obj对应this.moniterData数组的一个个对象
            obj.devName = data[i].devName
            obj.mac = data[i].mac
            obj.status = data[i].status
            obj.type = data[i].type
            obj.display = '' // 为了使得vue相应this.moniterData.display = xxx 动态赋值
            if (data[i].streams[data[i].streams.length - 1 - j].dataType !== undefined) { // 测试时有些没有返给dataType，没返的暂时用3来代替
              // obj.dataType = data[i].streams[data[i].streams.length - 1 - j].dataType  
              switch (data[i].streams[data[i].streams.length - 1 - j].dataType) {
                case 0:
                  obj.editShowFlag = true
                  obj.switchShowFlag = false
                  obj.isFFShowFlag = false
                  obj.readOnlyShowFlag = false
                  break
                case 1:
                  obj.editShowFlag = false
                  obj.switchShowFlag = true
                  obj.isFFShowFlag = false
                  obj.readOnlyShowFlag = false
                  break
                case 2:
                  obj.editShowFlag = false
                  obj.switchShowFlag = false
                  obj.isFFShowFlag = true
                  obj.readOnlyShowFlag = false
                  break
                case 3:
                  obj.editShowFlag = false
                  obj.switchShowFlag = false
                  obj.isFFShowFlag = false
                  obj.readOnlyShowFlag = true
                  break
              }
            } else {
              obj.editShowFlag = false
              obj.switchShowFlag = false
              obj.isFFShowFlag = false
              obj.readOnlyShowFlag = true
            }
            obj.moniterName = data[i].streams[data[i].streams.length - 1 - j].name // 倒序排列数组(参考奥拓历史数据组件)
            obj.streamId = data[i].streams[data[i].streams.length - 1 - j].streamId     
            obj.rw = data[i].streams[data[i].streams.length - 1 - j].rw     
            obj.unit = data[i].streams[data[i].streams.length - 1 - j].unit     
            data.splice(i + 1, 0, obj)
          }
        }
      }
      // 删除上一步造成的冗余对象
      for (let i = 0; i < data.length; i++) {
        if (data[i].streams !== undefined) {
          if (data[i].streams.length !== 0) {
            data.splice(i, 1)
          }
        }
        // 若是io模块，则转换显示效果
        if (data[i].type === 3) {
          let data1 = JSON.parse(JSON.stringify(data))
          for (let r = 1; r < 13; r++) {
            let obj = {}
            obj.devName = data1[i].devName
            obj.display = data1[i].display
            obj.editShowFlag = data1[i].editShowFlag
            obj.isFF = data1[i].isFF
            obj.isFFShowFlag = data1[i].isFFShowFlag
            obj.mac = data1[i].mac
            // obj.moniterName = '第' + r + '路'
            obj.moniterName = 13 - r
            // obj.moniterName = r
            obj.readOnlyShowFlag = data1[i].readOnlyShowFlag
            obj.rw = data1[i].rw
            obj.status = data1[i].status
            obj.streamId = data1[i].streamId
            obj.switchShowFlag = data1[i].switchShowFlag
            // obj.type = data1[i].type  // 这尼玛死循环了
            obj.typeFlag = 'io模块' // 用于自我判断标记哪行监控点位io模块路数
            obj.typeFlagNum = 13 - r // 用于自我判断标记哪行监控点位io模块路数
            // obj.typeFlagNum = r // 用于自我判断标记哪行监控点位io模块路数
            obj.unit = data1[i].unit
            data.splice(i + 1, 0, obj)
          }
          data.splice(i, 1) // 复制完原始io显示数据之后删掉他
        }
      }
      /* 倒序排列数组,会相应改变原始数组
        * 这样也会改变显示顺序，不友好
        * data.reverse()
      */
      this.monitorTableData = data
      this.monitorTableDataCopy = data
      // 先查询一次，再开启定时器2s查询一次，不然会干等2s查询onenet
      // 只在设备在线的情况下查询设备下的最新数据
      if (this.param.online === '在线') {
        this.oneonenetDataRequire()
      }
      // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息
      this.queryLoop()
    },
    // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息
    queryLoop: function () {
      window.clearInterval(this.onenetQueTimer)
      console.log('定时器开启0')
      let _this = this
      _this.onenetQueTimer = window.setInterval(function () {
        console.log('定时器开启1')
        // 只在设备在线的情况下查询设备下的最新数据
        if (_this.param.online === '在线') {
          _this.oneonenetDataRequire()
        }
      }, 2000)
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    },
    /* onenet原始数据转换为我们要显示的数据
      输入：x1,x2,y1,y2确定y=kx+b系数，在输入xValue实际要转化的值
      输出：k * xValue + b
    */
    moniterDataChange: function (x1, x2, y1, y2, xValue) {
      Number(xValue)
      let k = (y2 - y1) / (x2 - x1)
      let b = y1 - (y2 - y1) * x1 / (x2 - x1)
      return k * xValue + b
    }
  }
}
</script>

<style scoped>
.el-table td {
  text-align: center !important;
}
.el-icon-circle-check {
  color: green;
  font-size: 18px;
}
.el-icon-remove {
  color: red;
  font-size: 18px;
}
.deviceonepage {
  /* padding: 2px; */
  bottom: 0;
  width: 100%;
  /* overflow: hidden; */
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  /* height: 500px; */
}
.deviceonemain {
  padding: 0;
  overflow-x: hidden;
  /* overflow: hidden; */
  height: 70%;
}
.el-main {
  padding: 0;
  flex: 1;
}
.thirdtitle {
  padding-top: 15px;
}
.el-dialog--center .el-dialog__header {
  background-color: #409eff;
  padding-top: 15px;
  line-height: 40px;
}
.el-dialog__title {
  color: #303133;
}
.el-dialog--center .el-dialog__body {
  text-align: left;
  padding: 25px 27px 20px;
}
.span-top {
  padding-top: 10px;
}
.span-left {
  float: left;
}
.deviceonepage >>> .spHeight td {
  height: 30px;
  padding: 6px;
}
.deviceonepage >>> .spHeight {
  padding-bottom: 5px;
  margin-bottom: 30px;
}
</style>
