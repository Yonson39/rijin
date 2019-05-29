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
            <el-button type="primary" @click="ruleAddBtn">新增规则</el-button>
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
          <el-dialog title="创建规则" :visible.sync="diaFormShow" @closed="diaClose('form')" width="800px" center>
            <el-form :model="form" ref="form" :inline="true" label-width="120px" size="medium">
              <!-- form表单基本模块 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="场景名称" label-width="100px">
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
                <!-- <div class="triCondition" v-show="selIODevShow(index)" name="情形一-设备选择IO模块时"> -->
                <div class="triCondition" v-show="isSelIODevShow" name="情形一-设备选择IO模块时">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelIn" placeholder="请选择网关" @change="netSelEvent(index, 'input')">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="devSelEvent(index, 'input')" placeholder="请选择设备">
                          <el-option v-for="item in form.inputRules[index].devOptionsIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delConditions(index, 'input')" name="删除该触发条件"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="路数选择" label-width="100px">
                        <el-input-number v-model="item.interfaceNumber" controls-position="right" :min="moniterRange.min" :max="moniterRange.max"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="路数状态" label-width="100px">
                        <el-select v-model="item.interfaceNumberState" placeholder="选择路数状态">
                          <el-option label="开" value="1"></el-option>
                          <el-option label="关" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <!-- 情形二-设备选择IO模块外 -->
                <!-- <div v-show="devSelNotIOShow" name="情形二-设备选择除IO模块外"> -->
                <!-- <div class="triCondition" v-show="devSelIOOtherShowTest(index)" name="情形二-设备选择除IO模块外"> -->
                <div class="triCondition" v-show="isSelIOOtherDevShow" name="情形二-设备选择除IO模块外">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelIn" placeholder="请选择网关" @change="netSelEvent(index, 'input')">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="devSelEvent(index, 'input')" placeholder="请选择设备">
                          <el-option v-for="item in form.inputRules[index].devOptionsIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delConditions(index, 'input')" name="删除该触发条件"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="监控点选择" label-width="100px">
                        <el-select v-model="item.moniterSelIOOtherIn" placeholder="选择监控点">
                          <el-option v-for="item in form.inputRules[index].monitorOptionsIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
              <!-- <span style="color: #409EFF;" @click="addConditions('input')">+ 新增触发条件</span> -->
              <br>
              <!-- form表单输出参数模块 -->
              <span class="diaLittleTitle">执行动作:</span>
              <div class="" v-for="(item, index) in form.outputRules" :key="index + '-label'">
                <div class="inNume">执行动作{{index + 1}}</div>
                <div class="triCondition">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelOut" placeholder="请选择网关" @change="netSelEvent(index, 'output')">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelOut" placeholder="请选择设备" @change="devSelEvent(index, 'output')">
                          <el-option v-for="item in form.outputRules[index].devOptionsOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <!-- <el-col :span="2">
                      <el-button type="text" size="medium" icon="el-icon-delete" circle @click="delConditions(index, 'output')" name="删除该执行动作"></el-button>
                    </el-col> -->
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="监控点选择" label-width="100px">
                        <el-select v-model="item.moniterSelOut" placeholder="选择监控点" @change="monitorSelEventOut">
                          <el-option v-for="item in form.outputRules[index].monitorOptionsOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="触发动作" label-width="100px">
                        <el-input v-model="item.activeDataOut" placeholder="请输入数值" v-show="activeDataShow"></el-input>
                        <el-select v-model="item.activeSelOut" placeholder="触发动作选择" v-show="activeModShow">
                          <el-option label="开" value="activeOn"></el-option>
                          <el-option label="关" value="activeOff"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <el-button type="text" style="padding: 0px;" >&nbsp;</el-button>
              </div>
              <!-- <span style="color: #409EFF;" @click="addConditions('output')">+ 新增执行动作</span> -->
              <br>
            </el-form>
            <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
            <div slot="footer">
              <el-button @click="diaFormShow = false">取 消</el-button>
              <el-button type="primary" @click="formDiaConfirmBtn('form')">确 定</el-button>
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
            devSelNotIOShow: true,
            netSelIn: '',
            devOptionsIn: [], // 设备可选列表
            monitorOptionsIn: [], // IO模块外监控点可选列表
            devSelIn: '',    // 设备选择
            // 选IO模块时
            interfaceNumber: 1,         // 路数选择
            interfaceNumberState: '',       // 路数状态
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
            devOptionsOut: [],     // 设备可选列表
            monitorOptionsOut: []      // 监控点可选列表
          }
        ]     
      },
      diaFormShow: false,     // 场景对话框显示标志位
      operationName: '创建规则',     // 场景对话框操作名称(标题)
      devSelIOShow: false,           // 输入设备选择IO模块显示标志位
      devSelNotIOShow: true,           // 输入设备选择除IO模块外显示标志位
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
      formAddOrModify: 0,   // 规则添加与编辑标志 0-add,1-modify
      isSelIODevShow: true,
      isSelIOOtherDevShow: false
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
    this.ruleTableData = []
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
    // 关闭对话框自动调用事件
    diaClose: function (formName) {
      // 关闭表单验证
      console.log('关闭表单验证')
      // this.$refs[formName].resetFields() // 必须要有prop
    },
    // 创建场景规则按钮-打开对话框
    ruleAddBtn: function () {
      this.operationName = '新增规则'
      this.formAddOrModify = 0              // 0-添加 1-编辑
      this.diaFormShow = true
      this.editBtnFlag = false
      // 表单内容初始化
      this.form = {
        index: 1,               // 当前选中行数
        name: '',               // 场景名称
        describe: '',           // 场景描述
        inputRules: [
          {
            devSelIOShow: false,
            devSelNotIOShow: true,
            netSelIn: '',
            devOptionsIn: [], // 设备可选列表
            monitorOptionsIn: [], // IO模块外监控点可选列表
            devSelIn: '',    // 设备选择
            // 选IO模块时
            interfaceNumber: 1,         // 路数选择
            interfaceNumberState: '',       // 路数状态
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
            devOptionsOut: [],     // 设备可选列表
            monitorOptionsOut: []      // 监控点可选列表
          }
        ]     
      }
    },
    // 详情场景规则按钮
    ruleInfoBt: function (index, row) {
      this.operationName = '规则详情'
      this.formAddOrModify = 1              // 0-添加 1-编辑
      this.diaFormShow = true
      this.editBtnFlag = true
      this.param.ruleId = row.ruleId
      // 后台获取规则详情
      this.backRuleInfoQue(index)
    },
    // 场景对话框表单确定按钮
    formDiaConfirmBtn: function () {
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
        // 若选io模块
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 3) {
          obj.value = Number(this.form.inputRules[i].interfaceNumberState)
          obj.order = Number(this.form.inputRules[i].interfaceNumber)
        } else {
          // 非IO模块则传order为100
          obj.order = 100
        }
        // 若选风阀
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 7) {
          obj.value = this.moniterDataChange(0, 90, 0, 4095, this.form.inputRules[i].valueIn)
        }
        // 若选温度
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 11) {
          obj.value = this.moniterDataChange(-50, 150, 600, 3000, this.form.inputRules[i].valueIn)
        }
        // 若选噪声
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 13) {
          obj.value = this.moniterDataChange(30, 120, 600, 3000, this.form.inputRules[i].valueIn)
        }
        // 若选压力
        if (this.devTypeQue(this.form.inputRules[i].devSelIn) === 12) {
          obj.value = this.moniterDataChange(0, 5000, 600, 3000, this.form.inputRules[i].valueIn)
        }
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
        // 若选io模块
        if (this.devTypeQue(this.form.outputRules[i].devSelIn) === 3) {
          obj.value = Number(this.form.outputRules[i].interfaceNumberState)
          obj.order = Number(this.form.outputRules[i].interfaceNumber)
        } else {
          // 非IO模块则传order为100
          obj.order = 100
        }
        // 若选风阀
        if (this.devTypeQue(this.form.outputRules[i].devSelIn) === 7) {
          obj.value = this.moniterDataChange(0, 90, 0, 4095, this.form.outputRules[i].valueIn)
        }
        // 若选温度
        if (this.devTypeQue(this.form.outputRules[i].devSelIn) === 11) {
          obj.value = this.moniterDataChange(-50, 150, 600, 3000, this.form.outputRules[i].valueIn)
        }
        // 若选噪声
        if (this.devTypeQue(this.form.outputRules[i].devSelIn) === 13) {
          obj.value = this.moniterDataChange(30, 120, 600, 3000, this.form.outputRules[i].valueIn)
        }
        // 若选压力
        if (this.devTypeQue(this.form.outputRules[i].devSelIn) === 12) {
          obj.value = this.moniterDataChange(0, 5000, 600, 3000, this.form.outputRules[i].valueIn)
        }
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
      this.loadingFlag = true
      this.param.ruleId = row.ruleId
      this.backRuleDel()
    },
    // 新增条件按钮
    addConditions: function (inAndOutCheck) {
      console.log('新增条件')
      if (inAndOutCheck === 'input') {
        this.form.inputRules.push({
          devSelIOShow: false,
          devSelNotIOShow: true,
          netSelIn: '',
          devOptionsIn: [], // 设备可选列表
          monitorOptionsIn: [], // IO模块外监控点可选列表
          devSelIn: '',    // 设备选择
          // 选IO模块时
          interfaceNumber: 1,         // 路数选择
          interfaceNumberState: '',    // 路数状态
          // 选IO模块外
          moniterSelIOOtherIn: '', // 监控点选择
          condition: '',           // 联动条件
          valueIn: ''              // 触发数值
        })
      } else if (inAndOutCheck === 'output') {
        this.form.outputRules.push({
          // 输出参数部分
          netSelOut: '',
          devSelOut: '',
          moniterSelOut: '',
          activeDataOut: '',        // 触发动作输入数值
          activeSelOut: '',         // 触发动作状态
          devOptionsOut: [],    // 设备可选列表
          monitorOptionsOut: []     // 监控点可选列表
        })
      }
    },
    // 删除条件按钮
    delConditions: function (index, inAndOutCheck) {
      console.log('删除条件')
      if (inAndOutCheck === 'input') {
        if (this.form.inputRules.length > 1) {
          this.form.inputRules.splice(index, 1)
        }
      } else if (inAndOutCheck === 'output') {
        if (this.form.outputRules.length > 1) {
          this.form.outputRules.splice(index, 1)
        }
      }
    },
    // v-show判断辅助函数 param-详情页判断是否是IO模块
    selIODevShow: function (index, param) {
      console.log('IO模块show判断辅助函数')
      console.log(index)
      console.log(param)
      if (param === 0) {
        // 若查看详情得到condition为0, devSelIOShow显示为true
        return false
      } else if (param === 1) {
        return true
      }
      let devSelIOShow = this.form.inputRules[index].devSelIOShow
      return devSelIOShow // true/false
    },
    // v-show判断辅助函数 param-详情页判断是否是IO模块
    devSelIOOtherShowTest: function (index, param) {
      console.log('非IO模块show判断辅助函数')
      console.log(index)
      console.log(param)
      if (param === 0) {
        // 若查看详情得到condition为0, devSelIOShow显示为true
        return false
      } else if (param === 1) {
        return true
      }
      let devSelNotIOShow = this.form.inputRules[index].devSelNotIOShow
      return devSelNotIOShow // true/false
    },
    //
    // *********** 选择框改变事件 ************
    //
    // 
    // 网关选择事件-决定设备可选项
    netSelEvent: function (index, inAndOutCheck) { // 若没有index参数，change事件默认参数值为当前所选中的value值
      console.log('输入-网关选择事件-决定设备选项列表')
      if (inAndOutCheck === 'input') {
        this.param.sn = this.form.inputRules[index].netSelIn
        this.backNetMoniterListQue(index)
      } else if (inAndOutCheck === 'output') {
        this.param.sn = this.form.outputRules[index].netSelOut
        this.backNetMoniterListQueOut(index)
      }
    },
    // 设备选择事件-决定监控点可选项
    devSelEvent: function (index, inAndOutCheck) {
      console.log('输入-设备选择改变事件-分IO模块时/IO模块外两种情形')
      if (inAndOutCheck === 'input') {
        // 根据devSelIn(设备mac)去监控点列表中查询设备类型type
        console.log(index)
        console.log(this.form.inputRules[index].devSelIn)
        console.log(this.devTypeQue(this.form.inputRules[index].devSelIn))
        if (this.devTypeQue(this.form.inputRules[index].devSelIn) === 3) { // 若设备选择为IO模块
          // this.form.inputRules[index].devSelIOShow = true
          // this.form.inputRules[index].devSelNotIOShow = false
          this.isSelIODevShow = true
          this.isSelIOOtherDevShow = false
        } else { // 若设备选择为非IO模块
          // this.form.inputRules[index].devSelIOShow = false
          // this.form.inputRules[index].devSelNotIOShow = true
          this.isSelIODevShow = false
          this.isSelIOOtherDevShow = true
          // 初始化输入参数-监控点可选列表-根据mac去查询
          this.moniterOpitionInInit(index, this.form.inputRules[index].devSelIn)
        }
      } else if (inAndOutCheck === 'output') {
        // 初始化输出参数-监控点可选列表-根据mac去查询
        this.moniterOpitionOutInit(index, this.form.outputRules[index].devSelOut)
      }
    },
    // 输出-监控点选择改变事件
    monitorSelEventOut: function (value) {
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
        console.log('获取网关下监控点列表 输入，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表单初始化
        console.log(dataOld)
        // 输入-设备可选项重置
        this.devTypeOpitionInInit(index, response.data)
        console.log(this.form.inputRules[index].devOptionsIn)
        this.form.inputRules[index].devSelIn = dataOld.inputRules[index].mac
        // 根据Mac 查找设备类型
        let devType = this.getDevType(this.form.inputRules[index].devSelIn, response.data)
        // 根据 devType 处理IO显示模块，及其需要转化显示数值
        if (devType === 3) {
          // ...IO模块时
          this.isSelIODevShow = true
          this.isSelIOOtherDevShow = false
          // 路数状态显示处理
          if (dataOld.inputRules[index].value === 1) {
            this.form.inputRules[index].interfaceNumberState = '1'
          } else {
            this.form.inputRules[index].interfaceNumberState = '0'
          }
        } else {
          // 非IO模块
          this.isSelIODevShow = false
          this.isSelIOOtherDevShow = true
          if (devType === 7) {
            // ...风阀
            this.form.inputRules[index].valueIn = this.moniterDataChange(0, 4095, 0, 90, dataOld.inputRules[index].value)
          } else if (devType === 11) {
            // ...温度
            this.form.inputRules[index].valueIn = this.moniterDataChange(600, 3000, -50, 150, dataOld.inputRules[index].value)
          } else if (devType === 12) {
            // ...压力
            this.form.inputRules[index].valueIn = this.moniterDataChange(600, 3000, 0, 5000, dataOld.inputRules[index].value)
          } else if (devType === 13) {
            // ...噪声
            this.form.inputRules[index].valueIn = this.moniterDataChange(600, 3000, 30, 120, dataOld.inputRules[index].value)
          } else {
            // ...其他所有不需转化数值设备
            this.form.inputRules[index].valueIn = dataOld.inputRules[index].value
          }
        }
        // 输入-设备选择改变事件-监控点可选项重置
        this.moniterOpitionInInitTest(index, this.form.inputRules[index].devSelIn, response.data)
        this.form.inputRules[index].moniterSelIOOtherIn = dataOld.inputRules[index].streamId
      }.bind(this))
    },
    // back查询网关下监控点列表。输出  得到设备可选项，监控点可选项
    backNetMoniterListQueOutPri: function (index, dataOld) {
      back.netMoniterListQue(this.param).then(function (response) {
        console.log('获取网关下监控点列表 输出，返回监控点信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表单初始化
        console.log(dataOld)
        // 输出-设备可选项重置
        this.devTypeOpitionOutInit(index, response.data)
        console.log(this.form.outputRules[index].devOptionsOut)
        this.form.outputRules[index].devSelOut = dataOld.outputRules[index].mac
        // 根据Mac 查找设备类型
        let devType = this.getDevType(this.form.outputRules[index].devSelOut, response.data)
        // 根据 devType 转化显示数值
        if (devType === 7) {
          // ...风阀
          this.form.outputRules[index].activeDataOut = this.moniterDataChange(0, 4095, 0, 90, dataOld.inputRules[index].value)
        } else if (devType === 11) {
          // ...温度
          this.form.outputRules[index].activeDataOut = this.moniterDataChange(600, 3000, -50, 150, dataOld.inputRules[index].value)
        } else if (devType === 12) {
          // ...压力
          this.form.outputRules[index].activeDataOut = this.moniterDataChange(600, 3000, 0, 5000, dataOld.inputRules[index].value)
        } else if (devType === 13) {
          // ...噪声
          this.form.outputRules[index].activeDataOut = this.moniterDataChange(600, 3000, 30, 120, dataOld.inputRules[index].value)
        } else {
          // ...其他所有不需转化数值设备
          this.form.outputRules[index].activeDataOut = dataOld.outputRules[index].value
        }
        // 输出-设备选择改变事件-监控点可选项重置
        this.moniterOpitionOutInitTest(index, this.form.outputRules[index].devSelOut, response.data)
        console.log(this.form.outputRules[index].monitorOptionsOut)
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
        this.form.inputRules[index].monitorOptionsIn = []
        this.form.inputRules[index].moniterSelIOOtherIn = ''
        // 初始化输入参数-路数选择
        this.form.inputRules[index].interfaceNumber = ''
        // 初始化输入参数-路数状态
        this.form.inputRules[index].interfaceNumberState = ''
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
        this.form.outputRules[index].monitorOptionsOut = []
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
          this.loadingFlag = false
          return
        }
        // back查询规则列表
        this.backRuleListQue()
      }.bind(this))
    },
    // 后台获取规则详情 index-表格第几项
    backRuleInfoQue: function (index) {
      index = 0 // index暂时固定为0，因为隐藏掉了多个输入/输出规则
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
        // this.form.inputRules[index].valueIn = response.data.inputRules[index].value
        this.form.inputRules[index].order = response.data.inputRules[index].order
        // if (this.form.inputRules[index].order !== 100) {
        //   // 为IO模块
        //   console.log('为IO模块')
        //   this.isSelIODevShow = true
        //   this.isSelIOOtherDevShow = false
        //   // 路数状态显示处理
        //   if (response.data.inputRules[index].value === 1) {
        //     this.form.inputRules[index].interfaceNumberState = '1'
        //   } else {
        //     this.form.inputRules[index].interfaceNumberState = '0'
        //   }
        //   // this.selIODevShow(index, 1) // param参数传0为false,传1为true
        //   // this.devSelIOOtherShowTest(index, 0)
        // } else if (this.form.inputRules[index].order === 100) {
        //   // 非IO模块
        //   console.log('非IO模块')
        //   this.isSelIODevShow = false
        //   this.isSelIOOtherDevShow = true
        //   // this.selIODevShow(index, 0) // param参数传0为false,传1为true
        //   // this.devSelIOOtherShowTest(index, 1)
        // }
        // ...输出部分
        this.form.outputRules[index].netSelOut = response.data.outputRules[index].sn
        // back查询网关下监控点列表。得到设备可选项，监控点可选项
        this.param.sn = this.form.outputRules[index].netSelOut
        this.backNetMoniterListQueOutPri(index, response.data)
        // this.form.outputRules[index].mac = response.data.outputRules[index].mac
        // this.form.outputRules[index].streamId = response.data.outputRules[index].streamId
        this.form.outputRules[index].condition = response.data.outputRules[index].condiition
        // this.form.outputRules[index].activeDataOut = response.data.outputRules[index].value
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
      this.form.inputRules[index].devOptionsIn = list
      // this.form.inputRules[index].devSelIn = this.form.inputRules[index].devOptionsIn[0].value // 默认设备选择可选项第一个
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
      this.form.outputRules[index].devOptionsOut = list
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
        this.form.outputRules[index].devOptionsOut = fengfaList
      }
      console.log(123456)
      console.log(this.form.outputRules[index].devOptionsOut)
      console.log(this.form.inputRules[index].devSelIn)
      // this.form.outputRules[index].devSelOut = this.form.outputRules[index].devOptionsOut[0].value // 默认设备选择可选项第一个
    },
    // 根据devSelIn(mac地址)找到监控点列表中的设备类型type
    devTypeQue: function (devSel) {
      let netMoniterListAll = []
      netMoniterListAll = this.netMonierListPri.concat(this.netMonierListPriOut)
      console.log(netMoniterListAll)
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
      this.form.inputRules[index].monitorOptionsIn = list
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
      this.form.outputRules[index].monitorOptionsOut = list
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
        this.form.inputRules[index].monitorOptionsIn = list
        console.log(this.form.inputRules[index].monitorOptionsIn)
        return
      }
      // ***** 设备选择改变，则初始化表单 ******
      this.form.inputRules[index].monitorOptionsIn = list
      this.form.inputRules[index].moniterSelIOOtherIn = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留
      // 初始化输入参数-路数选择
      this.form.inputRules[index].interfaceNumber = ''
      // 初始化输入参数-路数状态
      this.form.inputRules[index].interfaceNumberState = ''
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
      this.form.outputRules[index].monitorOptionsOut = list
      this.form.outputRules[index].moniterSelOut = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留'
      // 初始化输出参数-触发数值
      this.form.outputRules[index].activeDataOut = ''
      // // 初始化输出参数-触发动作
      // this.form.outputRules[index].activeSelOut = ''
    },
    // 设备mac -> 设备type  param: mac，监控点列表
    getDevType: function (mac, data) {
      for (let i = 0; i < data.length; i++) {
        if (mac === data[i].mac) {
          return data[i].type
        }
      }
      return null
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
