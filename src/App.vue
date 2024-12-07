<script>
  import {
    sendMessageAPI
  } from './api/api-user'
  export default {
    onLaunch: function() {
      console.log('App Launch')
      // 设置运行标记
      this.isRunning = true
    },

    onShow: function() {
      console.log('App Show')
    },

    onHide: function() {
      console.log('App Hide')
      // 检查是否是异常重启（如果 isRunning 未定义，说明是新进程）
      if (this.isRunning === undefined) {
        console.log('小程序已被销毁')
        this.notifyAbnormalExit()
      } else {
        console.log('小程序正常退出')
      }
    },

    methods: {
      async notifyAbnormalExit() {
        // 测试发送短信验证码
        const testPhone = '13800138000' // 测试用手机号
        sendMessageAPI(testPhone)
          .then(res => {
            console.log('短信发送成功：', res)
          })
          .catch(err => {
            console.error('短信发送失败：', err)
          })
        // try {
        //   await sendMessageAPI({
        //     type: 'abnormal_exit',
        //     timestamp: new Date().getTime()
        //   })
        //   console.log('已通知后端小程序异常退出')
        // } catch (err) {
        //   console.error('通知后端失败：', err)
        // }
      }
    }
  }
</script>

<style lang="scss">
  @import "./uni_modules/vk-uview-ui/index.scss";
  //@import "colorui/main.css";
  @import "colorui/icon.css";
</style>