import DialogManager from '../../../src/manager'
import Vue from 'vue'
import { wrap, sleep } from '../../utils'
import Plugin from '../../../src'

describe('manager', () => {
  beforeAll(() => {
    Vue.use(Plugin)
  })

  let manager

  test('Create manager instance', () => {
    manager = new DialogManager({ context: { store: {} } })
    expect(manager).toBeInstanceOf(DialogManager)
  })

  test('Check register component', () => {
    const cmp = {}
    manager.component('foobar', cmp)
    expect(manager._components).toHaveProperty('foobar')
    expect(manager._components.foobar.component).toEqual(cmp)
  })

  test('Check creating component by getters', async () => {
    const foobar = await manager.show({
      template: '<p>{{ msg }}</p>',
      props: ['msg']
    }, {
      msg: 'foo'
    })
    const html = window.document.body.innerHTML
    expect(html.includes('<p>foo</p>')).toBe(true)
    foobar.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  test('Check asyncData', async () => {
    const dlg = await manager.show({
      template: '<p>{{ msg }}</p>',
      async asyncData () {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ msg: 'foo' }), 1)
        })
      }
    })
    expect(dlg.showed).toBe(true)
    const wrapper = wrap(dlg.vm)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.find('p').html()).toBe('<p>foo</p>')

    dlg.remove = jest.fn(dlg.remove)
    wrapper.destroy()
    expect(dlg.remove).toHaveBeenCalledTimes(1)

    expect(dlg.showed).toBe(false)
    await sleep(1)
    expect(document.body.innerHTML).toBe('')
  })

  /* test('Check reactivity', async () => {
    manager.layout('reactive', {
      props: ['prop1', 'prop2'],
      template: '<p>{{prop1}} {{prop2}}<slot/></p>'
    },
    {
      prop1: 'Overrided',
      prop2: 'bar'
    })

    const Cmp = {
      template: '<p>{{ a }} {{ b }} {{ testinput }}<input v-model="testinput"/></p>',
      data () {
        return {
          a: null,
          b: null,
          c: null,
          testinput: 'init'
        }
      },
      layout: 'reactive',
      created () {
        this.$set(this, 'c', null)
        this.$watch('a', (val) => {
          this.c = 'foo' + val
        })
      },
      watch: {
        a (val) {
          this.b = 'test' + val
        }
      }
    }

    const dlg = await manager.show(Cmp)
    expect(dlg.showed).toBe(true)
    expect(dlg.vmd.b).toEqual(null)
    dlg.vmd.a = 'data'
    await Vue.nextTick()
    expect(dlg.vmd.b).toEqual('testdata')
    expect(dlg.vmd.c).toEqual('foodata')
    await Vue.nextTick()
    expect(dlg.vmd.$el.innerHTML).toEqual('data testdata init<input>')
    const wrapper = wrap(dlg.vm)
    wrapper.find('input').element.value = 'new value'
    wrapper.find('input').trigger('input')
    expect(dlg.vmd.testinput).toEqual('new value')
    await Vue.nextTick()
    expect(dlg.vmd.$el.innerHTML).toEqual('data testdata new value<input>')
    dlg.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  }) */

  test('Check layout props', async () => {
    manager.layout('default', {
      props: ['prop1', 'prop2'],
      template: '<p><span>{{prop1}} {{prop2}}<div ref="dialog-instance"/></span></p>'
    },
    {
      prop1: 'Overrided',
      prop2: 'bar'
    })

    const dlg = await manager.show(
      {
        template: '<p>{{ prop1 }}</p>',
        layout: 'default',
        props: ['prop1']
      }, { prop1: 'foo' })

    expect(dlg.element.innerHTML).toMatchSnapshot()
    expect(dlg.element).toMatchSnapshot()
    dlg.close()
  })

  test('Check layout in array', async () => {
    manager.layout('default', {
      props: ['prop1', 'prop2'],
      template: '<p><span>{{prop1}} {{prop2}}<div ref="dialog-instance"/></span></p>'
    },
    {
      prop1: 'Overrided1',
      prop2: 'Overrided2'
    })

    const dlg = await manager.show({
      template: '<p>{{ prop1 }}</p>',
      props: ['prop1'],
      layout: ['default', { prop1: 'Overrided', prop2: 'bar' }]
    }, { prop1: 'foo' })

    expect(dlg.element.innerHTML).toMatchSnapshot()
    expect(dlg.element).toMatchSnapshot()
    dlg.close()
  })

  it('should work with extended layout components', async () => {
    manager.layout('extended', Vue.extend({
      props: ['prop1'],
      template: '<p><span>{{prop1}}<div ref="dialog-instance"></div></span><</p>'
    }))

    const dialog = Vue.extend({
      template: '<p>extended component</p>',
      layout: 'extended'
    })
    const dlg = await manager.show(dialog, { prop1: 'extended layout' })

    expect(dlg.element.innerHTML).toMatchSnapshot()
    // expect(dlg.element.innerHTML).toBe('extended layout<p>extended component</p>')
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
