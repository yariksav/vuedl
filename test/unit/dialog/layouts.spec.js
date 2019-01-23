import Dialog from '../../../src/dialog'
import Vue from 'vue'
import activable from '../../../src/mixins/activable'
// import DialogView from '../../../src/components/view'
// import { mount } from '../../utils'

describe('dialog layouts', () => {
  beforeAll(() => {
    // Vue.component('dialog-view', DialogView)
    // Dialog.prototype.context = context
  })

  // test('Check default layouts when not sended', async () => {
  //   const dlg = new Dialog({
  //     template: '<p>foo</p>'
  //   })
  //   // expect(dlg._wrapper).toHaveProperty('component')
  //   // await dlg.show()
  //   // expect(dlg.element).toMatchSnapshot()
  //   // // expect(asyncData).toHaveBeenCalledTimes(1)
  //   // // expect(dialog.vmd.$data).toHaveProperty('msg', 'foo')
  //   // expect(dlg.innerHTML).toBe('<p>foo</p>')
  //   // dialog.close()
  // })

  test('check error without component', () => {
    expect(() => {
      new Dialog() // eslint-disable-line no-new
    }).toThrow()
  })

  test('Should work with layout with component property', async () => {
    const layout = {
      template: '<div><div ref="dialog-instance"/></div>'
    }

    const dialog = new Dialog({
      template: '<p>foo</p>'
    }, {
      layout: { component: layout }
    })
    await dialog.show()
    expect(dialog.element).toMatchSnapshot()
    dialog.close()
  })

  it('Should work with layout', async () => {
    const dialog = new Dialog({
      template: '<p>foo</p>',
      layout: {
        template: '<div :width="getWidth"><div ref="dialog-instance"/></div>'
      }
    })
    await dialog.show()
    expect(dialog.element).toMatchSnapshot()
    expect(dialog.element.textContent).toBe('foo')
    expect(dialog.vm.isLayout).toBe(true)
    expect(dialog.vm.getWidth).toBe('450px')
    dialog.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  it('Should close when in not persistent and not loading state', async () => {
    const dialog = new Dialog({
      template: '<p>foo</p>',
      layout: {
        template: '<div :width="getWidth"><div ref="dialog-instance"/></div>'
      }
    })
    await dialog.show({ width: '2el' })
    expect(dialog.element).toMatchSnapshot()
    dialog.vm.dismiss()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  // it('Should not close when in persistent or loading state', async () => {
  //   const dialog = new Dialog({
  //     template: '<p>foo</p>',
  //     layout: {
  //       template: '<div><slot/></div>'
  //     }
  //   })
  //   await dialog.show()
  //   dialog.loading = true
  //   dialog.vm.dismiss()
  //   dialog.close()
  //   // expect(document.body.innerHTML).toBe('')
  // })

  it('Should not hide when in persistent or loading state', async () => {
    const dialog = new Dialog({
      template: '<p>foo</p>',
      layout: {
        template: '<div><div ref="dialog-instance"/></div>'
      }
    })
    await dialog.show()
    dialog.vm.$el.remove = undefined
    dialog.close()
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  it('Should close when dialog is activable', async () => {
    const dialog = new Dialog({
      template: '<p>foo</p>',
      mixins: [activable],
      layout: {
        template: '<div><div ref="dialog-instance"/></div>'
      }
    })
    await dialog.show()
    dialog.vmd.isActive = false
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })
})
