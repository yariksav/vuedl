import Plugin from '../src'
import DialogManager from '../src/manager'
import Vue from 'vue'

describe('Component', () => {
  // let manager

  test('Register plugin in vue instance', () => {
    Vue.use(Plugin)
    expect(Vue.prototype.$dialog).toBeInstanceOf(DialogManager)
    // manager = Vue.prototype.$dialog
  })

  // test('Check throws when register with reserved names', () => {
  //   expect(manager).toBeInstanceOf(DialogManager)
  //   expect(() => {
  //     manager.register('register', {})
  //   }).toThrowError('Name "register" is reserved in dialog')
  // })

  // test('Check register component', () => {
  //   manager.register('SimpleComponent', SimpleComponent)
  //   expect(manager._components).toHaveProperty('SimpleComponent')
  //   const simple = await manager.SimpleComponent({ propsData: { name: 'world'}} )
  //   expect(document.getElementById('simple-content').innerHTML.trim()).toBe(`Hello world`)
  // })
})
