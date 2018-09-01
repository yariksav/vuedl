import Dialog from '../src/dialog'
import DialogManager from '../src/manager'
import Layout from './fixtures/layout'
import Confirm from '../src/components/Confirm'
import { wrap, sleep } from './utils'
import FooBar from './fixtures/foobar'
import Returnable from '../src/mixins/returnable'

describe('manager', () => {
  let manager

  test('Create manager instance', () => {
    manager = new DialogManager({ context: {store: {}} })
    expect(manager).toBeInstanceOf(DialogManager)
    manager.layout('default', Layout)
    manager.component('confirm', Confirm)
  })

  test('returnable', async () => {
    const dlg = new Dialog(Object.assign(FooBar, { mixins: [ Returnable ] }))
    await dlg.show()
    expect(typeof dlg.vm.return).toBe('function')
    setTimeout(() => {
      dlg.vm.return(123)
    }, 10)
    let res = await dlg.wait()
    expect(res).toBe(123)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check confirm', async () => {
    let dlg = await manager.confirm({ text: 'test', actions: ['ok', 'cancel'] })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('.button-key-ok').exists()).toBe(true)
    setTimeout(() => {
      wrapper.find('.button-key-ok').trigger('click')
    }, 10)
    let res = await dlg.wait()
    expect(res).toBe('ok')
    await sleep(10)
    expect(document.body.innerHTML).toBe('')
  })

  test('Check confirm with btns true|false', async () => {
    let dlg = await manager.confirm({ text: 'test', actions: {'true': 'Yes', 'false': 'No'} })
    const wrapper = wrap(dlg.vm)
    expect(wrapper.find('.button-key-true').exists()).toBe(true)
    setTimeout(() => {
      wrapper.find('.button-key-true').trigger('click')
    }, 10)
    let res = await dlg.wait()
    expect(res).toBe(true)
    await sleep(10)
    expect(document.body.innerHTML).toBe('')
  })
})
