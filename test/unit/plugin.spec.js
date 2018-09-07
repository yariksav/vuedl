import Plugin from '../../src'
import DialogManager from '../../src/manager'
import Vue from 'vue'

describe('plugin', () => {
  // let manager

  test('Register plugin in vue instance', () => {
    Vue.use(Plugin)
    expect(Vue.prototype.$dialog).toBeInstanceOf(DialogManager)
  })
})
