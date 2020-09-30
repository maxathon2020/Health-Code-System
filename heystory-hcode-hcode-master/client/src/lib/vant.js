import Vue from 'vue'
import enUS from 'vant/lib/locale/lang/en-US'

import { Locale, Cell, CellGroup, Checkbox, CheckboxGroup, Calendar, Form, Button, Tabbar, TabbarItem, Field, Radio, RadioGroup } from 'vant'

Locale.use('en-US', enUS)

// 注册全局组件
Vue.component(Button.name, Button)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Calendar)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Cell)
Vue.use(CellGroup)
