<template>
  <div id="app">
    <transition name="fade">
      <router-view @transferuser="getuser"></router-view>
    </transition>
  </div>
</template>

<script>
import Routers from './router'

export default {
  name: 'App',
  data () {
    return {

    }
  },
  methods: {
    // 判断用户登录是否正确，跳转页面
    // 子组件emit触发，父组件监听
    getuser: function (msg) {
      if (msg === 'home') {
        Routers.push({ path: '/home' })
      } else if (msg === 'login') {
        Routers.push({ path: '/login' })
      }
    }
  }
}
</script>

<style>
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
html {
  display: block;
}
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(128, 141, 163);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* 额外加的，不知道师兄怎么没加这个，而只用#app的text-align就可以了 */
.el-table td {
  text-align: center!important;
}
.el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
  line-height: 40px;
}
.el-dialog__title{
  color: #303133;
}
/* line-height是强加的，师兄没有这个(或许是我没找到)，但是有这个效果 */
.el-dialog--center .el-dialog__body {
  text-align: left;
  padding: 25px 27px 20px;
  line-height: 24px;
}
</style>
