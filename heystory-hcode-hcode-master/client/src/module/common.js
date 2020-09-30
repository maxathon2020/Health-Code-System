import util from '@/lib/util'
import { LOGIN_TOKEN } from '@/config/constant'

const comJs = {
  getUserInfo () {
    const user = util.getStorage(LOGIN_TOKEN)
    if (user) {
      return JSON.parse(user)
    } else {
      return false
    }
  },
  setUserInfo (val) {
    util.setStorage(LOGIN_TOKEN, JSON.stringify(val))
  },
  updateSymbolList (val) {
    const user = this.getUserInfo()
    user.symbolList.push(val)
    this.setUserInfo(user)
  },
  updateItemIdList (val) {
    const user = this.getUserInfo()
    user.itemIdList.push(val)
    this.setUserInfo(user)
  },
  setLoginCookie (value) {
  },
  removeLoginCookie () {
  }
}

export default comJs
