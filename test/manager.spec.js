import DialogManager from '../src/manager'
import Vue from 'vue'
import FooBarComponent from './fixtures/foobar'
import AsyncData  from './fixtures/async-data'
import Layout  from './fixtures/layout'
import { createWrapper } from '@vue/test-utils'
import { wrap } from './utils'
import Plugin from '../src'

describe('manager', () => {

  beforeAll(() => {
    Vue.use(Plugin)
  })

  let manager

  test('Create manager instance', () => {
    manager = new DialogManager({vue: Vue, context: {store: {}}})
    expect(manager).toBeInstanceOf(DialogManager)
  })

  test('Check throws when register with reserved names', () => {
    expect(manager).toBeInstanceOf(DialogManager)
    expect(() => {
      manager.register('register', FooBarComponent)
    }).toThrowError('Name "register" is reserved in dialog')
  })

  test('Check register component', () => {
    manager.register('foobar', FooBarComponent)
    expect(manager._components).toHaveProperty('foobar')
  })

  // test('Check register without name', () => {
  //   manager.register(AsyncData)
  //   expect(manager._components).toHaveProperty('foobar')
  // })

  test('Check creating component by getters', async () => {
    const foobar = await manager.show(FooBarComponent, { name: 'Bar'})
    const html = window.document.body.innerHTML
    expect(html.includes('<p>Foo Bar</p>')).toBe(true)
    foobar.close()
    expect(document.body.innerHTML).toBe('')
  })

  test('Check asyncData', async () => {
    manager.register('AsyncData', AsyncData)
    const dlg = await manager.AsyncData()
    expect(dlg.showed).toBe(true)
    const wrapper = wrap(dlg.vm)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('p').html()).toBe('<p>Async data</p>')

    dlg.remove = jest.fn(dlg.remove)
    wrapper.destroy()
    expect(dlg.remove).toHaveBeenCalledTimes(1)

    expect(dlg.showed).toBe(false)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check layout', async () => {
    manager.layout('default', Layout)
    // manager
    const cmp = Object.assign({layout: 'default'}, AsyncData)
    const dlg = await manager.show(cmp)
    console.log(dlg.element.innerHTML)
    // expect(dlg.show()).rejects.toThrowError('Error in asyncData')
    // expect(dlg.element).toBe(null)
    // expect(dlg.vm).toBe(null)
  })

})
