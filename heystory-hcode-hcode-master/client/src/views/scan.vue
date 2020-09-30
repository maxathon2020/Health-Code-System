<template>
  <div class="page page-index" ref="container">
    <div style="padding-bottom: 16px">
      <div class="title">Health Code Information</div>
      <div v-for="item in formList" :key="item.key">
        <div class="label">{{item.label}}</div>
        <van-cell :value="item.value" />
      </div>
    </div>
  </div>
</template>

<script>
const formList = [
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'tel',
    label: 'Cell Phone'
  },
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'sex',
    label: 'Gender'
  },
  {
    key: 'birthday',
    label: 'Date of Birth'
  },
  {
    key: 'address',
    label: 'Address'
  },
  {
    key: 'health',
    label: 'Status'
  },
  {
    key: 'contactHistory',
    label: 'Contact'
  }
]
export default {
  data () {
    return {
      initState: false,
      formList: []
    }
  },
  components: {},
  computed: {
  },
  filters: {
  },
  mounted () {
    this.init()
  },
  destroyed () {
  },
  watch: {
    '$route.params.id': function (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      const id = this.$route.params.id
      console.log(id)
      if (!id) {
        this.$router.replace({
          name: 'scan'
        })
      } else {
        const list = []
        this.$service.conact.queryNft(id).then(res => {
          if (!res || res.code !== 200) {
            return
          }
          const data = JSON.parse(res.data)
          formList.forEach(item => {
            const newItem = this.$clone(item)
            newItem.value = this.dealValue(data, item.key)
            list.push(newItem)
          })
          this.formList = list
        })
      }
    },
    dealValue (data, key) {
      if (key === 'sex') {
        const item = this.$constant.SEX.find(item => item.key === data[key])
        return item.label
      } else if (key === 'contactHistory') {
        const item = this.$constant.HISTORY.find(item => item.key === data[key])
        return item.label
      } else if (key === 'health') {
        let strArr = []
        const items = this.$constant.HEALTH.filter(item => data[key].includes(item.key))
        strArr = items.map((item) => {
          return item.label
        })
        return strArr.join(', ')
      } else {
        return data[key]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/style/mixin.scss';
.title{
  line-height: 60px;
  text-align: center;
  color: #777;
  border-bottom: 1px solid #efefef;
}
.label{
  line-height: 16px;
  color: rgba(69, 90, 100, 0.6);
  padding: 16px;
}
</style>
