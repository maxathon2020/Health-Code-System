import Vue from 'vue'
import conact from './conact'

const service = {
  conact
}

Vue.prototype.$service = Vue.service = service
