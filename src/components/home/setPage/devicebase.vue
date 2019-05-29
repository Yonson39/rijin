<template>
  <div class="deviceSet">
    <!-- <h2>devicebase 页面</h2> -->
    <el-container>
       <el-header class="secondtitle" height="39px">
        <template>
          <el-tabs v-model="activeName" @tab-click="toSetData">
            <el-tab-pane label="网关基本信息" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="网关数据限制" name="second"></el-tab-pane> -->
            <el-tab-pane label="网关位置信息" name="second"></el-tab-pane>
            <!-- <el-tab-pane label="网关远程更新" name="fourth"></el-tab-pane> -->
            <el-tab-pane label="网关联动规则" name="third"></el-tab-pane>
          </el-tabs>
        </template>
      </el-header>
      <el-container class="deviceInfomain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    // 页面刷新tabs标签判断
    this.tabPaneSet()
  },
  methods: {
    // Tabs标签页点击跳转
    toSetData (tab, event) {
      if (tab.index === '0') Routers.push({ path: '/home/device/set/deviceinfo' })
      // if (tab.index === '1') Routers.push({ path: '/home/device/set/deviceSetData' })
      if (tab.index === '1') Routers.push({ path: '/home/device/set/deviceMap' })
      // if (tab.index === '3') Routers.push({ path: '/home/device/set/deviceUpdate' })
      if (tab.index === '2') Routers.push({ path: '/home/device/set/deviceLinkage' })
    },
    // Tabs标签刷新页面保存(通过url来判断)
    tabPaneSet () {
      let url = window.location.href
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'deviceInfo') this.activeName = 'first'
      // if (arrUrl[arrUrl.length - 1] === 'deviceSetData') this.activeName = 'second'
      if (arrUrl[arrUrl.length - 1] === 'deviceMap') this.activeName = 'second'
      // if (arrUrl[arrUrl.length - 1] === 'deviceUpdate') this.activeName = 'fourth'
      if (arrUrl[arrUrl.length - 1] === 'deviceLinkage') this.activeName = 'third'
    }
  }
}
</script>

<style scoped>
.deviceSet {
  overflow: hidden;
  height: 100%;
}
.deviceInfomain {
  bottom: 0;
  overflow: hidden;
}
/* 加了这个保证子组件地图容器有高度，能正常显示地图，
否则要先用到alramBase的非scoped高度 */
.el-container {
  width: 100%;
  height: 100%;
}
</style>
