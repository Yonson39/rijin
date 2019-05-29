<template>
  <el-container>
    <div class="mappingsRulesPage">
      <el-header style="height: 50px;">
        <!-- 最上边标题部分 -->
        <el-row>
          <el-col :span="20">
            <div style="float: left; margin-left:20px;">
              <p></p>
              <span>场景联动列表</span>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="ruleAddBtn">创建规则</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="mappingsRulesmain">
        <!-- 显示当前配置 -->
        <!-- 场景规则表格 -->
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          class="elTable"
          :data="ruleTableData"
          border
          style="width: 100%">
          <el-table-column
            prop="index"
            label="序号"
            header-align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="场景名称"
            header-align="center"
            min-width="40%">
          </el-table-column>
          <el-table-column
            prop="content"
            label="场景描述"
            header-align="center"
            min-width="40%">
          </el-table-column>
          <el-table-column
            prop="sceneCreatTime"
            label="创建时间"
            header-align="center"
            min-width="40%">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            min-width="25%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="ruleInfoBt(scope.$index, scope.row)">详情</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="ruleDelBtn(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="60px">
        <div class="addgroup">
          <el-dialog title="创建规则" :visible.sync="diaFormShow" width="800px" center>
            <el-form :model="form" :inline="true" label-width="120px" size="medium">
              <!-- form表单基本模块 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="场景名称" label-width="100px" >
                    <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="场景描述" label-width="100px">
                    <el-input v-model="form.describe" placeholder="请输入描述"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- form表单输入参数模块 -->
              <span class="diaLittleTitle">触发条件:</span>
              <div class="" v-for="(item,index) in form.inputRules" :key="index">
                <div class="inNume">触发条件{{index + 1}}</div>
                <!-- 情形一-设备选择IO模块时 -->
                <div class="triCondition" v-show="selIODevShow(index)" name="情形一-设备选择IO模块时">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelIn" placeholder="请选择网关" @change="netSelEvent(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="devSelEvent(index, 'input')" placeholder="请选择设备">
                          <el-option v-for="item in form.inputRules[index].devTypeOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delIn(index)" name="删除该触发条件"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="路数选择" label-width="100px">
                        <el-input-number v-model="item.IOwayNum" controls-position="right" :min="moniterRange.min" :max="moniterRange.max"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="路数状态" label-width="100px">
                        <el-select v-model="item.IOwayStation" placeholder="选择路数状态">
                          <!-- <el-option v-for="item in moniterStateOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option> -->
                          <el-option label="开" value="1"></el-option>
                          <el-option label="关" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <!-- 情形二-设备选择IO模块外 -->
                <!-- <div v-show="devSelIOOtherShow" name="情形二-设备选择除IO模块外"> -->
                <div class="triCondition" v-show="devSelIOOtherShowTest(index)" name="情形二-设备选择除IO模块外">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelIn" placeholder="请选择网关" @change="netSelEvent(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="devSelEvent(index, 'input')" placeholder="请选择设备">
                          <el-option v-for="item in form.inputRules[index].devTypeOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delIn(index)" name="删除该触发条件"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="监控点选择" label-width="100px">
                        <el-select v-model="item.moniterSelIOOtherIn" placeholder="选择监控点">
                          <el-option v-for="item in form.inputRules[index].moniterOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="联动条件" label-width="100px">
                        <el-select v-model="item.condition" placeholder="请选择条件类型">
                          <el-option label=">" value=">"></el-option>
                          <el-option label="<" value="<"></el-option>
                          <el-option label="=" value="=="></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="触发数值" label-width="100px">
                        <el-input v-model="item.valueIn" placeholder="触发数值"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="text" style="padding: 0px;" >&nbsp;</el-button>
              </div>
              <!-- <span style="color: #409EFF;" @click="addIn">+ 新增触发条件</span> -->
              <br>
              <!-- form表单输出参数模块 -->
              <span class="diaLittleTitle">执行动作:</span>
              <div class="" v-for="(item, index) in form.outputRules" :key="index + '-label'">
                <div class="inNume">执行动作{{index + 1}}</div>
                <div class="triCondition">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelOut" placeholder="请选择网关" @change="netChangeEventOut(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelOut" placeholder="请选择设备" @change="changeDevTypeOut(index, 'output')">
                          <el-option v-for="item in form.outputRules[index].devTypeOpitionOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delOut(index)" name="删除该执行动作"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="监控点选择" label-width="100px">
                        <el-select v-model="item.moniterSelOut" placeholder="选择监控点" @change="moniterSelChaOut">
                          <el-option v-for="item in form.outputRules[index].moniterOpitionOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="触发动作" label-width="100px">
                        <el-input v-model="item.activeDataOut" placeholder="请输入数值" v-show="activeDataShow"></el-input>
                        <el-select v-model="item.activeSelOut" placeholder="触发动作选择" v-show="activeModShow">
                          <!-- <el-option v-for="item in activeOpitionOut" :key="item.id" :label="item.label" :value="item.value"></el-option> -->
                          <el-option label="开" value="activeOn"></el-option>
                          <el-option label="关" value="activeOff"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="text" style="padding: 0px;" >&nbsp;</el-button>
              </div>
              <!-- <span style="color: #409EFF;" @click="addOut">+ 新增执行动作</span> -->
              <br>
            </el-form>
            <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
            <div slot="footer">
              <el-button @click="diaFormShow = false">取 消</el-button>
              <el-button type="primary" @click="formDIaConfirm('form')">确 定</el-button>
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
  data () {
    return {
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        // 添加联动规则所需param
        'name': '',
        'content': '',
        'groupId': '',
        'inputRules': [
          {
            'sn': '',
            'mac': '',
            'name': '', // 监控点名称
            'streamId': '',
            'type': '',
            'condition': '',
            'value': ''
          }
        ],
        'outputRules': [
          {
            'sn': '',
            'mac': '',
            'name': '', // 监控点名称
            'streamId': '',
            'type': '',
            'condition': '',
            'value': ''
          }
        ]
      },
      // 存储场景规则表格数据
      ruleTableData: [
        {
          index: '',            // 序号
          sceneName: '',        // 场景名称
          sceneDescribe: '',    // 场景描述
          sceneCreatTime: ''    // 创建时间
        }
      ],
      editBtnFlag: false,       // 编辑/查看详情标志位
      netMonierListPri: [],     // 某网关下监控点列表全部数据
      netMonierListPriOut: [],  // 某网关下监控点列表全部数据
      moniterListData: [],      // 存储所有网关下监控点列表
      // 存储对话框表单信息
      form: {
        index: 1,               // 当前选中行数
        name: '',               // 场景名称
        describe: '',           // 场景描述
        inputRules: [
          {
            devSelIOShow: false,
            devSelIOOtherShow: true,
            netSelIn: '',
            devTypeOpitionIn: [], // 设备可选列表
            moniterOpitionIn: [], // IO模块外监控点可选列表
            devSelIn: '',    // 设备选择
            // 选IO模块时
            IOwayNum: 1,         // 路数选择
            IOwayStation: '',       // 路数状态
            // 选IO模块外
            moniterSelIOOtherIn: '',         // 监控点选择
            condition: '',       // 联动条件
            valueIn: ''         // 触发数值
          }
        ],
        // 输出参数部分
        outputRules: [
          {
            netSelOut: '',
            devSelOut: '',
            moniterSelOut: '',
            activeDataOut: '',         // 触发动作输入数值
            activeSelOut: '',          // 触发动作状态
            devTypeOpitionOut: [],     // 设备可选列表
            moniterOpitionOut: []      // 监控点可选列表
          }
        ]     
      },
      diaFormShow: false,     // 场景对话框显示标志位
      operationName: '创建规则',     // 场景对话框操作名称(标题)
      devSelIOShow: false,           // 输入设备选择IO模块显示标志位
      devSelIOOtherShow: true,           // 输入设备选择除IO模块外显示标志位
      /* ******** 选择框数据存储 ********* */
      // 
      // 输入参数-IO模块时监控点可选范围
      moniterRange: {
        min: 1,
        max: 16
      },
      IOStreamId: null,             // 全局存储streamId
      netList: [],                  // home点击某个网关传递来的当前网关组下所有网关列表
      netSelOpitions: [],           // 网关可选列表
      activeDataShow: true,         // 输入数值 显示
      activeModShow: false,          // 选择状态 显示
      loadingFlag: false,     // 表格加载图标
      formAddOrModify: 0   // 规则添加与编辑标志 0-add,1-modify
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.userId = sessionGetStore('userId')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    this.param.groupId = sessionGetStore('groupIdNow')
    this.netList = sessionGetStore('netListNow')                               // home点击某个网关传递来的当前网关组下所有网关列表
    this.moniterPointerList = JSON.parse(sessionGetStore('moniterPointerList')) // home点击某个网关传递来的当前网关下所有监控点列表(包括设备)
    // 初始化表格数据
    // this.ruleTableData = []
  },
  mounted: function () {
    // 用户网关权限查询

    // 网关信息查询，获取onenet调用关键参数，deviceId,apikey

    // 获取网关组(厨房)下规则列表，返回设备ruleId,name,content
    this.loadingFlag = true
    this.backRuleListQue()
    // 表单初始化
    // 网关可选列表重置
    this.netSelOpitionsInit()
  },
  methods: {
    /*
    //  ************  用户操作触发方法  ************
    */
    // 创建场景规则按钮-打开对话框
    ruleAddBtn: function () {
      console.log('创建场景规则按钮')
      this.operationName = '新增规则'
      this.formAddOrModify = 0              // 0-添加 1-编辑
      this.diaFormShow = true
      this.editBtnFlag = false
    },
    // 详情场景规则按钮
    ruleInfoBt: function (index, row) {
      console.log('详情场景规则按钮')
      console.log(index)
      console.log(row)
      console.log(this.ruleTableData)
      this.operationName = '规则详情'
      this.formAddOrModify = 1              // 0-添加 1-编辑
      this.diaFormShow = true
      this.editBtnFlag = true
      this.param.ruleId = row.ruleId
      // 后台获取规则详情
      this.backRuleInfoQue(index)
    },
    // 场景对话框表单确定按钮
    formDIaConfirm: function () {
      console.log('场景对话框表单确定按钮')
      console.log(this.form)
      // 若为详情对话框，则确定按键不触发后台添加信息
      if (this.formAddOrModify === 1) {
        this.diaFormShow = false
        return
      }
      this.loadingFlag = true
      // form表单输入规则数据格式 => param所需输入规则数据格式
      let inputRulesData = []
      for (let i = 0; i < this.form.inputRules.length; i++) {
        let obj = {}
        obj.sn = this.form.inputRules[i].netSelIn
        obj.mac = this.form.inputRules[i].devSelIn
        obj.name = '规则1'
        // obj.streamId = this.form.inputRules[i].moniterSelIOOtherIn
        // 若选io模块，则streamId需要去查；选非IO模块，则直接是this.form.inputRules[i].moniterSelIOOtherIn
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 3) {
          obj.streamId = this.IOStreamId
        } else {
          obj.streamId = this.form.inputRules[i].moniterSelIOOtherIn
        }
        obj.type = this.devTypeQue(this.form.inputRules[i].devSelIn)
        obj.condition = this.form.inputRules[i].condition
        // obj.value = Number(this.form.inputRules[i].valueIn)
        // 若选io模块，选非IO模块 
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 3) {
          obj.value = Number(this.form.inputRules[i].IOwayStation)
        } else {
          obj.value = Number(this.form.inputRules[i].valueIn)
        }
        obj.order = Number(this.form.inputRules[i].IOwayNum)
        inputRulesData[i] = obj
      }
      // form表单输出规则数据格式 => param所需输出规则数据格式
      let outputRulesData = []
      for (let i = 0; i < this.form.outputRules.length; i++) {
        let obj = {}
        obj.sn = this.form.outputRules[i].netSelOut
        obj.mac = this.form.outputRules[i].devSelOut
        obj.name = '规则2'
        obj.streamId = this.form.outputRules[i].moniterSelOut
        obj.type = this.devTypeQue(this.form.outputRules[i].devSelOut)
        obj.condition = '>'
        obj.value = Number(this.form.outputRules[i].activeDataOut)
        outputRulesData[i] = obj
      }
      // 存储param参数
      this.param.name = this.form.name
      this.param.content = this.form.describe
      this.param.groupId = sessionGetStore('groupIdNow')
      this.param.inputRules = inputRulesData
      this.param.outputRules = outputRulesData
      this.backRuleAdd()
      this.diaFormShow = false
    },
    // 删除场景规则按钮
    ruleDelBtn: function (index, row) {
      console.log('删除场景规则按钮')
      console.log(index)
      console.log(row)
      this.loadingFlag = true
      this.param.ruleId = row.ruleId
      this.backRuleDel() // 注意ruleId参数传递
    },
    // 新增触发条件按钮
    addIn: function () {
      console.log('新增触发条件按钮')
      this.form.inputRules.push({
        devSelIOShow: false,
        devSelIOOtherShow: true,
        netSelIn: '',
        devTypeOpitionIn: [], // 设备可选列表
        moniterOpitionIn: [], // IO模块外监控点可选列表
        devSelIn: '',    // 设备选择
        // 选IO模块时
        IOwayNum: 1,         // 路数选择
        IOwayStation: '',    // 路数状态
        // 选IO模块外
        moniterSelIOOtherIn: '', // 监控点选择
        condition: '',           // 联动条件
        valueIn: ''              // 触发数值
      })
    },
    // 新增执行动作按钮
    addOut: function () {
      console.log('新增执行动作按钮')
      this.form.outputRules.push({
        // 输出参数部分
        netSelOut: '',
        devSelOut: '',
        moniterSelOut: '',
        activeDataOut: '',        // 触发动作输入数值
        activeSelOut: '',         // 触发动作状态
        devTypeOpitionOut: [],    // 设备可选列表
        moniterOpitionOut: []     // 监控点可选列表
      })
    },
    // 删除触发条件按钮
    delIn: function (index) {
      console.log(index)
      if (this.form.inputRules.length > 1) {
        this.form.inputRules.splice(index, 1)
      }
    },
    // 删除触发条件按钮
    delOut: function (index) {
      console.log(index)
      if (this.form.outputRules.length > 1) {
        this.form.outputRules.splice(index, 1)
      }
    },
    // v-show判断辅助函数
    selIODevShow: function (index) {
      console.log('IO模块show判断辅助函数')
      console.log(index)
      let devSelIOShow = this.form.inputRules[index].devSelIOShow
      console.log(devSelIOShow)
      return devSelIOShow // true/false
    },
    // v-show判断辅助函数
    devSelIOOtherShowTest: function (index) {
      console.log('非IO模块show判断辅助函数')
      console.log(index)
      let devSelIOOtherShow = this.form.inputRules[index].devSelIOOtherShow
      console.log(devSelIOOtherShow)
      return devSelIOOtherShow
    },
    //
    // *********** 选择框改变事件 ************
    //
    // 
    // 输入-网关选择事件-决定设备选项列表
    netSelEvent: function (index, sn) { // 若没有index参数，change事件默认参数值为当前所选中的value值
      console.log('输入-网关选择事件-决定设备选项列表')
      console.log(index)
      console.log(sn) // undefined
      console.log(this.form.inputRules[index].netSelIn)
      console.log(this.form.inputRules[index].devSelIn)
      this.param.sn = this.form.inputRules[index].netSelIn
      this.backNetMoniterListQue(index)
    },
    // 输出-网关选择事件-决定设备选项列表
    netChangeEventOut: function (index, sn) { // 若没有index参数，change事件默认参数值为当前所选中的value值
      console.log('输出-网关选择事件-决定设备选项列表')
      console.log(index)
      console.log(sn) // undefined
      console.log(this.form.outputRules[index].netSelOut)
      this.param.sn = this.form.outputRules[index].netSelOut
      this.backNetMoniterListQueOut(index)
    },
    // 输入-设备选择改变事件-决定监控点选项列表
    devSelEvent: function (index, inAndOutCheck) {
      console.log('输入-设备选择改变事件-分IO模块时/IO模块外两种情形')
      console.log(index)
      console.log(this.form.inputRules[index].devSelIn) // 设备mac地址
      // 根据devSelIn(mac地址)找到监控点列表中的设备类型type
      if (this.devTypeQue(this.form.inputRules[index].devSelIn) === 3) { // 若设备选择为IO模块
        // 表单初始化
        this.form.inputRules[index].devSelIOShow = true
        this.form.inputRules[index].devSelIOOtherShow = false
      } else { // 若设备选择为非IO模块
        // 表单初始化
        this.form.inputRules[index].devSelIOShow = false
        this.form.inputRules[index].devSelIOOtherShow = true
        // 初始化输入参数-监控点可选列表-根据mac去查询
        this.moniterOpitionInInit(index, this.form.inputRules[index].devSelIn)
      }
    },
    // 输出-设备选择改变事件-决定监控点选项列表
    changeDevTypeOut: function (index) {
      console.log('输出-设备选择改变事件-分IO模块时/IO模块外两种情形')
      console.log(index)
      console.log(this.form.outputRules[index].devSelOut) // 设备mac地址
      // 初始化输出参数-监控点可选列表-根据mac去查询
      this.moniterOpitionOutInit(index, this.form.outputRules[index].devSelOut)
    },
    // 输出-监控点选择改变事件
    moniterSelChaOut: function (value) {
      console.log('输出-监控点选择改变事件')
      console.log(value)
      console.log(this.form.moniterSelOut)
      if (this.form.moniterSelOut === 'none') {
        this.activeDataShow = false
        this.activeModShow = true
        this.form.activeSelOut = 'activeOn'  // 设定触发动作选择框默认值
      } else {
        this.activeDataShow = true
        this.activeModShow = false
      }
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // 查询规则列表
    backRuleListQue: function () {
      back.ruleListQue(this.param).then(function (response) {
        console.log('查询规则列表')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.index = i + 1
          obj.name = response.data[i].name
          obj.content = response.data[i].content
          obj.ruleId = response.data[i].ruleId
          obj.sceneCreatTime = response.data[i].createTime
          data[i] = obj
        }
        this.ruleTableData = data
      }.bind(this))
    },
    // back查询网关下监控点列表.输入  得到设备可选项，监控点可选项
    backNetMoniterListQuePri: function (index, dataOld) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表单初始化
        console.log(dataOld)
        // 输入-设备可选项重置
        this.devTypeOpitionInInit(index, response.data)
        console.log(this.form.inputRules[index].devTypeOpitionIn)
        this.form.inputRules[index].devSelIn = dataOld.inputRules[index].mac
        // 输入-设备选择改变事件-监控点可选项重置
        this.moniterOpitionInInitTest(index, this.form.inputRules[index].devSelIn, response.data)
        console.log(this.form.inputRules[index].moniterOpitionIn)
        this.form.inputRules[index].moniterSelIOOtherIn = dataOld.inputRules[index].streamId
        // console.log(this.form.inputRules[index].moniterSelIOOtherIn)
        // console.log(this.form.inputRules[index].devTypeOpitionIn)
        // console.log(this.form.inputRules[index].mac)
      }.bind(this))
    },
    // back查询网关下监控点列表。输出  得到设备可选项，监控点可选项
    backNetMoniterListQueOutPri: function (index, dataOld) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表单初始化
        console.log(dataOld)
        console.log(response.data)
        // 输出-设备可选项重置
        this.devTypeOpitionOutInit(index, response.data)
        console.log(this.form.outputRules[index].devTypeOpitionOut)
        this.form.outputRules[index].devSelOut = dataOld.outputRules[index].mac
        // 输出-设备选择改变事件-监控点可选项重置
        this.moniterOpitionOutInitTest(index, this.form.outputRules[index].devSelOut, response.data)
        console.log(this.form.outputRules[index].moniterOpitionOut)
        this.form.outputRules[index].moniterSelOut = dataOld.outputRules[index].streamId
      }.bind(this))
    },
    // 获取网关下监控点列表，返回监控点信息,streamId
    // *sn 选择不同，查询sn下的设备...
    backNetMoniterListQue: function (index) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (this.netMonierListPri === undefined) {
          this.netMonierListPri = response.data
        } else if (this.netMonierListPri !== response.data) {
          this.netMonierListPri = this.netMonierListPri.concat(response.data)
        }
        // ***** 网关选择改变，则初始化表单 ******
        // 初始化输入参数-设备可选列表
        this.devTypeOpitionInInit(index, response.data)
        this.form.inputRules[index].devSelIn = '' // 避免上次网关选择某个设备后，再次切换网关则会造成设备选择的v-model残留
        // 初始化输入参数-监控点可选列表
        this.form.inputRules[index].moniterOpitionIn = []
        this.form.inputRules[index].moniterSelIOOtherIn = ''
        // 初始化输入参数-路数选择
        this.form.inputRules[index].IOwayNum = ''
        // 初始化输入参数-路数状态
        this.form.inputRules[index].IOwayStation = ''
        // 初始化输入参数-联动条件
        this.form.inputRules[index].condition = ''
        // 初始化输入参数-触发数值
        this.form.inputRules[index].valueIn = ''
      }.bind(this))
    },
    // 获取网关下监控点列表，返回监控点信息,streamId
    backNetMoniterListQueOut: function (index) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (this.netMonierListPriOut === undefined) {
          this.netMonierListPriOut = response.data
        } else if (this.netMonierListPriOut !== response.data) {
          this.netMonierListPriOut = this.netMonierListPriOut.concat(response.data)
        }
        // ***** 网关选择改变，则初始化表单 ******
        // 初始化输出参数-设备可选列表
        this.devTypeOpitionOutInit(index, response.data)
        this.form.outputRules[index].devSelOut = '' // 避免上次网关选择某个设备后，再次切换网关则会造成设备选择的v-model残留
        // 初始化输入参数-监控点可选列表
        this.form.outputRules[index].moniterOpitionOut = []
        this.form.outputRules[index].moniterSelOut = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留'
        // 初始化输出参数-触发数值
        this.form.outputRules[index].activeDataOut = ''
        // // 初始化输出参数-触发动作
        // this.form.outputRules[index].activeSelOut = ''
      }.bind(this))
    },
    // 后台添加联动规则
    backRuleAdd: function () {
      back.ruleAdd(this.param).then(function (response) {
        console.log('后台添加联动规则')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back查询规则列表
        this.backRuleListQue()
      }.bind(this))
    },
    // 后台获取规则详情
    backRuleInfoQue: function (index) {
      back.ruleInfoQue(this.param).then(function (response) {
        console.log('后台获取规则详情')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 后台数据填充表单
        this.form.name = response.data.name
        this.form.describe = response.data.content
        // ...输入部分
        this.form.inputRules[index].netSelIn = response.data.inputRules[index].sn
        // back查询网关下监控点列表。得到设备可选项，监控点可选项
        this.param.sn = this.form.inputRules[index].netSelIn
        this.backNetMoniterListQuePri(index, response.data)
        this.form.inputRules[index].condition = response.data.inputRules[index].condition
        this.form.inputRules[index].valueIn = response.data.inputRules[index].value
        this.form.inputRules[index].order = response.data.inputRules[index].order
        // ...输出部分
        this.form.outputRules[index].netSelOut = response.data.outputRules[index].sn
        // back查询网关下监控点列表。得到设备可选项，监控点可选项
        this.param.sn = this.form.outputRules[index].netSelOut
        this.backNetMoniterListQueOutPri(index, response.data)
        // this.form.outputRules[index].mac = response.data.outputRules[index].mac
        // this.form.outputRules[index].streamId = response.data.outputRules[index].streamId
        this.form.outputRules[index].condition = response.data.outputRules[index].condiition
        this.form.outputRules[index].activeDataOut = response.data.outputRules[index].value
        console.log(this.form)
      }.bind(this))
    },
    // 后台删除联动规则
    backRuleDel: function () {
      back.ruleDel(this.param).then(function (response) {
        console.log('后台删除联动规则')
        console.log(response)
        this.loadingFlag = false
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back查询规则列表
        this.backRuleListQue()
      }.bind(this))
    },
    /*
    **  **********  辅助方法函数  **********
    */
    // 网关可选列表重置
    netSelOpitionsInit: function () {
      let netList = JSON.parse(this.netList)
      console.log(netList)
      if (!netList) {
        return
      }
      let data = []
      for (let i = 0; i < netList.length; i++) {
        let obj = {}
        obj.label = netList[i].label
        obj.value = netList[i].sn
        data[i] = obj
      }
      this.netSelOpitions = data
    },
    // 输入-设备可选列表重置
    devTypeOpitionInInit: function (index, data) {
      let list = []
      for (let i = 0; i < data.length; i++) {
        let obj = {}
        obj.label = data[i].name
        obj.value = data[i].mac
        list[i] = obj
      }
      this.form.inputRules[index].devTypeOpitionIn = list
      // this.form.inputRules[index].devSelIn = this.form.inputRules[index].devTypeOpitionIn[0].value // 默认设备选择可选项第一个
    },
    // 输出-设备可选列表重置
    devTypeOpitionOutInit: function (index, data) {
      console.log(data)
      let list = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 4 || data[i].type === 5 || data[i].type === 7) {
          let obj = {}
          obj.label = data[i].name
          obj.value = data[i].mac
          // list[i] = obj
          list.push(obj)
        }
      }
      this.form.outputRules[index].devTypeOpitionOut = list
      // 若输入设备是IO模块，则输出设备只能是风阀
      if (this.devSelIOShow) {
        let fengfaList = []
        for (let i = 0; i < list.length; i++) {
          if (fengfaList[i].type === 7) {
            let obj = {}
            obj.label = fengfaList[i].name
            obj.value = fengfaList[i].mac
            // fengfaList[i] = obj
            fengfaList.push(obj)
          }
        }
        this.form.outputRules[index].devTypeOpitionOut = fengfaList
      }
      console.log(123456)
      console.log(this.form.outputRules[index].devTypeOpitionOut)
      console.log(this.form.inputRules[index].devSelIn)
      // this.form.outputRules[index].devSelOut = this.form.outputRules[index].devTypeOpitionOut[0].value // 默认设备选择可选项第一个
    },
    // 根据devSelIn(mac地址)找到监控点列表中的设备类型type
    devTypeQue: function (devSel) {
      let netMoniterListAll = []
      netMoniterListAll = this.netMonierListPri.concat(this.netMonierListPriOut)
      for (let i = 0; i < netMoniterListAll.length; i++) {
        if (devSel === netMoniterListAll[i].mac) {
          let type = netMoniterListAll[i].type
          // 若是IO模块，则全局存储streamId
          if (type === 3) {
            this.IOStreamId = netMoniterListAll[i].streams[0].streamId
          }
          return type
        }
      }
    },
    // 初始化输入参数-监控点可选列表-根据mac去查询
    moniterOpitionInInitTest: function (index, devSel, dataOld) {
      let streams = []
      for (let i = 0; i < dataOld.length; i++) {
        if (devSel === dataOld[i].mac) {
          streams = dataOld[i].streams
        }
      }
      let list = []
      for (let i = 0; i < streams.length; i++) {
        let obj = {}
        obj.label = streams[i].name
        obj.value = streams[i].streamId
        list[i] = obj
      }
      this.form.inputRules[index].moniterOpitionIn = list
    },
    // 初始化输入参数-监控点可选列表-根据mac去查询
    moniterOpitionOutInitTest: function (index, devSel, dataOld) {
      let streams = []
      for (let i = 0; i < dataOld.length; i++) {
        if (devSel === dataOld[i].mac) {
          streams = dataOld[i].streams
        }
      }
      let list = []
      for (let i = 0; i < streams.length; i++) {
        let obj = {}
        obj.label = streams[i].name
        obj.value = streams[i].streamId
        list[i] = obj
      }
      this.form.outputRules[index].moniterOpitionOut = list
    },
    // 初始化输入参数-监控点可选列表-根据mac去查询
    moniterOpitionInInit: function (index, devSel) {
      let streams = []
      for (let i = 0; i < this.netMonierListPri.length; i++) {
        if (devSel === this.netMonierListPri[i].mac) {
          streams = this.netMonierListPri[i].streams
        }
      }
      let list = []
      for (let i = 0; i < streams.length; i++) {
        let obj = {}
        obj.label = streams[i].name
        obj.value = streams[i].streamId
        list[i] = obj
      }
      // 如果是编辑/查看详情,则只需置监控点可选列表即可
      if (this.editBtnFlag) {
        this.form.inputRules[index].moniterOpitionIn = list
        console.log(this.form.inputRules[index].moniterOpitionIn)
        return
      }
      // ***** 设备选择改变，则初始化表单 ******
      this.form.inputRules[index].moniterOpitionIn = list
      this.form.inputRules[index].moniterSelIOOtherIn = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留
      // 初始化输入参数-路数选择
      this.form.inputRules[index].IOwayNum = ''
      // 初始化输入参数-路数状态
      this.form.inputRules[index].IOwayStation = ''
      // 初始化输入参数-联动条件
      this.form.inputRules[index].condition = ''
      // 初始化输入参数-触发数值
      this.form.inputRules[index].valueIn = ''
    },
    // 初始化输出参数-监控点可选列表-根据mac去查询
    moniterOpitionOutInit: function (index, devSel) {
      let streams = []
      for (let i = 0; i < this.netMonierListPriOut.length; i++) {
        if (devSel === this.netMonierListPriOut[i].mac) {
          streams = this.netMonierListPriOut[i].streams
        }
      }
      let list = []
      for (let i = 0; i < streams.length; i++) {
        let obj = {}
        obj.label = streams[i].name
        obj.value = streams[i].streamId
        list[i] = obj
      }
      // ***** 设备选择改变，则初始化表单 ******
      this.form.outputRules[index].moniterOpitionOut = list
      this.form.outputRules[index].moniterSelOut = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留'
      // 初始化输出参数-触发数值
      this.form.outputRules[index].activeDataOut = ''
      // // 初始化输出参数-触发动作
      // this.form.outputRules[index].activeSelOut = ''
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
.mappingsRulesPage{
  padding: 2px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.mappingsRulesmain{
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;
  height: 70%;
}
.el-header {
  padding: 5px;
}
.el-main {
  padding: 0;
  flex: 1;
}
.mappingsRulesPage >>> .el-icon-circle-check {
  color: green;
  font-size: 18px;
}
.mappingsRulesPage >>> .el-icon-remove {
  color: red;
  font-size: 18px;
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
.el-form-item {
  margin-bottom: 10px;
}
.diaLittleTitle {
  color: grey;
}
.inNume {
  /* margin-left: 20px; */
  padding-left: 20px;
  background-color: #F8F8F8;
}
.triCondition {
  background-color: #F8F8F8;
}
</style>
