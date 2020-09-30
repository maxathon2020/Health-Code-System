<template>
  <div class="page page-index" ref="container">
    <van-form @submit="onSubmit">
      <div class="title">Self-Information Registration</div>
      <van-field
        required
        v-model="form.name"
        name="name"
        label="Name"
        placeholder="Please fill in your name"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field
        required
        v-model="form.tel"
        name="tel"
        label="Cell Phone"
        placeholder="Please fill in your cell phone"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field
        required
        v-model="form.id"
        name="id"
        label="ID"
        placeholder="Please fill in your ID"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field name="sex" label="Gender" required>
        <template #input>
          <van-radio-group v-model="form.sex" direction="horizontal">
            <van-radio name="1">Male</van-radio>
            <van-radio name="2">Female</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        required
        v-model="form.birthday"
        name="birthday"
        label="Date of Birth"
        placeholder="Please fill in your birthday"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field
        required
        v-model="form.address"
        name="address"
        label="Address"
        placeholder="Please fill in your address"
        :rules="[{ required: true, message: '' }]"
      />
      <van-field required name="health" label="Status" :rules="[{ required: true, message: 'Please fill in your status', validator: checkboxValidator }]">
        <template #input>
          <van-checkbox-group v-model="form.health">
            <van-checkbox name="1" shape="square">Healthy</van-checkbox>
            <van-checkbox name="2" shape="square">Fever, under 37.3</van-checkbox>
            <van-checkbox name="3" shape="square">Fever, above 37.3</van-checkbox>
            <van-checkbox name="4" shape="square">Dry cough</van-checkbox>
            <van-checkbox name="5" shape="square">Tiredness</van-checkbox>
            <van-checkbox name="6" shape="square">Others</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <van-field name="contactHistory" label="Contact" required>
        <template #input>
          <van-radio-group v-model="form.contactHistory" direction="horizontal">
            <van-radio name="1" style="margin-bottom: 8px">No</van-radio>
            <van-radio name="2">Yes</van-radio>
          </van-radio-group>
          <div>If has physical contact with comfirmed case in 14 days.</div>
        </template>
      </van-field>
      <van-field name="ensure" label="" :rules="[{ required: true, message: 'Please check this box', validator: checkboxValidator }]">
        <template #input>
          <van-checkbox-group v-model="form.ensure">
            <van-checkbox name="1" shape="square">I verify the information I have provided is truthful and accurate.</van-checkbox>
          </van-checkbox-group>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :loading="saveLoading">
          Submit
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
const form = {
  name: '',
  tel: '',
  id: '',
  sex: '1',
  birthday: '',
  address: '',
  health: [],
  contactHistory: '1',
  ensure: []
}
export default {
  data () {
    return {
      showCalendar: false,
      form: this.$clone(form),
      saveLoading: false
    }
  },
  computed: {
    symbol () {
      if (!this.$store.state.symbolList.length) {
        return undefined
      } else {
        return this.$store.state.symbolList[this.$store.state.symbolList.length - 1]
      }
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      if (this.symbol) {
        console.log(this.$store.state.symbolList)
        this.$service.conact.queryNft(this.symbol).then(res => {
          if (!res || res.code !== 200) {
            return
          }
          const data = JSON.parse(res.data)
          const formNew = {}
          for (let key in form) {
            formNew[key] = data[key]
          }
          this.form = formNew
        })
      } else {
        this.form = this.$clone(form)
      }
    },
    onSubmit (values) {
      let api = 'createNft'
      const data = this.$clone(values)
      data.wallet = this.$store.state.user.address
      const params = {
        data: JSON.stringify(data),
        mnemonic: this.$store.state.user.mnemonic
      }
      this.saveLoading = true
      this.$service.conact[api](params).then(res => {
        this.saveLoading = false
        if (res && res.code === 200) {
          this.$comJs.updateSymbolList(res.data.symbol)
          this.$comJs.updateItemIdList(res.data)
          this.$store.commit('setUser', this.$comJs.getUserInfo())
          this.$store.commit('setSymbolList', res.data.symbol)
          this.$store.commit('setItemIdList', res.data)
          this.$toast('Successful~')
          this.$router.push({
            name: 'index'
          })
        } else {
          this.$toast('Please try again~')
        }
      }).catch(e => {
        this.$toast('Please try again~')
        this.saveLoading = false
      })
    },
    checkboxValidator (value, rule) {
      return value.length
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
.van-checkbox{
  margin-bottom: 8px;
}
</style>
