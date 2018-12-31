import Dialog from '../../../src/dialog'
import DialogManager from '../../../src/manager'
import Confirm from '../../../src/components/Confirm'
import { wrap } from '../../utils'
import Returnable from '../../../src/mixins/returnable'
import Vue from 'vue'

describe('manager', () => {
  let manager

  test('Create manager instance', () => {
    manager = new DialogManager({ context: { store: {} } })
    expect(manager).toBeInstanceOf(DialogManager)
    manager.component('confirm', Confirm)
  })

  test('returnable', async () => {
    const dlg = new Dialog({
      mixins: [ Returnable ],
      template: '<p></p>'
    })
    await dlg.show()
    expect(typeof dlg.vmd.return).toBe('function')
    expect(dlg.element).toMatchSnapshot()
    setTimeout(() => {
      dlg.vmd.return(123)
    }, 5)
    let res = await dlg.wait()
    expect(res).toBe(123)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check confirm', async () => {
    let dlg = await manager.confirm({
      text: 'test',
      actions: ['ok', 'cancel']
    })
    const wrapper = wrap(dlg.vm)
    expect(dlg.vm.$el).toMatchSnapshot()
    setTimeout(() => {
      wrapper.find('[action-key=ok]').trigger('click')
    }, 5)
    let res = await dlg.wait()
    expect(res).toBe('ok')
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  test('Check confirm with btns true|false', async () => {
    let dlg = await manager.confirm({
      text: 'test',
      actions: { 'true': 'Yes', false: 'No' }
    })
    const wrapper = wrap(dlg.vm)
    expect(dlg.element).toMatchSnapshot()
    expect(wrapper.find('[action-key=true]').exists()).toBe(true)
    expect(wrapper.find('[action-key=false]').exists()).toBe(true)
    setTimeout(() => {
      wrapper.find('[action-key=true]').trigger('click')
    }, 10)
    let res = await dlg.wait()
    expect(res).toBe(true)
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })

  test('Check confirm with handle functions', async () => {
    let dlg = await manager.confirm({
      text: 'test',
      actions: {
        false: 'No',
        true: {
          text: 'Yes',
          handle: () => {
            return new Promise((resolve) => {
              setTimeout(() => resolve({ msg: 'foo' }), 10)
            })
          }
        }
      }
    })
    const wrapper = wrap(dlg.vm)
    expect(dlg.element).toMatchSnapshot()
    setTimeout(() => {
      wrapper.find('[action-key=true]').trigger('click')
      Vue.nextTick(() => {
        expect(wrapper.find('[action-key=true]').element.hasAttribute('disabled')).toBe(true)
        expect(dlg.element).toMatchSnapshot()
      })
    }, 5)
    let res = await dlg.wait()
    expect(res).toEqual({ msg: 'foo' })
    await Vue.nextTick()
    expect(document.body.innerHTML).toBe('')
  })
})
