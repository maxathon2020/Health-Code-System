<template>
  <div class="page page-index" ref="container">
    <div class="my-qrcode">My Health Code</div>
    <div class="page-main">
      <div>
        <div v-if="symbol" class="qrcode-wrap">
          <div class="qrcode-box">
            <div id="qrcode" ref="qrcode">
            </div>
          </div>
          <van-button size="small" class="view" round type="info" @click="gotoScan">View</van-button>
        </div>
        <div v-else style="color: #fff;">
          <van-button round type="info" icon="plus" @click="gotoUpgrade">Register now</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  data () {
    return {
      initState: false,
      qrcode: null
    }
  },
  components: {},
  computed: {
    symbol () {
      if (!this.$store.state.symbolList.length) {
        return undefined
      } else {
        return this.$store.state.symbolList[this.$store.state.symbolList.length - 1]
      }
    }
  },
  filters: {
  },
  mounted () {
    this.symbol && this.qrcodeInit()
  },
  destroyed () {
  },
  methods: {
    qrcodeInit () {
      this.qrcode = new QRCode('qrcode', {
        width: 150,
        height: 150,
        text: this.$constant.DOMAIN + '/maxonrow-backend/#/scan/' + this.symbol,
        render: 'canvas'
        // background: '#f0f',
        // foreground: '#ff0'
      })
    },
    gotoUpgrade () {
      this.$router.push({
        name: 'upgrade'
      })
    },
    gotoScan () {
      this.$router.push({
        name: 'scan',
        params: {
          id: this.symbol
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/style/mixin.scss';
.page-index{
  height: 100%;
  background: rgb(129, 216, 209);
  .page-main{
    height: calc(100% - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qrcode-box{
    background: #fff;
    border-radius: 6px;
    padding: 8px;
  }
  .my-qrcode{
    color: #fff;
    line-height: 60px;
    text-align: center;
    border-bottom: 1px solid #fff;
  }
  // .my-qrcode{
  //   color: #fff;
  //   font-size: 16px;
  //   font-weight: 700;
  //   margin-top: 12px;
  //   line-height: 2;
  //   text-align: center;
  // }
  .qrcode-wrap{
    text-align: center;
    .view{
      margin-top: 12px;
    }
  }
}
</style>
