<template>
  <div id="app">
    <router-view/>
    <van-tabbar route>
      <van-tabbar-item to="/upgrade" icon="upgrade"></van-tabbar-item>
      <van-tabbar-item to="/" icon="home-o"></van-tabbar-item>
      <van-tabbar-item @click="scan" icon="scan" style="position:relative">
        <input accept="image/*" type="file" class="qrcode-input" ref="qrcode" @change="getQrImg">
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import $ from 'jQuery'
import qrcode from 'qrcode'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      initState: false
    }
  },
  components: {},
  computed: {
    endorseInfo () {
      if (!this.$store.state.itemIdList.length) {
        return undefined
      } else {
        return this.$store.state.itemIdList[this.$store.state.itemIdList.length - 1]
      }
    }
  },
  filters: {
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
    scan () {
      this.$refs.qrcode.click()
    },
    getQrImg () {
      var _vm = this
      var input = this.$refs.qrcode
      var idType = 'image'
      var file = input.files[0]
      if (!file) {
        this.$toast('Please select a picture')
        return
      }
      var str = file.type.toString()
      if (str.indexOf(idType) < 0) {
        this.$toast('Please select a picture')
        return
      }
      var imgUrl = this.createObjectURL(file)
      // console.log(imgUrl)
      if (!imgUrl) {
        this.$toast('Unable to get picture path')
        return
      }
      qrcode.callback = imgMsg => {
        input.value = ''
        if (imgMsg.indexOf('http') === 0) { // 成功
          console.log(imgMsg)
          // this.$store.state.user.address
          const symbol = imgMsg.split('#/scan/')[1]
          console.log(symbol)
          if (symbol === undefined) { // 外网链接
            location.href = imgMsg
            return
          }
          this.$router.push({
            name: 'scan',
            params: {
              id: symbol
            }
          })
          if (!this.endorseInfo) {
            return
          }
          const params = {
            symbol: this.endorseInfo.symbol,
            itemId: this.endorseInfo.itemId,
            viewer: this.$store.state.user.address,
            date: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
          console.log(params)
          this.$service.conact.endorseNft(params).catch(err => err)
        } else { // 失败
          this.$toast('Unable to recognize QR code link')
        }
      }
      qrcode.decode(imgUrl)
    },
    createObjectURL: function (file) {
      var url = null
      if (window.createObjectURL !== undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  }
}
</script>

<style lang="css">
@import '//at.alicdn.com/t/font_1963702_x7i9k49wrcs.css';
</style>

<style lang="scss">
@import '~normalize.css/normalize.css';

*, :after, :before {
  box-sizing: border-box;
}
html, body{
  height: 100%;
  background: #f7f8fa;
}
ul{
  padding: 0;
  margin: 0;
  list-style: none;
}
a{
  color: #0084FF;
  text-decoration: none;
}

#app{
  width: 100%;
  padding-bottom: 50px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

[v-cloak]{
  display: none!important;
}

// vant reset
body{
  .van-overlay{
    background-color: rgba(0,0,0,.5);
  }
}
.van-toast.custom-ui-loading{
  background-color: transparent;
}
.van-toast.custom-ui-toast{
  width: auto;
}

.container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.qrcode-input{
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: -1000px;
  right: 1000px;
}
</style>
