<template>
  <div class="history">
  <p></p>
    <div>
      <el-row class="thirdtitle">
        <el-col :span="10"><div class="grid-content bg-purple">监控选择
          <el-cascader
            :options="monitorDatas"
            v-model="selectedMonitor"
            @change="monitorChange">
          </el-cascader>
        </div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple">开始日期
          <el-date-picker
            v-model="valueStart"
            type="datetime"
            @change="getStartTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期时间"
            :picker-options="pickerOptions">
          </el-date-picker>
          </div></el-col>
        <el-col :span="7"><div class="grid-content bg-purple">结束日期
          <el-date-picker
            v-model="valueEnd"
            type="datetime"
            @change="getEndTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="请选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
          </div></el-col>

      </el-row>
      <p></p>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-button-group>
            <el-button type="primary" icon="el-icon-tickets" @click="dataListView=true"></el-button>
            <el-button type="primary" icon="el-icon-menu" @click="dataChartShow"></el-button>
          </el-button-group>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-button type="primary" round @click="queryHistoryBt">开始查询</el-button>
        </div></el-col>
      </el-row>
      <p></p>
    </div>

    <template v-if="dataListView">
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="monitorPointData"
        border
        style="width: 100%"
        >
        <el-table-column
          fixed
          prop="number"
          label="序号"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          header-align="center"
          min-width="30%">
        </el-table-column>
        <el-table-column
          prop="value"
          label="数值"
          header-align="center"
          min-width="50%">
        </el-table-column>
      </el-table>
    </template>
    
    <template v-else>
      <div class="chartview">
        <div id="diagram">
          <h1>echart</h1>
        </div>
      </div>
    </template>

  </div>
</template>

<script>
import { back, onenet } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import echarts from 'echarts'

export default {
  name: 'historyInquireDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'sn': '',
        'apiKey': '',                     // apikey值
        'deviceId': '',                   // 当前设备ID号
        'datastreamId': '',
        'startTime': '2017-10-01T08:00:35',
        'endTime': '',
        'cursor': '',
        'sort': 'DESC',                    // 值为DESC|ASC时间排序方式，DESC:倒序，ASC升序，默认升序
        'limit': 100
      },
      // 实际存储当前页面中的设备的查询到的历史数据信息
      monitorPointData: [{
        number: '',
        time: '',
        value: ''
      }],
      // valuetime: '',                      // [new Date(), new Date()],
      valueStart: '',
      valueEnd: '',
      selectDatamonitorInfo: [],
      // 存放监控点的创建时间
      monitorCreatetime: '',
      dataListView: true,
      // 存放向onenet查询到的带limit参数的数据
      limitData: '',
      // 用来存放选中的监控点分级的信息
      selectedMonitor: [],
      // 用来存放监控点小组与监控点的信息
      monitorDatas: [{
        label: '1',
        value: 'sdf',
        children: [{
          label: '11',
          value: 'sdf11',
          bindDeviceType: '',
          modbusCode: '',
          dataType: '',
          decimalBit: 0,
          maxRange: 1,
          minRange: 0,
          createtime: ''
        }]
      }, {
        label: '2',
        value: 'ew',
        children: []
      }],
      pickerOptions: {
        // 设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      loadingFlag: false,
      myChart: null, // 曲线图表
      datavalue: [], // 存放y轴数据
      datatrans: [], // 存放转换后的x轴数据,转换为只保留年月日的格式
      xdata: [] // 存放x轴数据
    }
  },
  //
  // *************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // back获取apikey,deviceId
    back.devInfoQue(this.param).then(function (response) {
      console.log(response)
      if (response.errno !== 0) {
        this.notificationInfo('错误提示', response.error)
        return
      }
      this.param.apiKey = response.data.apiKey
      this.param.deviceId = response.data.deviceId
    }.bind(this))
  },
  // 生命周期，安装期
  mounted: function () {
    // 查询后台的所有监控点信息（重新渲染组件时操作）
    this.backDevInfoQue()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 点击历史查询按键，查询对应时间段内的历史数据
    queryHistoryBt: function () {
      if (!(this.valueStart && this.valueEnd)) {
        this.notificationInfo('错误提示：', '请选择时间范围')
        return
      }
      if (this.valueStart > this.valueEnd) {
        this.notificationInfo('错误提示：', '开始时间不能大于结束时间')
        return
      }
      if (this.selectedMonitor.length === 0) {
        this.notificationInfo('错误提示：', '请选择监控点')
        return
      }
      this.param.startTime = this.valueStart
      this.param.endTime = this.valueEnd
      // var valueStart = this.valueStart.replace(/T/, ' ')
      // var valueEnd = this.valueEnd.replace(/T/, ' ')
      // if (this.monitorCreatetime >= valueStart) {
      //   valueStart = this.monitorCreatetime.replace(' ', 'T')
      //   this.param.startTime = valueStart
      // }
      // if (this.monitorCreatetime >= valueEnd) {
      //   this.notificationInfo('提示：', '该时间段内无数据')
      //   return
      // }
      this.selectDatamonitorInfo = this.monitorInfoQue(this.selectedMonitor[this.selectedMonitor.length - 1])
      this.loadingFlag = true
      this.dataListView = true
      console.log(this.selectedMonitor)
      if (this.selectedMonitor !== '') {
        this.param.datastreamId = this.selectedMonitor[this.selectedMonitor.length - 1]
      }
      this.onenetOneHistoryQuery()
    },
    // 开始时间选择改变，获取时间信息
    getStartTime: function (datetime) {
      this.valueStart = datetime
      console.log(this.valueStart)
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
      console.log(this.valueEnd)
    },
    // 监控点选择改变，获取存储选择的监控点的信息
    monitorChange: function (value) {
      console.log('monitor')
      console.log(this.selectedMonitor)
      this.selectDatastreamName = this.monitorNameQue(this.selectedMonitor[this.selectedMonitor.length - 1])
      // this.monitorCreatetime = this.monitorCreateTimeQue(this.selectedMonitor[this.selectedMonitor.length - 1])
      // console.log(this.monitorCreatetime)
    },
    // 打开数据图表部分内容，加载图表信息
    dataChartShow: function () {
      this.dataListView = false
      this.$nextTick(function () {
        let chartBox = document.getElementsByClassName('chartview')[0]
        // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        var resizechartviewContainer = function () {
          chartBox.style.height = document.body.clientHeight - 240 + 'px'
        }
        resizechartviewContainer()
        this.loaddiagram()
      })
    },
    /*
    ** ************* API调用相关函数 *************
    */
    // 后台查询网关下所有监控点列表信息
    backDevInfoQue: function () {
      // back.monitorListQue(this.param).then(function (response) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.monitorInfoStorge(response.data)
      }.bind(this))
    },
    // onenet查询近期最多limit个历史数据
    onenetOneHistoryQuery: function () {
      this.monitorPointData = []
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        if (response.data.datastreams.length > 0) {
          let length = response.data.datastreams[0].datapoints.length
          for (let i = 0; i < length; i++) {
            let obj = {}
            obj.number = i + 1
            obj.time = response.data.datastreams[0].datapoints[i].at
            obj.value = response.data.datastreams[0].datapoints[i].value
            data[i] = obj
          }
        }
        // this.monitorPointData = data
        this.limitData = data
        this.fillSomeData()
        var valueEnd = this.valueEnd.replace(/T/, ' ')
        if (this.limitData[this.limitData.length - 1].time >= valueEnd) {
          this.loadingFlag = false
          return
        }
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQuery(response.data.cursor)
        } else {
          this.loadingFlag = false
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // onenet查询近期最多limit个历史数据
    onenetNextHistoryQuery: function (cursor) {
      this.param.cursor = cursor
      onenet.onenetStartNextHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        if (response.data.datastreams.length > 0) {
          let length = response.data.datastreams[0].datapoints.length
          for (let i = 0; i < length; i++) {
            let obj = {}
            obj.number = i + 1
            obj.time = response.data.datastreams[0].datapoints[i].at
            obj.value = response.data.datastreams[0].datapoints[i].value
            data[i] = obj
          }
        }
        // this.monitorPointData = data
        this.limitData = data
        this.fillSomeData()
        var valueEnd = this.valueEnd.replace(/T/, ' ')
        if (this.limitData[this.limitData.length - 1].time >= valueEnd) {
          this.loadingFlag = false
          return
        }
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQuery(response.data.cursor)
        } else {
          this.loadingFlag = false
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    /*
    //  ************  功能方法函数  ************
    */
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    selectData: function () {
      let length = this.limitData.length
      console.log(length)
      this.monitorPointData = []
      if (length === 0) {
        return
      }
      // 日期格式转换，统一为"yyyy-MM-dd HH:mm:ss"格式，以便后续进行比较
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      // if (this.monitorCreatetime > valueEnd) {
      //   this.monitorPointData = []
      // } else {
      //   if (this.monitorCreatetime >= valueStart) {
      //     valueStart = this.monitorCreatetime
      //   }
      if (this.limitData[0].time > valueEnd) {
        this.monitorPointData = []
      } else {
        if (this.limitData[0].time >= valueStart) {
          for (let i = 0; i < length; i++) {
            if (this.limitData[i].time <= valueEnd) {
              let pointValue = this.limitData[i].value
              if (this.selectDatamonitorInfo.bindDeviceType === 'DELTA' && this.selectDatamonitorInfo.dataType === 'bit') {
                pointValue = this.limitData[i].value % 2
              }
              if (this.selectDatamonitorInfo.bindDeviceType === 'local' && this.selectDatamonitorInfo.dataType === 'bit16') {
                pointValue = this.rangeRegiterHandle(this.selectDatamonitorInfo, pointValue)
              } else {
                pointValue = this.monitorValueHandle(this.selectDatamonitorInfo, pointValue)
              }
              this.limitData[i].value = pointValue
              this.monitorPointData.push(this.limitData[i])
            }
          }
        } else {
          for (let i = 0; i < length; i++) {
            if ((this.limitData[i].time <= valueEnd) && (this.limitData[i].time >= valueStart)) {
              console.log('marker')
              let pointValue = this.limitData[i].value
              if (this.selectDatamonitorInfo.bindDeviceType === 'DELTA' && this.selectDatamonitorInfo.dataType === 'bit') {
                pointValue = this.limitData[i].value % 2
              }
              if (this.selectDatamonitorInfo.bindDeviceType === 'local' && this.selectDatamonitorInfo.dataType === 'bit16') {
                pointValue = this.rangeRegiterHandle(this.selectDatamonitorInfo, pointValue)
              } else {
                pointValue = this.monitorValueHandle(this.selectDatamonitorInfo, pointValue)
              }
              this.limitData[i].value = pointValue
              this.monitorPointData.push(this.limitData[i])
              console.log(this.monitorPointData)
            }
          }
        }
      }
      // }
      if (this.monitorPointData.length !== undefined) {
        for (let i = 0; i < this.monitorPointData.length; i++) {
          this.monitorPointData[i].number = i + 1
        }
      }
    },
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    fillSomeData: function () {
      let length = this.limitData.length
      console.log(length)
      // this.monitorPointData = []
      if (length === 0) {
        return
      }
      // 日期格式转换，统一为"yyyy-MM-dd HH:mm:ss"格式，以便后续进行比较
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      // if (this.monitorCreatetime > valueEnd) {
      //   this.monitorPointData = []
      // } else {
      //   if (this.monitorCreatetime >= valueStart) {
      //     valueStart = this.monitorCreatetime
      //   }
      if (this.limitData[0].time > valueEnd) {
        // this.monitorPointData = []
      } else {
        if (this.limitData[0].time >= valueStart) {
          for (let i = 0; i < length; i++) {
            if (this.limitData[i].time <= valueEnd) {
              let pointValue = this.limitData[i].value
              if (this.selectDatamonitorInfo.bindDeviceType === 'DELTA' && this.selectDatamonitorInfo.dataType === 'bit') {
                pointValue = this.limitData[i].value % 2
              }
              if (this.selectDatamonitorInfo.bindDeviceType === 'local' && this.selectDatamonitorInfo.dataType === 'bit16') {
                pointValue = this.rangeRegiterHandle(this.selectDatamonitorInfo, pointValue)
              } else {
                pointValue = this.monitorValueHandle(this.selectDatamonitorInfo, pointValue)
              }
              this.limitData[i].value = pointValue
              this.monitorPointData.push(this.limitData[i])
            }
          }
        } else {
          for (let i = 0; i < length; i++) {
            if ((this.limitData[i].time <= valueEnd) && (this.limitData[i].time >= valueStart)) {
              console.log('marker')
              let pointValue = this.limitData[i].value
              if (this.selectDatamonitorInfo.bindDeviceType === 'DELTA' && this.selectDatamonitorInfo.dataType === 'bit') {
                pointValue = this.limitData[i].value % 2
              }
              if (this.selectDatamonitorInfo.bindDeviceType === 'local' && this.selectDatamonitorInfo.dataType === 'bit16') {
                pointValue = this.rangeRegiterHandle(this.selectDatamonitorInfo, pointValue)
              } else {
                pointValue = this.monitorValueHandle(this.selectDatamonitorInfo, pointValue)
              }
              this.limitData[i].value = pointValue
              this.monitorPointData.push(this.limitData[i])
              console.log(this.monitorPointData)
            }
          }
        }
      }
      // }
      if (this.monitorPointData.length !== undefined) {
        for (let i = 0; i < this.monitorPointData.length; i++) {
          this.monitorPointData[i].number = i + 1
        }
      }
      console.log(this.monitorPointData.length)
    },
    // 加载图表内容
    loaddiagram: function () {
      // 加载曲线图表
      this.myChart = echarts.init(document.getElementById('diagram'))
      // 将请求到的时间数据转换为只保留年月日的格式
      let pointTimeData = []
      for (let i = 0; i < this.monitorPointData.length; i++) {
        let obj = {}
        let datatest = new Date(this.monitorPointData[i].time)
        obj = datatest.getFullYear() + '-' + (datatest.getMonth() + 1) + '-' + datatest.getDate()
        pointTimeData[i] = obj
      }
      this.datatrans = pointTimeData
      console.log(this.datatrans)
      this.xdata = []
      for (let j = 0; j < this.monitorPointData.length; j++) {
        this.xdata.push(this.monitorPointData[j].time)
      }
      // 加载曲线图表
      // var myChart = echarts.init(document.getElementById('diagram'))
      // 将列表中的数值提取出来存放在datavalue中
      let data = []
      for (let i = 0; i < this.monitorPointData.length; i++) {
        let obj = {}
        obj = this.monitorPointData[i].value
        data[i] = obj
      }
      this.datavalue = data
      console.log(this.datavalue)
      let chartBox = document.getElementsByClassName('chartview')[0]
      var diagramContainer = document.getElementById('diagram')
      // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
      var resizechartviewContainer = function () {
        chartBox.style.height = document.body.clientHeight - 240 + 'px'
      }
      var resizediagramContainer = function () {
        diagramContainer.style.width = chartBox.innerWidth + 'px'
        diagramContainer.style.height = chartBox.innerHeight + 'px'
      }
      // 设置容器高宽
      resizediagramContainer()
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(diagramContainer)
      // 图表选项
      var option = {
        title: {
          text: '历史数据'
        },
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          },
          formatter: function (params) {
            console.log(params)
            return params[1].value + '<br/>' + params[0].seriesName + ',' + params[0].data
          }
        },
        dataZoom: [
          {
            type: 'slider', // 滑动条调节
            start: 0,
            end: 100
          },
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        legend: {
          data: [this.selectDatastreamName]
        },
        color: ['#6495ED'], // 预设颜色，或者在series下的itemStyle中设定
        grid: {
          show: true,
          left: '10%',
          right: '10%',
          bottom: '15%',
          background: '#ed1d1d'
        },
        xAxis: [
          {
            type: 'category',
            splitNumber: 10,
            data: this.datatrans
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.selectDatastreamName,
            type: 'line',
            data: this.datavalue
          },
          {
            name: 'test',
            type: 'line',
            data: this.xdata
          }
        ]
      }
      this.myChart.setOption(option)
      // 用于使chart自适应高度和宽度
      window.onresize = function () {
        // 重置容器高宽
        resizechartviewContainer()
        resizediagramContainer()
        myChart.resize()
      }
    },
    // 监控点小组及组内信息存储
    monitorInfoStorge: function (info) {
      let monitorGroup = []
      for (let i = 0; i < info.length; i++) {
        let group = {}
        let monitorPoints = []
        if (info[i].streams !== undefined) {
          for (let j = 0; j < info[i].streams.length; j++) {
            let obj = {}
            obj.label = info[i].streams[j].name
            obj.value = info[i].streams[j].streamId
            obj.rw = info[i].streams[j].rw
            obj.unit = info[i].streams[j].unit
            obj.dataType = info[i].streams[j].dataType
            // obj.decimalBit = info[i].streams[j].decimalBit
            // obj.maxRange = info[i].streams[j].maxRange
            // obj.minRange = info[i].streams[j].minRange
            // obj.createtime = info[i].streams[j].lastTime
            // let time = info[i].datapoints[j].lastTime // 安装时间没有的
            // obj.createtime = time.replace(/T/, ' ')
            monitorPoints[j] = obj
          }
        }
        group.label = info[i].name
        group.value = info[i].mac
        group.children = monitorPoints
        monitorGroup[i] = group
      }
      this.monitorDatas = monitorGroup
      console.log(this.monitorDatas)
    },
    // 根据提供的监控点ID号找到对应的监控点名称
    monitorNameQue: function (monitorId) {
      for (let i = 0; i < this.monitorDatas.length; i++) {
        if (this.monitorDatas[i].children !== undefined) {
          // console.log(monitorId)
          // console.log(this.monitorDatas[i].children)
          for (let j = 0; j < this.monitorDatas[i].children.length; j++) {
            if (this.monitorDatas[i].children[j].value === monitorId) {
              return this.monitorDatas[i].children[j].label
            }
          }
        }
      }
      return 'undefined'
    },
    // 根据提供的监控点ID号找到对应的监控点创建时间
    monitorCreateTimeQue: function (monitorId) {
      for (let i = 0; i < this.monitorDatas.length; i++) {
        if (this.monitorDatas[i].children !== undefined) {
          // console.log(monitorId)
          // console.log(this.monitorDatas[i].children)
          for (let j = 0; j < this.monitorDatas[i].children.length; j++) {
            if (this.monitorDatas[i].children[j].value === monitorId) {
              return this.monitorDatas[i].children[j].createtime
            }
          }
        }
      }
      return 'undefined'
    },
    // ...获取监控点信息
    monitorInfoQue: function (monitorId) {
      let monitorInfo = []
      if (this.monitorDatas.length !== undefined) {
        for (let groupIndex = 0; groupIndex < this.monitorDatas.length; groupIndex++) {
          if (this.monitorDatas[groupIndex].children !== undefined) {
            for (let monitorIndex = 0; monitorIndex < this.monitorDatas[groupIndex].children.length; monitorIndex++) {
              if (this.monitorDatas[groupIndex].children[monitorIndex].value === monitorId) {
                monitorInfo = this.monitorDatas[groupIndex].children[monitorIndex]
                return monitorInfo
              }
            }
          }
        }
      }
      return monitorInfo
    },
    // ...监控点数据处理转换
    monitorValueHandle: function (monitorPointInfo, value) {
      let reValue = value
      if (monitorPointInfo.bindDeviceType === 'MODBUS') {
        if (monitorPointInfo.modbusCode === '01' || monitorPointInfo.modbusCode === '02') {
          reValue = value
        }
        if (monitorPointInfo.modbusCode === '03' || monitorPointInfo.modbusCode === '04') {
          if (monitorPointInfo.decimalBit > 0) {
            let PValue = value / Math.pow(10, monitorPointInfo.decimalBit)
            reValue = this.fomatFloat(PValue, monitorPointInfo.decimalBit)
          } else {
            reValue = value
          }
        }
      } else {
        if (monitorPointInfo.dataType === 'bit') {
          reValue = value
        } else {
          if (monitorPointInfo.decimalBit > 0) {
            let PValue = value / Math.pow(10, monitorPointInfo.decimalBit)
            reValue = this.fomatFloat(PValue, monitorPointInfo.decimalBit)
          } else {
            reValue = value
          }
        }
      }
      return reValue
    },
    // 处理本机模拟量输入，转换onenet数据为对应量程数据（600-3000转为minRange-maxRange）
    rangeRegiterHandle: function (monitorInfo, onenetData) {
      let retInt = 1
      let k = 1
      let b = 1
      let maxRange = monitorInfo.maxRange
      let minRange = monitorInfo.minRange
      let decimalBit = monitorInfo.decimalBit
      k = 2400 / (maxRange - minRange)
      b = 3000 - (2400 * maxRange) / (maxRange - minRange)
      console.log('k   ' + k)
      console.log('b   ' + b)
      retInt = ((onenetData - b) / k).toFixed(decimalBit)
      console.log('ret   ' + retInt)
      return retInt
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 保留n位小数并格式化输出（不足的部分补0）（比如2.3保留3位小数-> 2.300）
    fomatFloat: function (value, n) {
      var f = Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        s += '.'
      }
      for (let i = s.length - s.indexOf('.'); i <= n; i++) {
        s += '0'
      }
      return s
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
.history{
  width: 100%;
  height: 100%;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
/* .thirdtitle{
  padding-top: 15px;
} */
#diagram {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: 200px;
}
.chartview {
  width: 100%;
}
</style>
