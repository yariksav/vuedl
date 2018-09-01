import DialogManager from '../src/manager'
import Vue from 'vue'
import FooBar from './fixtures/foobar'
import AsyncData from './fixtures/async-data'
import Layout from './fixtures/layout'
import { wrap, sleep } from './utils'
import Plugin from '../src'

describe('manager', () => {
  beforeAll(() => {
    Vue.use(Plugin)
  })

  let manager

  test('Create manager instance', () => {
    manager = new DialogManager({ context: {store: {}} })
    expect(manager).toBeInstanceOf(DialogManager)
  })

  test('Check register component', () => {
    manager.component('foobar', FooBar)
    expect(manager._components).toHaveProperty('foobar')
  })

  test('Check creating component by getters', async () => {
    const foobar = await manager.show(FooBar, {
      name: 'Bar'
    })
    const html = window.document.body.innerHTML
    expect(html.includes('<p>Foo Bar</p>')).toBe(true)
    foobar.close()
    await sleep(1)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check asyncData', async () => {
    manager.component('AsyncData', AsyncData)
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
    await sleep(1)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check layout', async () => {
    manager.layout('default', Layout, { prop1: 'Overrided', prop2: 'Bar' })
    const cmp = { layout: 'default', ...AsyncData }
    const dlg = await manager.show(cmp, { prop1: 'Foo' })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('#title').exists()).toBe(true)
    expect(wrapper.find('#title').text()).toBe('Layout Foo Bar')
    expect(wrapper.find('p').text()).toBe('Async data')
    dlg.close()
  })

  test('Check layout in array', async () => {
    manager.layout('default', Layout)
    const cmp = { layout: ['default', { prop1: 'Overrided', prop2: 'Bar' }], ...AsyncData }
    const dlg = await manager.show(cmp, { prop1: 'Foo' })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('#title').text()).toBe('Layout Foo Bar')
    expect(wrapper.find('p').text()).toBe('Async data')
    dlg.close()
  })

  test('Check layout component', async () => {
    const cmp = { layout: Layout, ...AsyncData }
    const dlg = await manager.show(cmp, { prop1: 'Foo', prop2: 'Bar' })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('#title').text()).toBe('Layout Foo Bar')
    expect(wrapper.find('p').text()).toBe('Async data')
    dlg.close()
  })

  test('Check layout component in array', async () => {
    const cmp = {
      layout: [Layout, { prop1: 'Overrided', prop2: 'Bar' }],
      ...AsyncData
    }
    const dlg = await manager.show(cmp, { prop1: 'Foo' })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('#title').text()).toBe('Layout Foo Bar')
    expect(wrapper.find('p').text()).toBe('Async data')
    dlg.close()
  })

  // test('On hashchange', async () => {
  //   const foobar = await manager.show(FooBar, {
  //     name: 'Bar'
  //   })
  //   const html = window.document.body.innerHTML
  //   expect(html.includes('<p>Foo Bar</p>')).toBe(true)
  //   // foobar.close()
  //   // history.pushState({}, 'page 2', '/bar.html')
  //   // global.jsdom.changeUrl(window, 'test123')
  //   // window.location.href = 'test123'
  //   await sleep(1000)
  //   expect(document.body.innerHTML).toBe('')
  //   console.log(foobar, 'foobar')
  // })
})
