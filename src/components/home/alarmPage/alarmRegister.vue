<template>
  <el-container>
    <div class="alarmregister">
      <el-main class="alarmregistermain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="alarmTableData"
          border
          style="width: 100%"
          max-height = "450">
          <el-table-column fixed prop="number" label="编码" header-align="center" min-width="5%"></el-table-column>
          <el-table-column fixed prop="streamName" label="监控点名称" header-align="center" min-width="25%"></el-table-column>
          <el-table-column fixed prop="name" label="触发器名称" header-align="center" min-width="15%"></el-table-column>
          <el-table-column prop="factor" label="触发条件" header-align="center" min-width="13%"></el-table-column>
          <el-table-column prop="content" label="报警内容" header-align="center" min-width="17%"></el-table-column>
          <!-- <el-table-column prop="hideMessage" label="是否隐藏" header-align="center" min-width="5%"></el-table-column> -->
          <el-table-column label="操作" header-align="center" min-width="15%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="registerEditInitBt(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="registerDeleteBt(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer class="bottomfooter" height="60px">
        <div class="addregister">
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="registerAddInitBt">添加触发器</el-button>
          <el-dialog title="添加触发器" width="430px" :visible.sync="dialogFormVisible" center>
            <el-form :model="form" :inline="true">
              <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="监控选择" :label-width="formLabelWidth">
                <el-cascader
                  :options="monitorDatas"
                  v-model="selectedMonitor"
                  @change="monitorChange">
                </el-cascader>
              </el-form-item>
              <el-form-item label="类型" :label-width="formLabelWidth">
                <el-select v-model="form.type" placeholder="请选择类型">
                  <el-option label=">" value=">"></el-option>
                  <el-option label="<" value="<"></el-option>
                  <el-option label="=" value="=="></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="数值" :label-width="formLabelWidth">
                <el-input-number v-model="form.threshold" controls-position="right" :min="0" :max="65535"></el-input-number>
              </el-form-item>
              <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="form.content" placeholder="请输入内容"></el-input>
              </el-form-item>
              <!-- <el-form-item label="是否隐藏" :label-width="formLabelWidth">
                <el-checkbox v-model="form.isHide">隐藏</el-checkbox>
              </el-form-item> -->
            </el-form>
            <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="registerAddOrEdit">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'alarmRegisterDiv',
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'name': '',                     // 触发器名称,不超过16字符
        'streamId': '',                 // 当前数据流ID号
        'type': '',                     // 触发类型，>等
        'threshold': '',                // 触发阈值，最长10位小数
        'content': '',                  // 报警内容，50字符以内
        'triggerId': ''                 // 触发器ID号，删除时用
        // 'isHide': 1                     // 是否隐藏，0-隐藏，1-不隐藏
      },
      // 触发器列表信息
      alarmTableData: [{
        number: 1,
        selectMonitor: [],
        name: '嘻嘻嘻',               // 触发器名称
        type: '>',                   // 类型
        threshold: 40,
        factor: '>40',               // >40
        content: '哈哈哈',           // 描述
        isHide: false,               // 0表示需要隐藏，1表示不需要隐藏
        hideMessage: '否',          // 是否隐藏
        triggerId: '',
        streamName: '传感1',
        streamId: '',
        streamUid: ''
      }],
      selectedMonitor: [],
      // 监控选择组数据
      monitorDatas: [{
        label: '1',                    // 节点
        value: '网关1',                // label-选择框显示值，value-选择框实际值
        children: [{
          label: '传感器11',
          value: '传感器11'
        }, {
          label: '传感器12',
          value: '传感器12'
        }]
      }, {
        label: '2',
        value: '网关1',
        children: [{
          label: '传感器21',
          value: '传感器21'
        }, {
          label: '传感器22',
          value: '传感器22'
        }]
      }],
      // monitorOptions: [{
      //   value: 'streamId1',
      //   label: '',
      //   streamId: ''
      // }],
      // 存储表单信息
      form: {
        index: 0,
        number: 1,                          // 编号 自行从1开始填充
        name: '',                           // 触发器名称
        type: '>',                          // 触发类型
        threshold: 40,                      // 报警阈值
        factor: '',                         // >40
        content: '',                        // 报警内容
        // isHide: false,                      // 0表示需要隐藏，1表示不需要隐藏
        triggerId: '',
        streamName: '',                     // 监控点名称
        streamId: ''
        // streamUid: ''
      },
      ownerAuth: 1,                         // 拥有者权限
      shareAdminAuth: 2,                    // 分享者管理员权限
      shareOperateAuth: 3,                  // 分享者操作工权限
      shareNoteAuth: 4,                     // 分享者记录员权限
      dialogFormVisible: false,
      formLabelWidth: '120px',
      formAddOrModify: 0,                   // 0-add,1-modify
      loadingFlag: false,
      operationName: ''
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  mounted: async function () {
    try {
      this.alarmTableData = []  // 初始化表格内容
      // 获取网关下监控点列表信息
      await this.backNetMoniterListQue()
      // 用户设备权限查询
      
      // 查询当前的报警登记记录
      this.backGetTriList()
      // 查询后台的所有监控点信息（重新渲染组件时操作）
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    // 触发器添加 初始化(若没有初始化，则第一次输入的值会残留，导致下次打开时会有之前的值)
    registerAddInitBt: function () {
      this.form.index = this.alarmTableData.length
      // this.form.number = this.alarmTableData.length
      this.form.name = ''
      this.form.type = '>'
      this.form.threshold = 0
      this.form.factor = ''
      this.form.content = ''
      this.form.isHide = false
      this.form.hideMessage = '否'
      this.form.triggerId = ''
      this.form.streamName = ''
      this.form.streamId = ''
      this.form.streamUid = ''
      this.selectedMonitor = []
      this.dialogFormVisible = true
      this.formAddOrModify = 0
      this.operationName = '添加触发器'
    },
    // 触发器添加-编辑
    registerAddOrEdit: function () {
      if (this.form.name === '' || this.selectedMonitor[1] === '' || this.form.content === '') {
        this.notificationInfo('错误提示', '参数输入不完整')
        return
      }
      // 讲道理应该是中文也可以的，应该不限制非中文字符
      let triNameReg = /^[0-9a-zA-Z_]{1,20}$/
      if (!triNameReg.test(this.form.name)) {
        this.notificationInfo('错误提示', '触发器名称只能包含数字、字母、下划线')
        return
      }
      console.log(this.form)
      console.log(this.monitorDatas)
      // 根据streamId 查找设备类型
      // let devType
      // for (let i = 0; i < this.monitorDatas.length; i++) {
      //   for (let j = 0; j < this.monitorDatas[i].children.length; j++) {
      //     if (this.form.streamId === this.monitorDatas[i].children[j].value) {
      //       devType = this.monitorDatas[i].devType
      //     }
      //   }
      // }
      // 根据streamId 查找设备类型
      let devType = this.getDevType(this.form.streamId, this.monitorDatas)
      this.param.name = this.form.name
      this.param.streamId = this.form.streamId
      this.param.streamName = this.form.streamName
      this.param.type = this.form.type
      this.param.threshold = this.form.threshold
      // 若选风阀
      if (devType === 7) {
        this.param.threshold = this.moniterDataChange(0, 90, 0, 4095, this.form.threshold)
      }
      // 若选温度
      if (devType === 11) {
        this.param.threshold = this.moniterDataChange(-50, 150, 600, 3000, this.form.threshold)
      }
      // 若选噪声
      if (devType === 13) {
        this.param.threshold = this.moniterDataChange(30, 120, 600, 3000, this.form.threshold)
      }
      // 若选压力
      if (devType === 12) {
        this.param.threshold = this.moniterDataChange(0, 5000, 600, 3000, this.form.threshold)
      }
      this.param.content = this.form.content
      if (this.formAddOrModify === 1) {
        this.param.triggerId = this.alarmTableData[this.form.index].triggerId
      } else if (this.formAddOrModify === 0) {
        this.param.triggerId = '000'
      }
      this.loadingFlag = true
      if (this.formAddOrModify === 0) {
        this.backTriAdd()
      } else if (this.formAddOrModify === 1) {
        this.backTriUpdate()
      }
      this.dialogFormVisible = false
    },
    // 触发器编辑，修改当前行的信息(编辑初始化)
    registerEditInitBt: function (index, row) {
      console.log(index, row)
      console.log(this.alarmTableData[index])
      this.formAddOrModify = 1
      // 编辑对话框表单初始化
      // for (let key in this.alarmTableData[index]) {                      // for...in循环操作对象
      //   this.form[key] = this.alarmTableData[index][key]                // K值构建
      // }
      this.form.number = index
      this.form.index = index
      this.form.streamName = this.alarmTableData[index].streamName
      this.form.name = this.alarmTableData[index].name
      this.form.type = this.alarmTableData[index].type
      this.form.threshold = this.alarmTableData[index].threshold
      this.form.triggerId = this.alarmTableData[index].triggerId
      this.form.factor = this.alarmTableData[index].factor
      this.form.content = this.alarmTableData[index].content
      this.form.streamId = this.alarmTableData[index].streamId
      this.selectedMonitor = this.monitorLocQue(this.form.streamId)
      // this.form.streamId = this.selectedMonitor[this.selectedMonitor.length - 1]
      this.dialogFormVisible = true
      this.operationName = '编辑触发器'
    },
    // 触发器删除
    registerDeleteBt: function (index, row) {
      // console.log(index, row)
      this.param.triggerId = this.alarmTableData[index].triggerId // 要给后台一个triggerId标识号才知道删除的是具体哪一个触发器
      this.backTriDel(index)
    },
    // 监控点选择
    monitorChange: function (value) {
      console.log('monitor')
      console.log(value)
      console.log(this.selectedMonitor)
      this.form.streamId = this.selectedMonitor[this.selectedMonitor.length - 1]
      // this.form.streamUid = this.monitorUidQue(this.form.streamId)
      this.form.streamName = this.monitorUidQue(this.form.streamId)
      // this.form.streamId = value[1]
    },
    /*
    **  ************* API调用相关函数 ************
    */
    // 查询后台的所有监控点信息（重新渲染组件时操作）

    // 后台查询网关下监控点列表信息-得到节点mac,监控点streamId
    backNetMoniterListQue: function () {
      return new Promise(function (resolve, reject) {
        back.netMoniterListQue(this.param).then(function (response) {
          console.log('网关下监控点列表信息')
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            reject()
          } else {
            // 设备
            let data = []
            for (let i = 0; i < response.data.length; i++) {
              let obj = {}
              obj.label = response.data[i].name // 设备名
              obj.value = response.data[i].mac  // 设备mac
              obj.devType = response.data[i].type // 设备类型
              // 设备下监控点
              let streamsData = []
              for (let j = 0; j < response.data[i].streams.length; j++) {
                let obj = {}
                obj.label = response.data[i].streams[j].name
                obj.value = response.data[i].streams[j].streamId
                streamsData[j] = obj
              }
              obj.children = streamsData
              data[i] = obj
              resolve()
            }
            this.monitorDatas = data
            console.log(this.monitorDatas)
          }
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 用户设备权限查询

    // 查询当前的报警登记记录
    backGetTriList: function () {
      back.getTriList(this.param).then(function (response) {
        console.log('查询当前的报警登记记录')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        console.log(this.monitorDatas)
        let data = []
        if (response.data !== undefined) {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.number = i + 1
            obj.name = response.data[i].name
            obj.streamName = response.data[i].streamName
            obj.streamId = response.data[i].streamId
            obj.type = response.data[i].type
            // threshold 数值转化
            // ...1 查找devType
            let devType = this.getDevType(obj.streamId, this.monitorDatas)
            // ...2 根据devType 数值转化
            if (devType === 7) {
              // ...风阀
              obj.threshold = this.moniterDataChange(0, 4095, 0, 90, response.data[i].threshold)
            } else if (devType === 11) {
              // ...温度
              obj.threshold = this.moniterDataChange(600, 3000, -50, 150, response.data[i].threshold)
            } else if (devType === 12) {
              // ...压力
              obj.threshold = this.moniterDataChange(600, 3000, 0, 5000, response.data[i].threshold)
            } else if (devType === 13) {
              // ...噪声
              obj.threshold = this.moniterDataChange(600, 3000, 30, 120, response.data[i].threshold)
            } else {
              // ...3 其他所有不需转化数值设备
              obj.threshold = response.data[i].threshold
            }
            obj.factor = obj.type + obj.threshold
            obj.content = response.data[i].content
            obj.triggerId = response.data[i].triggerId
            data[i] = obj
          }
        }
        this.alarmTableData = data
        console.log(this.alarmTableData)
      }.bind(this))
    },
    // 添加触发器API
    backTriAdd: function () {
      console.log('添加tri param')
      console.log(this.param)
      back.triAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.notificationInfo('提示：', '添加成功')
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 查询当前的报警登记记录
        this.backGetTriList()
        this.loadingFlag = false
      }.bind(this))
    },
    // 更新触发器API
    backTriUpdate: function () {
      console.log('更新tri param')
      console.log(this.param)
      back.triMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.notificationInfo('提示：', '更新成功')
        } else {
          this.$notify.error({
            title: '添加失败，错误提示：',
            message: `${response.error}`
          })
        }
        // 查询当前的报警登记记录
        this.backGetTriList()
        this.loadingFlag = false
      }.bind(this))
    },
    // 删除触发器API
    backTriDel: function (index) {
      console.log('删除tri param')
      console.log(this.param)
      back.triDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno < 1) {
          this.alarmTableData.splice(index, 1)
          this.notificationInfo('提示：', '删除成功')
        } else {
          this.notificationInfo('删除失败，错误提示', response.error)
        }
        // 查询当前的报警登记记录
        this.backGetTriList()
      }.bind(this))
    },
    /*
    //  ************  功能方法函数  *************
    */
    // 监控点小组及组内信息存储
    monitorInfoStorge: function (info) {
      let monitorGroup = []
      for (let i = 0; i < info.length; i++) {
        let group = {}
        let monitorPoints = []
        if (info[i].datapoints !== undefined) {
          for (let j = 0; j < info[i].datapoints.length; j++) {
            let obj = {}
            obj.label = info[i].datapoints[j].streamName
            obj.value = info[i].datapoints[j].streamId
            obj.Uid = info[i].datapoints[j].streamUid
            monitorPoints[j] = obj
          }
        }
        group.label = info[i].groupName
        group.value = info[i].datapointGroupId
        group.children = monitorPoints
        monitorGroup[i] = group
      }
      this.monitorDatas = monitorGroup
    },
    // 根据提供的监控点ID号找到对应的监控点名称
    monitorUidQue: function (monitorId) {
      for (let i = 0; i < this.monitorDatas.length; i++) {
        if (this.monitorDatas[i].children !== undefined) {
          for (let j = 0; j < this.monitorDatas[i].children.length; j++) {
            if (this.monitorDatas[i].children[j].value === monitorId) {
              let streamName = this.monitorDatas[i].label + '/' + this.monitorDatas[i].children[j].label
              return streamName
            }
          }
        }
      }
      return 'undefined'
    },
    // 根据提供的监控点UID号找到对应的监控点名称
    monitorLocQue: function (monitorUid) {
      let group = []
      console.log(monitorUid)
      console.log(this.monitorDatas)
      for (let i = 0; i < this.monitorDatas.length; i++) {
        if (this.monitorDatas[i].children !== undefined) {
          for (let j = 0; j < this.monitorDatas[i].children.length; j++) {
            if (this.monitorDatas[i].children[j].value === monitorUid) {
              group[0] = this.monitorDatas[i].value
              group[1] = this.monitorDatas[i].children[j].value
              return group
            }
          }
        }
      }
      console.log(group)
      return group
    },
    // 根据 streamId 查询设备类型
    getDevType: function (streamId, data) {
      let devType
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].children.length; j++) {
          if (streamId === data[i].children[j].value) {
            devType = data[i].devType
          }
        }
      }
      return devType
    },
    // form表单信息检查
    // formContentCheck : function (formInfo) {
    //   if (formInfo.name === '') {}
    // },
    /*
    //  辅助函数
    */
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
.alarmregister{
  padding: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.alarmregistermain{
  padding: 0;
  overflow-x: hidden;
  height: 70%;
}
.el-main{
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
.addregister {
  margin-top: 3px;
  margin-bottom: 3px;
  padding-left: 2px;
  text-align: left;
}
/* 无效 */
.el-dialog__header {
  text-align: center;
  color: white;
  background-color: #409EFF;
}
</style>
