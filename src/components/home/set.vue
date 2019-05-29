<template>
  <div>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button type="text" class="setButton" icon="el-icon-arrow-left" @click="backToMap">编辑</el-button>
            </div>
          </el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
        </el-row>
      </el-header>

      <el-main class="setmain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="tableDataGroup"
          border
          style="width: 100%"
          >
          <el-table-column
            fixed
            prop="name"
            label="分组名称"
            header-align="center"
            min-width="50%">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            header-align="center"
            min-width="50%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <!-- <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-footer>
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="groupaddinit">添加分组</el-button>
      
        <el-dialog title="添加新分组" :visible.sync="groupDialogFormVisible" width="300px" center>
          <el-form ref="groupRuleForm" :model="groupRuleForm" label-width="80px">
            <el-form-item label="新分组名" prop="groupName">
              <el-input v-model="groupRuleForm.groupName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleGroup('groupRuleForm')">确定</el-button>
              <el-button @click="groupDialogFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'gruopSetDiv',
  data () {
    return {
      // 参数，用于API请求
      param: {
        userId: '',
        groupName: '',
        groupId: ''
      },
      // 存储所有设备及分组信息
      netInfo: [
      ],
      // 存储分组信息
      tableDataGroup: [{
        name: 'Default',
        id: ''
      }],
      // 存储分组表单信息
      groupRuleForm: {
        index: 1,
        groupName: '',
        groupId: ''
      },
      formAddOrModify: 0,       // 分组添加与编辑标志 0-add,1-modify
      groupDialogFormVisible: false,
      loadingFlag: false
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 如果刷新页面，则重新获取用户下挂信息 userId
    this.param.userId = sessionGetStore('userId')
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 获取用户下网关列表
    // *关联模块中，可得到网关组名,网关详细信息
    this.backUserNetListQue()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 返回，跳转至地图页面
    backToMap: function () {
      Routers.push({ path: '/home/map' })
    },
    // 添加设备小组-打开对话框
    groupaddinit: function () {
      console.log('timestart')
      this.formAddOrModify = 0
      this.groupRuleForm.groupName = ''
      this.groupRuleForm.groupId = ''
      this.groupDialogFormVisible = true
    },
    // 编辑设备组信息-打开对话框
    handleEdit: function (index, row) {
      this.formAddOrModify = 1
      this.groupRuleForm.groupName = this.tableDataGroup[index].name
      this.groupRuleForm.groupId = this.tableDataGroup[index].id
      this.groupRuleForm.index = index
      this.groupDialogFormVisible = true
      console.log(index)
      console.log(row)
    },
    // 添加编辑设备小组信息-对话框确定按键
    handleGroup: function () {
      if (this.groupRuleForm.groupName === '') {
        this.notificationInfo('错误提示：', '分组名称不能为空')
        return
      }
      if (this.groupRuleForm.groupName.length > 16) {
        this.notificationInfo('错误提示：', '分组名称长度不能大于16字符')
        return
      }
      if (this.formAddOrModify === 1) {
        if (this.tableDataGroup[this.groupRuleForm.index].name === 'Default') {
          this.$message({
            type: 'info',
            message: 'Default不可修改删除'
          })
          return
        }
      }
      if (this.checkGroupName(this.groupRuleForm.groupName)) {
        this.$message({
          type: 'info',
          message: '小组名称不可重复'
        })
        return
      }
      this.param.groupName = this.groupRuleForm.groupName
      this.param.groupId = this.groupRuleForm.groupId
      if (this.formAddOrModify === 0) {
        this.backNetGroupAdd()
      } else if (this.formAddOrModify === 1) {
        this.backNetGroupMod()
      }
      this.groupDialogFormVisible = false
    },
    // 删除选中行的小组
    handleDelete: function (index, row) {
      if (this.tableDataGroup[index].name === 'Default') {
        this.$message({
          type: 'info',
          message: 'Default不可修改删除'
        })
        return
      }
      // 区分两种情况，小组下有设备的删除与无设备的删除
      let checkFlag = true
      if (this.checkGroupDevice(this.tableDataGroup[index].name)) {
        this.$confirm('此小组下存在设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          checkFlag = true
          this.groupSetLoading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
          })
          this.param.groupId = row.id
          this.backDevGroupDel(index, row)
        }).catch(() => {
          checkFlag = false
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
      if (checkFlag) {
        this.groupSetLoading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        this.param.groupId = row.id
        this.backDevGroupDel(index, row)
      }
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // 添加网关分组
    backNetGroupAdd: function () {
      back.netGroupAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          // 前端存储
          let obj = {}
          obj.name = this.groupRuleForm.groupName
          obj.id = this.groupRuleForm.groupId
          this.tableDataGroup.splice(this.tableDataGroup.length, 0, obj)
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 获取用户下网关列表
        this.backUserNetListQue()
      }.bind(this))
    },
    // 编辑/修改选中设备组信息
    backNetGroupMod: function () {
      back.netGroupNameMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          let obj = {}
          obj.name = this.groupRuleForm.groupName
          obj.id = this.groupRuleForm.groupId
          this.tableDataGroup.splice(this.groupRuleForm.index, 1, obj)
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 获取用户下网关列表
        this.backUserNetListQue()
      }.bind(this))
    },
    // 删除选中设备组信息
    backDevGroupDel: function (index, row) {
      back.devGroupDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          this.tableDataGroup.splice(index, 1)
        } else {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 获取用户下网关列表
        this.backUserNetListQue()
        this.groupSetLoading.close()
      }.bind(this))
        .catch(function (err) {
          console.log(err)
          this.groupSetLoading.close()
        })
      // console.log('edit')
    },
    // 用户下网关列表获取
    backUserNetListQue: function () {
      back.userNetListQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 网关列表信息存储到当前组件内
        this.netListInfoStore(response)
        // home组件设备列表刷新标志位
        this.$store.commit('setdeviceGroupRefresh', true)
      }.bind(this))
    },
    //
    // ****************方法函数***********************
    //
    // 小组信息存储
    netListInfoStore: function (info) {
      let netGroupInfo = []
      if (info.data !== undefined) {
        for (let i = 0; i < info.data.length; i++) {
          let groupinfo = {}
          groupinfo.name = info.data[i].groupName
          groupinfo.id = info.data[i].groupId
          netGroupInfo[i] = groupinfo
        }
        this.netInfo = info.data
      }
      this.tableDataGroup = netGroupInfo
    },
    // 检查小组名称是否重复
    checkGroupName: function (name) {
      let checkFlag = false
      for (let i = 0; i < this.tableDataGroup.length; i++) {
        if (this.tableDataGroup[i].name === name) {
          checkFlag = true
          return checkFlag
        }
      }
      return checkFlag
    },
    // 检查当前小组下是否有网关
    checkGroupDevice: function (name) {
      let checkFlag = false
      for (let i = 0; i < this.netInfo.length; i++) {
        if (this.netInfo[i].groupName === name) {
          if (this.netInfo[i].netgates !== undefined) {
            checkFlag = true
            return checkFlag
          }
        }
      }
      return checkFlag
    }
  }
}
</script>

<style scoped>
.setButton {
  font-size: 20px;
}
.el-container {
  display: flex;
  display: -webkit-flex; /* Safari */
  position: relative;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  background-color: #FFFFFF;
}
.el-main {
  padding: 0px;
  flex: 1;
}
.el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  text-align: left;
  line-height: 60px;
  height: 60px;
}
.el-footer {
  bottom:0px;
  left: 0px;
}
.setmain {
  height: 100px;
  overflow: auto;
}
.el-dialog .el-dialog__header {
  text-align: center;
  color: rgb(65, 81, 226);
  background-color: #409EFF;
}
</style>
