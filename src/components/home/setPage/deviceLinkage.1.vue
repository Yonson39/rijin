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
          <!-- <el-table-column
            label="状态"
            header-align="center"
            min-width="10%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="(scope.row.state === 0) ? '未启动': '已启动'"  placement="right">
                <el-button type="text" :icon="(scope.row.state === 0) ? 'el-icon-remove' : 'el-icon-circle-check'"></el-button>
              </el-tooltip>
            </template>
          </el-table-column> -->
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
              <!-- <el-button type="text" size="small" icon="el-icon-check" @click="ruleRunBtn(scope.$index, scope.row)">启动</el-button> -->
              <el-button type="text" size="small" icon="el-icon-delete" @click="ruleDelBtn(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="60px">
        <div class="addgroup">
          <el-dialog title="创建规则" :visible.sync="ruleDIaFormVisible" width="800px" center>
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
              <div class="" v-for="(item,index) in form.ruleInGroup" :key="index">
                <div class="inNume">触发条件{{index + 1}}</div>
                <!-- 情形一-设备选择IO模块时 -->
                <div class="triCondition" v-show="devSelIOShowTest(index)" name="情形一-设备选择IO模块时">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelIn" placeholder="选择网关类型" @change="netChangeEvent(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="changeDevTypeIn(index)" placeholder="选择设备类型">
                          <el-option v-for="item in form.ruleInGroup[index].devTypeOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
                        <el-select v-model="item.netSelIn" placeholder="选择网关类型" @change="netChangeEvent(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelIn" @change="changeDevTypeIn(index)" placeholder="选择设备类型">
                          <el-option v-for="item in form.ruleInGroup[index].devTypeOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
                          <el-option v-for="item in form.ruleInGroup[index].moniterOpitionIn" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
              <div class="" v-for="(item, index) in form.ruleOutGroup" :key="index + '-label'">
                <div class="inNume">执行动作{{index + 1}}</div>
                <div class="triCondition">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="网关选择" label-width="100px">
                        <el-select v-model="item.netSelOut" placeholder="选择网关类型" @change="netChangeEventOut(index)">
                          <el-option v-for="item in netSelOpitions" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="设备选择" label-width="100px">
                        <el-select v-model="item.devSelOut" placeholder="选择设备类型" @change="changeDevTypeOut(index)">
                          <el-option v-for="item in form.ruleOutGroup[index].devTypeOpitionOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
                          <el-option v-for="item in form.ruleOutGroup[index].moniterOpitionOut" :key="item.id" :label="item.label" :value="item.value"></el-option>
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
              <el-button @click="ruleDIaFormVisible = false">取 消</el-button>
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
          state: 1,             // 场景状态 0-未启动 1-已启动
          sceneCreatTime: ''    // 创建时间
        }
      ],
      editBtnFlag: false,       // 编辑/查看详情标志位
      netMonierListPri: [], // 某网关下监控点列表全部数据
      netMonierListPriOut: [], // 某网关下监控点列表全部数据
      moniterListData: [], // 存储所有网关下监控点列表
      // 存储对话框表单信息
      form: {
        index: 1,               // 当前选中行数
        name: '',               // 场景名称
        describe: '',           // 场景描述
        ruleInGroup: [
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
            condition: '',    // 联动条件
            valueIn: ''         // 触发数值
          }
        ],
        // 输出参数部分
        ruleOutGroup: [
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
      ruleDIaFormVisible: false,     // 场景对话框显示标志位
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
      activeModShow: false          // 选择状态 显示
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
      this.ruleDIaFormVisible = true
      this.editBtnFlag = false
    },
    // 详情场景规则按钮
    ruleInfoBt: function (index, row) {
      console.log('详情场景规则按钮')
      console.log(index)
      console.log(row)
      console.log(this.ruleTableData)
      this.ruleDIaFormVisible = true
      this.editBtnFlag = true
      this.param.ruleId = row.ruleId
      // 后台获取规则详情
      this.backRuleInfoQue()
    },
    // 场景对话框表单确定按钮
    formDIaConfirm: function () {
      console.log('场景对话框表单确定按钮')
      console.log(this.form)
      // form表单输入规则数据格式 => param所需输入规则数据格式
      let inputRulesData = []
      for (let i = 0; i < this.form.ruleInGroup.length; i++) {
        let obj = {}
        obj.sn = this.form.ruleInGroup[i].netSelIn
        obj.mac = this.form.ruleInGroup[i].devSelIn
        obj.name = '规则1'
        // obj.streamId = this.form.ruleInGroup[i].moniterSelIOOtherIn
        // 若选io模块，则streamId需要去查；选非IO模块，则直接是this.form.ruleInGroup[i].moniterSelIOOtherIn
        if (this.devTypeQue(this.form.ruleInGroup[i].devSelIn) === 3) {
          obj.streamId = this.IOStreamId
        } else {
          obj.streamId = this.form.ruleInGroup[i].moniterSelIOOtherIn
        }
        obj.type = this.devTypeQue(this.form.ruleInGroup[i].devSelIn)
        obj.condition = this.form.ruleInGroup[i].condition
        // obj.value = Number(this.form.ruleInGroup[i].valueIn)
        // 若选io模块，选非IO模块 
        if (this.devTypeQue(this.form.ruleInGroup[i].devSelIn) === 3) {
          obj.value = Number(this.form.ruleInGroup[i].IOwayStation)
        } else {
          obj.value = Number(this.form.ruleInGroup[i].valueIn)
        }
        obj.order = Number(this.form.ruleInGroup[i].IOwayNum)
        inputRulesData[i] = obj
      }
      // form表单输出规则数据格式 => param所需输出规则数据格式
      let outputRulesData = []
      for (let i = 0; i < this.form.ruleOutGroup.length; i++) {
        let obj = {}
        obj.sn = this.form.ruleOutGroup[i].netSelOut
        obj.mac = this.form.ruleOutGroup[i].devSelOut
        obj.name = '规则2'
        obj.streamId = this.form.ruleOutGroup[i].moniterSelOut
        obj.type = this.devTypeQue(this.form.ruleOutGroup[i].devSelOut)
        obj.condition = '>'
        obj.value = Number(this.form.ruleOutGroup[i].activeDataOut)
        outputRulesData[i] = obj
      }
      // 存储param参数
      this.param.name = this.form.name
      this.param.content = this.form.describe
      this.param.groupId = sessionGetStore('groupIdNow')
      this.param.inputRules = inputRulesData
      this.param.outputRules = outputRulesData
      this.backRuleAdd()
      this.ruleDIaFormVisible = false
    },
    // // 启动场景规则按钮
    // ruleRunBtn: function (index, row) {
    //   console.log('启动场景规则按钮')
    // },
    // 删除场景规则按钮
    ruleDelBtn: function (index, row) {
      console.log('删除场景规则按钮')
      console.log(index)
      console.log(row)
      // this.backRuleDel() // 注意ruleId参数传递
    },
    // 新增触发条件按钮
    addIn: function () {
      console.log('新增触发条件按钮')
      this.form.ruleInGroup.push({
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
      this.form.ruleOutGroup.push({
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
      if (this.form.ruleInGroup.length > 1) {
        this.form.ruleInGroup.splice(index, 1)
      }
    },
    // 删除触发条件按钮
    delOut: function (index) {
      console.log(index)
      if (this.form.ruleOutGroup.length > 1) {
        this.form.ruleOutGroup.splice(index, 1)
      }
    },
    // v-show判断辅助函数
    devSelIOShowTest: function (index) {
      console.log('IO模块show判断辅助函数')
      console.log(index)
      let devSelIOShow = this.form.ruleInGroup[index].devSelIOShow
      console.log(devSelIOShow)
      return devSelIOShow // true/false
    },
    // v-show判断辅助函数
    devSelIOOtherShowTest: function (index) {
      console.log('非IO模块show判断辅助函数')
      console.log(index)
      let devSelIOOtherShow = this.form.ruleInGroup[index].devSelIOOtherShow
      console.log(devSelIOOtherShow)
      return devSelIOOtherShow
    },
    //
    // *********** 选择框改变事件 ************
    //
    // 
    // 输入-网关选择事件-决定设备选项列表
    netChangeEvent: function (index, sn) { // 若没有index参数，change事件默认参数值为当前所选中的value值
      console.log('输入-网关选择事件-决定设备选项列表')
      console.log(index)
      console.log(sn) // undefined
      console.log(this.form.ruleInGroup[index].netSelIn)
      console.log(this.form.ruleInGroup[index].devSelIn)
      this.param.sn = this.form.ruleInGroup[index].netSelIn
      this.backNetMoniterListQue(index)
    },
    // 输出-网关选择事件-决定设备选项列表
    netChangeEventOut: function (index, sn) { // 若没有index参数，change事件默认参数值为当前所选中的value值
      console.log('输出-网关选择事件-决定设备选项列表')
      console.log(index)
      console.log(sn) // undefined
      console.log(this.form.ruleOutGroup[index].netSelOut)
      this.param.sn = this.form.ruleOutGroup[index].netSelOut
      this.backNetMoniterListQueOut(index)
    },
    // 输入-设备选择改变事件-决定监控点选项列表
    changeDevTypeIn: function (index) {
      console.log('输入-设备选择改变事件-分IO模块时/IO模块外两种情形')
      console.log(index)
      console.log(this.form.ruleInGroup[index].devSelIn) // 设备mac地址
      // 根据devSelIn(mac地址)找到监控点列表中的设备类型type
      if (this.devTypeQue(this.form.ruleInGroup[index].devSelIn) === 3) { // 若设备选择为IO模块
        // 表单初始化
        this.form.ruleInGroup[index].devSelIOShow = true
        this.form.ruleInGroup[index].devSelIOOtherShow = false
      } else { // 若设备选择为非IO模块
        // 表单初始化
        this.form.ruleInGroup[index].devSelIOShow = false
        this.form.ruleInGroup[index].devSelIOOtherShow = true
        // 初始化输入参数-监控点可选列表-根据mac去查询
        this.moniterOpitionInInit(index, this.form.ruleInGroup[index].devSelIn)
      }
    },
    // 输出-设备选择改变事件-决定监控点选项列表
    changeDevTypeOut: function (index) {
      console.log('输出-设备选择改变事件-分IO模块时/IO模块外两种情形')
      console.log(index)
      console.log(this.form.ruleOutGroup[index].devSelOut) // 设备mac地址
      // 初始化输出参数-监控点可选列表-根据mac去查询
      this.moniterOpitionOutInit(index, this.form.ruleOutGroup[index].devSelOut)
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
    // 获取网关下监控点列表，返回监控点信息,streamId
    backNetMoniterListQuePri: function (data) {
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
        // 输入-设备可选列表重置
        this.devTypeOpitionInInit(0, response.data)
        // 表单初始化
        console.log(data)
        this.form.ruleInGroup[0].devSelIn = data.inputRules[0].mac
        // 输入-设备选择改变事件-决定监控点选项列表
        this.moniterOpitionInInit(0, this.form.ruleInGroup[0].devSelIn)
        this.form.ruleInGroup[0].moniterSelIOOtherIn = data.inputRules[0].streamId
        console.log(1234564874)
        console.log(this.form.ruleInGroup[0].devTypeOpitionIn)
        console.log(this.form.ruleInGroup[0].mac)
      }.bind(this))
    },
    // 获取网关下监控点列表，返回监控点信息,streamId
    backNetMoniterListQueOutPri: function (data) {
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
        // 输入-设备可选列表重置
        this.devTypeOpitionOutInit(0, response.data)
        // 表单初始化
        console.log(data)
        this.form.ruleOutGroup[0].devSelOut = data.outputRules[0].mac
        // 输入-设备选择改变事件-决定监控点选项列表
        this.moniterOpitionInInit(0, this.form.ruleOutGroup[0].devSelOut)
        this.form.ruleOutGroup[0].moniterSelIOOtherOut = data.outputRules[0].streamId
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
        this.form.ruleInGroup[index].devSelIn = '' // 避免上次网关选择某个设备后，再次切换网关则会造成设备选择的v-model残留
        // 初始化输入参数-监控点可选列表
        this.form.ruleInGroup[index].moniterOpitionIn = []
        this.form.ruleInGroup[index].moniterSelIOOtherIn = ''
        // 初始化输入参数-路数选择
        this.form.ruleInGroup[index].IOwayNum = ''
        // 初始化输入参数-路数状态
        this.form.ruleInGroup[index].IOwayStation = ''
        // 初始化输入参数-联动条件
        this.form.ruleInGroup[index].condition = ''
        // 初始化输入参数-触发数值
        this.form.ruleInGroup[index].valueIn = ''
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
        this.form.ruleOutGroup[index].devSelOut = '' // 避免上次网关选择某个设备后，再次切换网关则会造成设备选择的v-model残留
        // 初始化输入参数-监控点可选列表
        this.form.ruleOutGroup[index].moniterOpitionOut = []
        this.form.ruleOutGroup[index].moniterSelOut = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留'
        // 初始化输出参数-触发数值
        this.form.ruleOutGroup[index].activeDataOut = ''
        // // 初始化输出参数-触发动作
        // this.form.ruleOutGroup[index].activeSelOut = ''
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
    backRuleInfoQue: function () {
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
        this.form.ruleInGroup[0].netSelIn = response.data.inputRules[0].sn
        // 根据sn,查询可选设备列表得到显示设备
        this.param.sn = this.form.ruleInGroup[0].netSelIn
        this.backNetMoniterListQuePri(response.data)
        this.form.ruleInGroup[0].condition = response.data.inputRules[0].condition
        this.form.ruleInGroup[0].valueIn = response.data.inputRules[0].value
        this.form.ruleInGroup[0].order = response.data.inputRules[0].order
        // 
        this.form.ruleOutGroup[0].netSelOut = response.data.outputRules[0].sn
        this.backNetMoniterListQueOutPri(response.data)
        // this.form.ruleOutGroup[0].mac = response.data.outputRules[0].mac
        // this.form.ruleOutGroup[0].streamId = response.data.outputRules[0].streamId
        this.form.ruleOutGroup[0].condition = response.data.outputRules[0].condiition
        this.form.ruleOutGroup[0].activeDataOut = response.data.outputRules[0].value
        console.log(this.form)
      }.bind(this))
    },
    // 后台删除联动规则
    backRuleDel: function () {
      back.ruleDel(this.param).then(function (response) {
        console.log('后台删除联动规则')
        console.log(response)
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
      this.form.ruleInGroup[index].devTypeOpitionIn = list
      // this.form.ruleInGroup[index].devSelIn = this.form.ruleInGroup[index].devTypeOpitionIn[0].value // 默认设备选择可选项第一个
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
      this.form.ruleOutGroup[index].devTypeOpitionOut = list
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
        this.form.ruleOutGroup[index].devTypeOpitionOut = fengfaList
      }
      console.log(123456)
      console.log(this.form.ruleOutGroup[index].devTypeOpitionOut)
      console.log(this.form.ruleInGroup[index].devSelIn)
      // this.form.ruleOutGroup[index].devSelOut = this.form.ruleOutGroup[index].devTypeOpitionOut[0].value // 默认设备选择可选项第一个
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
        this.form.ruleInGroup[index].moniterOpitionIn = list
        console.log(this.form.ruleInGroup[index].moniterOpitionIn)
        return
      }
      // ***** 设备选择改变，则初始化表单 ******
      this.form.ruleInGroup[index].moniterOpitionIn = list
      this.form.ruleInGroup[index].moniterSelIOOtherIn = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留
      // 初始化输入参数-路数选择
      this.form.ruleInGroup[index].IOwayNum = ''
      // 初始化输入参数-路数状态
      this.form.ruleInGroup[index].IOwayStation = ''
      // 初始化输入参数-联动条件
      this.form.ruleInGroup[index].condition = ''
      // 初始化输入参数-触发数值
      this.form.ruleInGroup[index].valueIn = ''
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
      this.form.ruleOutGroup[index].moniterOpitionOut = list
      this.form.ruleOutGroup[index].moniterSelOut = '' // 避免上次设备选择某个设备后，再次切换设备则会造成监控点选择的v-model残留'
      // 初始化输出参数-触发数值
      this.form.ruleOutGroup[index].activeDataOut = ''
      // // 初始化输出参数-触发动作
      // this.form.ruleOutGroup[index].activeSelOut = ''
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
