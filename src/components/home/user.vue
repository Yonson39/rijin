<template>
    <!-- 构建信息表单 -->
    <div id="userset">

      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-title" label-width="120px">
            <el-form-item class="usertitle">
              <span  class="usertitletext">个人中心</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="用户名">
              <el-input readonly v-model="formInline.name"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="changenameBt">更改用户名</el-button>
          </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="公 司">
              <el-input readonly v-model="formInline.company"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changecompanyBt">更改公司</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="手 机">
              <el-input readonly v-model="formInline.mobile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changephoneBt">更改手机</el-button>
            </el-form-item>
            <el-form-item v-show="false">
              <el-button type="primary" @click="unbindphoneBt">解绑手机</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="邮 箱">
              <el-input readonly v-model="formInline.mail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changemailBt">更改邮箱</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row> -->
     <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="用户ID">
              <el-input readonly v-model="formInline.userId"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="密 码">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changepassBt">更改密码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row> -->

      <!-- 更改手机号对话框 -->
      <el-dialog title="更改手机号" :visible.sync="phonedialogFormVisible" width="500px">
        <el-form ref="phoneruleform" :model="phoneruleform" :rules="rules" label-width="80px">
          <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="phoneruleform.phone" auto-complete="off" placeholder="请输入手机号">
            <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="phoneGetVeriCode">获取验证码</el-button>
            <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="VeriCode">
            <el-input type="text" v-model="phoneruleform.VeriCode" auto-complete="off" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePhoneHandleSave('phoneruleform')">修改</el-button>
            <el-button @click="phonedialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 更改密码对话框 -->
      <el-dialog title="更改密码" :visible.sync="passdialogFormVisible" width="500px">
        <el-form ref="passruleform" :model="passruleform" :rules="rules" label-width="80px">
          <el-form-item label="旧密码" prop="oldpass">
            <el-input type="password" v-model="passruleform.oldpass"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input type="password" v-model="passruleform.newpass"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpass">
            <el-input type="password" v-model="passruleform.confirmpass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="passHandleChange">修改</el-button>
            <el-button @click="passdialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script type="text/javascript">
import 'element-ui/lib/theme-chalk/index.css'
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  data () {
    // 自定义校验规则
    // 旧密码
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value !== this.formInline.password) {
        callback(new Error('旧密码不正确'))
      } else {
        if (this.passruleform.newpass !== '') {
          this.$refs.passruleform.validateField('newpass')
        }
        callback()
      }
    }
    // 新密码
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.formInline.password) {
        callback(new Error('新密码不能与旧密码相同'))
      } else {
        if (this.passruleform.confirmpass !== '') {
          this.$refs.passruleform.validateField('confirmpass')
        }
        callback()
      }
    }
    // 确认新密码
    var validatePassConf = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passruleform.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var checkVeriCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else if (value === this.formInline.mobile) {
        callback(new Error('新手机号码不能与旧手机号码相同'))
      } else {
        callback()
      }
    }
    return {
      // 用户整体信息
      formInline: {
        name: '',
        mobile: '',
        mail: '',
        company: '',
        password: '',
        userId: ''
      },
      phoneruleform: {
        phone: '',
        VeriCode: '',
        VerCodeToken: ''
      },
      passruleform: {
        oldpass: '',
        address: '',
        confirmpass: ''
      },
      // 校验规则
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        oldpass: [
          {validator: validatePassOld, trigger: 'blur'},
          {min: 5, max: 16, message: '密码长度必须大于5位小于16位', triiger: 'blur'}
        ],
        newpass: [
          {validator: validatePassNew, trigger: 'blur'},
          {min: 5, max: 16, message: '密码长度必须大于5位小于16位', triiger: 'blur'}
        ],
        confirmpass: [
          {validator: validatePassConf, trigger: 'blur'},
          {min: 5, max: 16, message: '密码长度必须大于5位小于16位', triiger: 'blur'}
        ]
      },
      phoneVeriCode: '',                // 更换手机时的验证码
      passwordComputedTime: 0,          // 更换手机短信倒数记时
      phonedialogFormVisible: false,    // 手机号修改对话框
      passdialogFormVisible: false      // 密码修改对话框
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 如果刷新页面，则重新获取用户下挂信息userId
    var userId = sessionGetStore('userId')
    // console.log(userId)
    this.formInline.userId = userId
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 用户信息查询
    this.apiuserque()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 更改用户名
    changenameBt () {
      this.$prompt('用户名', '更改用户名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fff\w]{3,18}$/,
        inputErrorMessage: '只能包含数字、字母、汉字和下划线，长度在3~18之间'
      }).then(({value}) => {
        this.formInline.name = value
        this.apiusermod()
      }).catch(() => {
      })
    },
    // 更改公司
    changecompanyBt () {
      this.$prompt('公司', '更改公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.formInline.company = value
        this.apiusermod()
      }).catch(() => {
      })
    },
    // 更改手机号
    changephoneBt () {
      this.phoneruleform = {phone: '', VeriCode: ''}
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.phonedialogFormVisible = true
      this.passwordComputedTime = 0
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 更换手机，获取验证码
    phoneGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.phoneruleform.phone)) {
        this.passwordComputedTime = 60
        this.passTimer = setInterval(() => {
          this.passwordComputedTime--
          if (this.passwordComputedTime === 0) {
            clearInterval(this.passTimer)
          }
        }, 1000)
        // this.formInline.mobile = this.phoneruleform.phone
        // 发送短信验证信息
        this.backSmsSend()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    // 解绑手机
    unbindphoneBt () {
      this.$confirm('确认解绑吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'cancel'
      }).then(({value}) => {
        this.formInline.mobile = ''
        this.apiusermod()
      }).catch(() => {
      })
    },
    // // 更改邮箱
    // changemailBt () {
    //   this.$prompt('邮 箱', '更改邮箱', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //     inputErrorMessage: '格式不正确'
    //   }).then(({value}) => {
    //     console.log(value)
    //     this.formInline.mail = value
    //     this.apiusermod()
    //   }).catch(() => {
    //   })
    // },
    // 更改密码
    changepassBt () {
      this.passruleform.oldpass = ''
      this.passruleform.address = ''
      this.passruleform.confirmpass = ''
      this.passdialogFormVisible = true
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 确认手机号更改
    changePhoneHandleSave () {
      this.$refs.phoneruleform.validate((valid) => {
        if (valid && this.phoneruleform.VeriCode === this.phoneruleform.VerCodeToken) {
          this.formInline.mobile = this.phoneruleform.phone
          this.apiusermod()
          this.phonedialogFormVisible = false
          // 清除输入信息
          this.phoneruleform.phone = ''
          this.phoneruleform.VeriCode = ''
        } else if (this.phoneruleform.VeriCode !== this.phoneruleform.VerCodeToken) {
          this.notificationInfo('错误提示', '验证码不正确')
        } else {
          return false
        }
      })
    },
    // 确认密码修改
    passHandleChange () {
      this.$refs.passruleform.validate((valid) => {
        if (valid) {
          this.formInline.password = this.passruleform.newpass
          this.apiusermod()
          this.passdialogFormVisible = false
          this.passruleform.oldpass = ''
          this.passruleform.newpass = ''
          this.passruleform.confirmpass = ''
        } else {
          return false
        }
      })
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户信息查询
    apiuserque: function () {
      back.getuserInfo(this.formInline).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.formInline.name = response.data.name
        this.formInline.mobile = response.data.mobile
        this.formInline.company = response.data.company
        // this.formInline.password = response.data.password
      }.bind(this))
    },
    // 用户信息修改
    apiusermod: function () {
      back.userMod(this.formInline).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('修改失败，错误提示：', response.error)
          // 用户信息查询
          this.apiuserque()
          return
        }
        this.$store.commit('setUserName', this.formInline.name)
        // 用户信息查询
        this.apiuserque()
      }.bind(this))
    },
    // 发送短信验证信息
    backSmsSend: function (email) {
      back.smsSend(this.formInline).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 存储获取到的验证码
        this.phoneruleform.VerCodeToken = response.data[0].code
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
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
#userset {
  background-color: #F8F8FF;
  overflow-y: auto;
}
.from-inline {
  float: left;
  margin-left: 20px;
}
.from-title {
  width: 100%;
  height: 100%;
  float: left;
  border-bottom: solid 1px silver;
  margin-bottom: 20px;
}
.usertitle {
  float: left;
  margin: 0;
    margin-left: 28px;
}
.usertitletext {
  color: black;
  font-size: 20px;
}

.el-message-box__header {
position: relative;
padding: 15px 15px 10px;
background-color: #409EFF;
}
.el-message-box__title {
padding-left: 0;
margin-bottom: 0;
font-size: 18px;
line-height: 1;
color: #303133;
text-align: center;
}
.el-dialog__header {
padding: 15px 15px 10px;
background-color: #409EFF;
}
.el-dialog__title {
line-height: 24px;
font-size: 18px;
color: #303133;
text-align: center;
}
</style>
