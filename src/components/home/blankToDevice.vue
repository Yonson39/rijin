<template>
  <div id="blankToDevice">
    <h3>设备界面加载中</h3>
  </div>
</template>

<script>
import Routers from '@/router'
export default {
  data () {
    return {}
  },
  mounted () {
    var userId = true
    // 无法获取到用户id，数据异常，退回到登陆界面
    if (!userId) {
      Routers.push({ path: '/login' })
    } else {
      Routers.push({ path: '/home/device' })
    }
  }
}
</script>
